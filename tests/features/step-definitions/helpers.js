import { world } from '@cucumber/cucumber';
import { expect } from 'chai';

// -----------------------------------------------------------------------
// Helpers used in several step definitions in the feature "win-the-game"
// (if we are going to use them in more features
//  consider refactoring to own file/files)
// -----------------------------------------------------------------------

// Note: The world parameter sent to the helpers should be the
// Cucucmber world object ("this" inside the step definitions)

export async function getWhereIAm(world) {
  // translate images (since less variation in those than in descriptions)
  // into where i am on the 'map'
  let imageToLocationMap = {
    'cloud-forest-cafe': 'outside the cafe',
    'inside-cafe': 'inside the cafe',
    'inside-cafe-barista-phone': 'inside the cafe',
    'street': 'on an empty street',
    'bar': 'in a crowded bar',
    'country-side': 'in the country-side',
    'music-scene': 'at the concert',
    'dead': 'I died',
    'win': 'I won',
    'help': 'looking at the help page'
  };
  // check image source
  let imageSource;
  // while loop needed since playwright sometimes returns
  // null as the image source when images changes
  while (true) {
    let imageElement = await world.get('main .big-image');
    imageSource = await imageElement.getAttribute('src');
    if (imageSource) { break; }
    await world.sleep(20);
  }
  // get the image name from the image source
  let imageName = imageSource.split('/').slice(-1)[0].split('.')[0];
  // return the location
  return imageToLocationMap[imageName];
}

export async function navigateTo(world, to) {
  // how to goto a place from outside the cafe
  const gotoFromOutsideCafeTo = {
    'outside the cafe': [],
    'inside the cafe': [ 'Enter the cafe' ],
    'on an empty street': [ 'Go north' ],
    'in a crowded bar': [ 'Go north', 'Go east' ],
    'in the country-side': [ 'Go south' ],
    'at the concert': [ 'Go south', 'Go west' ]
  }
  // how to goto outside the cafe from another place
  const gotoOutsideCafeFrom = {
    'outside the cafe': [],
    'inside the cafe': [ 'Exit the cafe' ],
    'on an empty street': [ 'Go south' ],
    'in a crowded bar': [ 'Go west', 'Go south' ],
    'in the country-side': [ 'Go north' ],
    'at the concert': [ 'Go east', 'Go north' ]
  }
  // we navigate to outside the cafe first and then to
  // where we want to be (outside the cafe is like a bus hub)
  let from = await getWhereIAm( world ); 
  // if I am dead then restart
  if (from === 'I died') {
    let menuChoiceElement = await getMenuChoiceElement(world, 'Play again');
    await menuChoiceElement.click();
    from = await getWhereIAm(world);
  }
  let choicesToMake = [
    ...gotoOutsideCafeFrom[from],
    ...gotoFromOutsideCafeTo[to]
  ];
  // make the choices needed
  for (let choice of choicesToMake) {
    let menuChoiceElement = await getMenuChoiceElement(world, choice);
    await menuChoiceElement.click();
  }
}

export async function getAllCurrentMenuChoices(world) {
  // choiceElements - the menu choices you can click
  let choiceElements = await world.getMany('menu ul li');
  // choices - the text in in the choice elements
  let choices = [];
  for (let choiceElement of choiceElements) {
    choices.push(await world.getText(choiceElement));
  }
  return { choiceElements, choices };
}

export async function getMenuChoiceElement(world, choice) {
  // check if the choice exists and its index
  let { choiceElements, choices } = await getAllCurrentMenuChoices(world);
  let index = choices.indexOf(choice);
  // expect the choice to exist
  expect(index).to.be.above(-1);
  // return the element
  return choiceElements[index];
}

export async function checkIfDescriptionContainsString(world, string, softCheck = false) {
  // Get the text of the currently shown location description
  let descriptionEl = await world.get('.description');
  let description = await world.getText(descriptionEl);
  // If "soft check" then don't throw an error just return true or false
  if (softCheck) { return description.includes(string); }
  // Not "soft check", so expect world the description contains the string
  expect(description).to.contain(string);
}

export async function cheatIfNeeded(world) {
  // cheat and add health if we are about to die
  // so that the win game test never fails
  // (hard to write if blackbox testing - sneak peak on code neeeded
  //  or discussion with developer)
  // if (world.currentFeature?.name === 'Win the game') {
    let { cheated, health } = await world.runScriptInBrowser(() => {
      let cheated = false;
      if (player.status.health < 10) {
        player.status.health += 10;
        player.status.health = Math.min(100, player.status.health);
        updateProgressBars();
        cheated = true;
      }
      return { cheated, health: player.status.health };
    });
    if (cheated) {
      world.currentHealth = health;
      console.log('\n\nCheating and added +10 in health!\n\n');
    }
  // }
}

export async function waitForEvent(world, event) {
  const maxRetries = 20; // Number of retries (adjust as needed)
  const interval = 500; // Interval in milliseconds between retries

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const eventElements = await world.getMany('.event'); // Adjust selector based on your HTML structure
    for (const element of eventElements) {
      const text = await world.getText(element);
      if (text.includes(event)) {
        return; // Event found, exit the function
      }
    }
    await world.sleep(interval); // Wait before the next retry
  }

  throw new Error(`Event "${event}" not found after ${maxRetries * interval / 1000} seconds`);
}
export const sectionClassMap = {
  'health': 'health',
  'money': 'money',
  'espressos': 'espressocups',
  'bag': 'bag',
};

export async function getValueOfScores ( world, sectionName ) {
  const sectionClass = sectionClassMap[ sectionName.toLowerCase() ]; 
  const sectionElement = await world.get( `section.${ sectionClass }` ); 
  // If the section is not found, throw an error
  if ( !sectionElement ) {
    throw new Error( `Section with class ${ sectionClass } not found.` );
  }

  // For the "bag" section, get the text from <span class="bag-content">
  if ( sectionName.toLowerCase() === 'bag' ) {
    const bagContentElement = await sectionElement.locator( 'span.bag-content span' );

    // Wait for the element to appear, then retrieve its text
    await bagContentElement.waitFor( { timeout: 5000 } ); // Set a wait timeout for the element
    return await bagContentElement.textContent(); // Retrieve the text
  }

  // For other sections, locate the value within <div class="progress .val">
  const valueElement = await sectionElement.locator( 'div.progress .val' );

  // Wait for the element to appear, then retrieve its text
  await valueElement.waitFor( { timeout: 5000 } );
  const valueText = await valueElement.textContent();

  // For all sections except "bag", return the numerical value
  return parseFloat( valueText );
}