Feature: Win the game at the end

  Scenario: Receiveing a beer from the bartender
    Given that I have started the game by navigating to "http://localhost:3000"
    And that I have navigated to the position "in a crowded bar"
    And that my position is "in a crowded bar"
    When I wait long enough for the description to contain the text "The bartender offers you a can of beer for free"
    Then my hipster bag should contain "a can of beer"

  Scenario: Someone in the audience throws you a fiver
    Given that I have navigated to the position "at the concert"
    And that my position is "at the concert"
    When I wait long enough for the description to contain the text "jam with us"
    Then I click on the button "Jam with the band"
    Then your money inscreases to 15

  Scenario: I should give a beer to the barista
    Given that I have navigated to the position "inside the cafe"
    And that my position is "inside the cafe"
    When I wait long enough for the description to contain the text "if someone would just bring me a beer"
    Then I click on the button "Give beer to barista"
    Then my hipster bag should contain "nothing cool"

  Scenario: Win the game
    When the description contain the text "He pours you a double espresso"
    Then I click repeatedly button "Buy an espresso" until I win
    Then my position should be "I won"