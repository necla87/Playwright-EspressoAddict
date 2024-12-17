Feature: Get a beer from the bartender
  As a player I want the bartender to give me a beer
  so that I can use that later to help me win the game

  Scenario: I should be given a beer by the bartender
    Given that I have started the game by navigating to "http://localhost:3000"
    And that I navigated to the position "in a crowded bar"
    And that my position is "in a crowded bar"
    When I wait long enough for the description to contain the text "The bartender offers you a can of beer for free"
    Then my hipster bag should contain "a can of beer"