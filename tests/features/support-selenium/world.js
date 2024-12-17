import chrome from 'selenium-webdriver/chrome.js';
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import seleniumWebdriver, { By, until } from 'selenium-webdriver';
import { timeout, headless } from '../../config.js';

// Set the default timeout to 120 seconds (120000 ms)
setDefaultTimeout(120000);

const options = new chrome.Options();
const GITHUB_ACTIONS = process.env['GITHUB_ACTIONS'] === 'true';

(headless || GITHUB_ACTIONS) && options.addArguments('--headless=new');

export const driver = new seleniumWebdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

class CustomWorld {
  constructor() {
    this.driver = driver;
  }

  gotoUrl(url) {
    return this.driver.get(url);
  }

  getText(element) {
    return element.getText();
  }

  runScriptInBrowser(script) {
    return this.driver.executeScript(script);
  }

  get(cssSelector) {
    return this.driver.findElement(By.css(cssSelector));
  }

  getMany(cssSelector) {
    return this.driver.findElements(By.css(cssSelector));
  }

  getByXPath(xPath) {
    return this.driver.findElement(By.xpath(xPath));
  }

  getManyByXPath(xPath) {
    return this.driver.findElements(By.xpath(xPath));
  }

  getWait(cssSelector, maxTimeToWaitMs = 5000) {
    return this.driver.wait(
      until.elementLocated(By.css(cssSelector)), maxTimeToWaitMs);
  }

  getByXPathWait(xPath, maxTimeToWaitMs = 5000) {
    return this.driver.wait(
      until.elementLocated(By.xpath(xPath)), maxTimeToWaitMs);
  }

}

setDefaultTimeout(timeout);
setWorldConstructor(CustomWorld);