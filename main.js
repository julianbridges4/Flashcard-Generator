var fs = require('fs');
var inquirer = require('inquirer');
var basicCard = require("./BasicCard.js");
var clozeCard = require("./ClozeCard.js");
var cardArray = [];
var count;

function actionPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "actionPrompt",
        message: "What would you like to do next?",
        choices: ["Make a new card", "Review my card(s)", "Quit"]
    }]).then(function(response) {
        if (response.actionPrompt === "Quit") {
            process.exit();
        } else if (response.actionPrompt === 'Make a new card') {
            cardPrompt();
        } else {
            cardReview();
        }
    });
}

function cardPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "cardType",
        message: "What kind of card would you like to make?",
        choices: ["Basic Flash Card", "Cloze"]
    }]).then(function(response) {
        if (response.cardType === 'Basic Flash Card') {
            makeBasicCard();
        } else {
            makeClozeCard();
        }
    });
}

function makeBasicCard() {
    inquirer.prompt([{
        type: "input",
        name: "cardFront",
        message: "Enter the text for the front of the flash card:"
    }, {
        type: "input",
        name: "cardBack",
        message: "Now enter the text for the back of the flash card:"
    }]).then(function(response) {
        var newBasicCard = basicCard(response.cardFront, response.cardBack);
        cardArray.push(newBasicCard);
        console.log("You successfully created a new Basic Flash Card.")
        actionPrompt();
    });
}

function makeClozeCard() {
    inquirer.prompt([{
        type: "input",
        name: "fullText",
        message: "Enter the full text for the question/statement:",
    }, {
        type: "input",
        name: "cloze",
        message: "Enter the part of the question/statement you'd like to hide (exact match required):"
    }]).then(function(response) {
        if (response.fullText.indexOf(response.cloze) === -1) {
            console.log("\n***** Error. Cloze deletion must match part of the full text exactly. *****\n");
            actionPrompt();
        } else {
            var partialText = response.fullText.replace(response.cloze, "...");
            var newClozeCard = clozeCard(response.fullText, partialText, response.cloze);
            cardArray.push(newClozeCard);
            console.log("You successfully created a new Cloze Card.")
            actionPrompt();
        }
    });
}

function cardReview() {
    if (cardArray.length === 0) {
        console.log("\n ***** You have no cards to review yet. ***** \n");
        actionPrompt();
    } else {
        count = 0;
        displayCard(count);
    }
}

function displayCard(count) {
    if (count < cardArray.length) {
        if (cardArray[count] instanceof basicCard) {
            console.log("\n\t***** " + cardArray[count].front + " ***** \n");

            inquirer.prompt([{
                type: "list",
                name: "flipCard",
                message: "Press enter to see the back of the Card",
                choices: ["Show Back of Card"]
            }]).then(function(response) {
                if (response.flipCard === "Show Back of Card") {
                    console.log("\n\t***** " + cardArray[count].back + " ***** \n");
                    count++;
                    nextCard(count);
                }
            });
        } else if (cardArray[count] instanceof clozeCard) {
            console.log("\n\t***** " + cardArray[count].partial  + " ***** \n");
            inquirer.prompt([{
                type: "list",
                name: "showCloze",
                message: "Press enter to show the full text.",
                choices: ["Show Full Text"]
            }]).then(function(response) {
                console.log("\n\t***** " + cardArray[count].full + " *****\n");
                count++;
                nextCard(count);
            });
        }
    } else {
        actionPrompt();
    }
}

function nextCard(count) {
    inquirer.prompt([{
        type: "list",
        name: "next",
        message: "Press enter to see the next card...",
        choices: ["Show Next Card"]
    }]).then(function(response) {
        if (response.next === "Show Next Card" && count < cardArray.length) {
            displayCard(count);
        } else {
            console.log("\n\tYou've reached the end of your cards.\n")
            actionPrompt();
        }
    });
}

console.log("Welcome to Flash Card Maker");
actionPrompt();