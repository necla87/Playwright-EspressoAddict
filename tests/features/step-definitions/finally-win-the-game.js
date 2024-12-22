
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { navigateTo, getWhereIAm, getMenuChoiceElement, checkIfDescriptionContainsString, cheatIfNeeded } from './helpers.js'



Given('that I have navigated to the position {string}', async function (to) {
  await navigateTo(this, to);
});





//Someone in the audience throws you a fiver 
Then('I click on the button {string}', async function (button) {
  let jamButton = await getMenuChoiceElement(this, button);
  await jamButton.click();
});

Then('your money inscreases to {float}', async function (expectedMoney) {
  let moneyElement = await this.get('.money .val');

  // Get the text content of the element
  let moneyText = await moneyElement.textContent();

  // Parse the text content to a float
  let moneyN = parseFloat(moneyText);

  // Now check that the parsed value matches the expected value
  expect(moneyN).to.equal(expectedMoney);
  console.log(moneyN, expectedMoney)
});

//I should give a beer to the barista
//Repeated from earlier steps.

//Win the game
When('the description contain the text {string}', async function (b) {
  let text = await checkIfDescriptionContainsString(this, b, true)
});

Then('I click repeatedly button {string} until I win', async function (button) {
  // continue to wait until we die
  while (await getWhereIAm(this) !== 'I won') {
    let menuChoiceElement = await getMenuChoiceElement(this, button);
    await menuChoiceElement.click();
  }
});
