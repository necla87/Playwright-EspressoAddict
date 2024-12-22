
import {  When, Then, world} from '@cucumber/cucumber';
import { expect } from 'chai';
import { cheatIfNeeded,checkIfDescriptionContainsString, getAllCurrentMenuChoices, getValueOfScores, getMenuChoiceElement } from './helpers.js';

When( 'I wait until the event {string} occurs', async function ( event_text ) {
  while ( await checkIfDescriptionContainsString( this, event_text, true ) === false ) {
   
    await cheatIfNeeded( this );

    let { choiceElements, choices } = await getAllCurrentMenuChoices( this );

    let index = choices.indexOf( 'Wait' );
    if ( index === -1 ) {
      console.log( `"Wait" not found. Available choices: ${ choices.join( ', ' ) }` );
      throw new Error( `"Wait" not found. Available choices: ${ choices.join( ', ' ) }` );
    }

    let menuChoiceElement = choiceElements[ index ];
    if ( !menuChoiceElement ) {
      throw new Error( 'Menu choice "Wait" is not clickable.' );
    }
    await menuChoiceElement.click();
  }
} );

When('I bought {float} espressos', async function (count) {
  for ( let i = 0; i < count; i++ ) {
    let menuChoiceElement = await getMenuChoiceElement( world, 'Buy an espresso' );
    await menuChoiceElement.click();
  }
});

Then('the value of my {string} should be {float}', async function(sectionName, count){
  expect( await getValueOfScores( this, sectionName ) ).to.equal( count );
});

Then( 'I should see the text {string}', async function ( expectedText ) {
  
  await checkIfDescriptionContainsString( this, expectedText, true );
} );