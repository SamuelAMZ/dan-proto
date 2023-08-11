// this will scrape the linkedin page of the user

// puppeteer
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// helpers
const autoScroll = require("../utils/autoScroll");

const scrapeLinkedin = async (linkedinUrl) => {
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

  // visit from the top of the archives
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  //   typing the login
  await page.waitForSelector("#username");
  await page.type("#username", "louisavignon72@gmail.com", {
    delay: 100,
  });

  await page.waitForSelector("#password");
  await page.type("#password", "Afiwa18hp@@@", {
    delay: 100,
  });

  //   click for search
  const launchSearchBtn = await page.$(
    "[data-litms-control-urn='login-submit']"
  );
  await launchSearchBtn.evaluate((b) => b.click());

  //   wait
  await page.waitForTimeout(5000);

  // go to link
  console.log(1);
  try {
    await page.goto(linkedinUrl, {
      waitUntil: "networkidle2",
      timeout: 12000,
    });
  } catch (error) {
    console.log(error);
  }
  console.log(2);
  await page.waitForTimeout(2000);

  // scrape user exp (jobs title and desc)
  // scroll to bottom
  console.log(3);
  await autoScroll(page);
  await page.waitForTimeout(2000);

  console.log(4);
  try {
    //   start scraping
    const userDetailsObj = await page.evaluate(async () => {
      const userDetailsObjDom = {};

      // actual role
      userDetailsObjDom.actualRole = document
        .querySelector(".pv-text-details__left-panel .text-body-medium")
        ?.textContent?.trim()
        .toLowerCase();

      // education
      let educationArr = [];
      Array.from(
        document
          .querySelector("#education")
          .parentElement.querySelector(".pvs-list__outer-container ul").children
      ).forEach((elm) => {
        educationArr.push(elm.querySelector("a").textContent.trim());
      });
      userDetailsObjDom.education = educationArr;

      // work experience
      let workExperienceArr = [];
      Array.from(
        document
          .querySelector("#experience")
          .parentElement.querySelector(".pvs-list__outer-container ul").children
      ).forEach((elm) => {
        workExperienceArr.push(
          elm
            .querySelector(".pvs-entity.pvs-entity--padded > :nth-child(2)")
            .textContent.trim()
        );
      });
      userDetailsObjDom.workExperience = workExperienceArr;

      return userDetailsObjDom;
    });

    console.log(5);
    // close browser
    await browser.close();

    // return all scraped text
    return `${userDetailsObj.actualRole} \n\n ${userDetailsObj.education} \n\n ${userDetailsObj.workExperience}`;
  } catch (error) {
    console.log(error);
  }
};

module.exports = scrapeLinkedin;
