// this will scrape the linkedin page of the user
const path = require("path");
const fs = require("fs");

// axios
const axios = require("axios");

// puppeteer
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const scrapeSite1 = async (jobDetails, userDetails) => {
  // download cv
  const fileUrl = userDetails.resume_file;
  const downloadDir = path.join(__dirname, "downloads");
  const downloadPath = path.join(downloadDir, "cv.pdf");

  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    // Save the file locally
    fs.writeFileSync(downloadPath, response.data);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }

  // open puppeteer
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 821,
    deviceScaleFactor: 1,
  });

  // visit from the top
  await page.goto(jobDetails.jobUrl, {
    waitUntil: "networkidle2",
    timeout: 12000,
  });
  try {
    //   fill details
    await page.waitForSelector("#first_name");
    await page.type("#first_name", userDetails.first_name, {
      delay: 100,
    });
    await page.waitForSelector("#last_name");
    await page.type("#last_name", userDetails.last_name, {
      delay: 100,
    });
    await page.waitForSelector("#email");
    await page.type("#email", userDetails.email, {
      delay: 100,
    });
    await page.waitForSelector("#phone");
    await page.type("#phone", userDetails.phone, {
      delay: 100,
    });

    // // upload file
    const csvFileName = "downloads/cv.pdf";
    const absolutePath = path.resolve(__dirname, csvFileName);
    const filePath = absolutePath;
    console.log(filePath);
    const elementHandle = await page.$('[type="file"]');
    await elementHandle.uploadFile(filePath);
    await elementHandle.evaluate((upload) =>
      upload.dispatchEvent(new Event("change", { bubbles: true }))
    );
    // linkedin
    await page.waitForSelector(
      "#job_application_answers_attributes_0_text_value"
    );
    await page.type(
      "#job_application_answers_attributes_0_text_value",
      userDetails.linkedin_url,
      {
        delay: 100,
      }
    );

    await page.waitForTimeout(3000);

    //   press submit
    await page.evaluate(() => {
      document.querySelector("#submit_app").click();
    });
  } catch (error) {
    console.log(error);
  }

  console.log("applyied successfully");
  await page.waitForTimeout(5000);
  await browser.close();
};

module.exports = scrapeSite1;
