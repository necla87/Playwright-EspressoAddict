
import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import {
  getMenuChoiceElement,
  checkIfDescriptionContainsString,
  cheatIfNeeded
} from './helpers.js';

When('I wait long enough for the description to contain the text {string}', async function (partOfDescription) {
  // press wait repeatedly until the description contains a certain text
  while (!await checkIfDescriptionContainsString(this, partOfDescription, true)) {
    // cheat if the health is low, since each wait deteriorates the health
    // and we don't want flaky tests (that fail every once in a while)
    await cheatIfNeeded(this);
    // press wait
    let waitButton = await getMenuChoiceElement(this, 'Wait');
    await waitButton.click();
  }
});

Then('my hipster bag should contain {string}', async function (thing) {
  // get all the text in the hipster bag element
  let textInBag = await this.getText(await this.get('.bag-content'));
  // check if the string thing is part of the text
  expect(textInBag).to.contain(thing);
});