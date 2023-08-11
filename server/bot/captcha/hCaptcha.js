// document.querySelector("form  iframe").src.split('sitekey=')[1].split('&')[0]

const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.CAPTCHA_KEY;

const solveHCaptcha = async (page) => {
  // Wait for the reCAPTCHA iframe to be present
  await page.waitForSelector("form  iframe", { timeout: 1500 });

  // Get the site key from the iframe source
  const iframeSrc = await page.evaluate(() => {
    const iframe = document.querySelector("form  iframe");
    return iframe ? iframe.src : null;
  });

  if (!iframeSrc) {
    console.error("Unable to find reCAPTCHA iframe.");
    return;
  }

  // Extract the site key from the iframe source
  const siteKey = iframeSrc.split("sitekey=")[1].split("&")[0].trim();

  // Send the site key to 2captcha for solving the CAPTCHA
  const captchaResponse = await axios.post("http://2captcha.com/in.php", {
    key: API_KEY,
    method: "hcaptcha",
    sitekey: siteKey,
    pageurl: page.url(),
    json: 1,
  });

  if (captchaResponse.data.status !== 1) {
    console.error("Failed to get the CAPTCHA response from 2captcha.");
    return;
  }

  const captchaId = captchaResponse.data.request;

  // Wait for the CAPTCHA to be solved by 2captcha
  await new Promise((resolve) => setTimeout(resolve, 30000)); // Adjust the timeout as needed

  // Poll 2captcha for the CAPTCHA token
  let captchaResult;
  while (!captchaResult) {
    const captchaResultResponse = await axios.get(
      `http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${captchaId}&json=1`
    );
    if (captchaResultResponse.data.status === 1) {
      captchaResult = captchaResultResponse.data.request;
    } else if (captchaResultResponse.data.request === "CAPCHA_NOT_READY") {
      // Wait and try again
      console.log("trying again to solve captcha...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else if (
      captchaResultResponse.data.request !== "CAPCHA_NOT_READY" &&
      captchaResultResponse.data.status === 0
    ) {
      console.log(captchaResultResponse.data);
      console.log("error solving captcha");
      return;
    }
  }

  // Inject the CAPTCHA token into the page
  let token = await page.evaluate((captchaToken) => {
    const captchaInputElement = document.querySelector(
      '[name="g-recaptcha-response"]'
    );
    const hcaptchaInputElement = document.querySelector(
      '[name="h-captcha-response"]'
    );
    if (captchaInputElement && hcaptchaInputElement) {
      captchaInputElement.style.display = "block";
      hcaptchaInputElement.style.display = "block";
      captchaInputElement.innerHTML = captchaToken;
      hcaptchaInputElement.innerHTML = captchaToken;

      const iframe = document.querySelector("form  iframe");
      let responseElm = iframe.getAttribute("data-hcaptcha-response");
      responseElm = captchaToken;
      // document.querySelector("#captcha-form").submit();
    }
  }, captchaResult);

  return token;
};

module.exports = solveHCaptcha;
