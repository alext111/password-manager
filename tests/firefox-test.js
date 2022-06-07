const { locateWith } = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

(async function openFirefoxTest() {
    try {
        let driver = await new Builder().forBrowser('firefox').build();
        await driver.get('http://localhost:3001');
        await driver.getTitle();

        driver.manage().setTimeouts({implicit: 1000})
        driver.manage().window().maximize();

        const createPasswordLink = await getElementByXpath("Create Password");

        await driver.quit();
    }  catch (error) {
        console.log(error);
    }
})();

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }