// this will scrape the linkedin page of the user
const path = require("path");
const fs = require("fs");

// axios
const axios = require("axios");

// helpers
const solveHCaptcha = require("./captcha/hCaptcha");

// puppeteer
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const scrapeSite2 = async (jobDetails, userDetails) => {
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
    // // upload file
    const csvFileName = "downloads/cv.pdf";
    const absolutePath = path.resolve(__dirname, csvFileName);
    const filePath = absolutePath;
    const elementHandle = await page.$('[type="file"]');
    await elementHandle.uploadFile(filePath);
    await elementHandle.evaluate((upload) =>
      upload.dispatchEvent(new Event("change", { bubbles: true }))
    );
    await page.waitForTimeout(3000);

    // fill other details
    await page.waitForSelector("#field-78533-685007");
    await page.type("#field-78533-685007", userDetails.first_name, {
      delay: 100,
    });
    await page.waitForSelector("#field-78533-685010");
    await page.type("#field-78533-685010", userDetails.last_name, {
      delay: 100,
    });
    await page.waitForSelector("#field-78533-685013");
    await page.type("#field-78533-685013", userDetails.email, {
      delay: 100,
    });
    await page.waitForSelector("#field-78533-685016");
    await page.type("#field-78533-685016", userDetails.address, {
      delay: 100,
    });
    const selectCountry = await page.waitForSelector(
      "select#field-78533-2127400"
    );
    await selectCountry.select("227");

    await page.waitForSelector("#field-78533-685028");
    await page.type("#field-78533-685028", userDetails.phone, {
      delay: 100,
    });
    const selectElement = await page.$("select#field-78533-697780");
    await selectElement.select("822433");

    // solve capthca
    let token = await solveHCaptcha(page);

    //   press submit
    await page.evaluate(() => {
      document.querySelector("form > div.sc-brqgnP.kDzpmu > button").click();
    });
  } catch (error) {
    console.log(error);
  }

  console.log("applyied successfully");

  await page.waitForTimeout(7000);
  await browser.close();
};

module.exports = scrapeSite2;
