// split button if you have 2 aces
// play again button - use same deck? 
// keep score between the 2 players
// make the dealer hit - gotta change it from soft 16 and then get to a soft 17 at least
// change the look of it more?
// soft and hard values

let dealerSum = 0;
let dealerAceCount = 0;

let yourSum = 0;
let yourAceCount = 0;

let hidden; 
let deck = [];

let canHit = true; // checks if you are able to use the hit button or not

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['C', 'H', 'S', 'D'];

    for (let i = 0; i  < values.length; i++) {
        for (let j = 0; j < types.length; j++) {
            deck.push(values[i] + '-' + types[j]);
        }
    }
}

function shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (O - 1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp; 
    }
    console.log(deck);
}

function startGame() {
    // dealer's hidden card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(hidden);
    console.log(dealerSum);
    console.log(dealerAceCount);

    // dealer's 2nd card
    let cardImg = document.createElement('img');                // create a card img tag
    let card = deck.pop();                                      // removes card from deck
    cardImg.src = './cards/' + card + '.png';                   // finds card in cards/ directory
    dealerSum += getValue(card);                                // adds card value to sum
    dealerAceCount += checkAce(card);                           // checks if to add ace count
    document.getElementById('dealer-cards').append(cardImg);    // adds cardImg to html doc

    // player's starting 2 cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = './cards/' + card + '.png';
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById('player-cards').append(cardImg);
    }

    console.log(yourSum);
    console.log(yourAceCount);

    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stand').addEventListener('click', stand);
}

function getValue(card) {;
    // check if it's an A, J, Q, or K
    if (isNaN(card[0])) {
        if (card[0] == 'A') {
            return 11;
        }
        return 10; // J, Q, K
    }

    // else return first index of card value 
    return parseInt(card[0]);
}

function checkAce(card) {
    if (card[0] == 'A') {
        return 1; 
    }
    return 0; 
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('player-cards').append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stand() {
    // check if either players can reduce an Ace
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    // disable hit button 
    canHit = false;
    // reveal hidden card
    document.getElementById('hidden').src = './cards/' + hidden + '.png' ;

    while(dealerSum < 17) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = './cards/' + card + '.png';
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer-cards').append(cardImg);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);

    let message = '';
    if (yourSum > 21) {
        message = 'You lose!';
    } 
    else if (dealerSum > 21) {
        message = 'You win!';
    }
    // both sums are under 21
    else if (yourSum == dealerSum) {
        message = 'Tie!';
    }
    else if (yourSum > dealerSum) {
        message = 'You win!';
    }
    else if (dealerSum > yourSum) {
        message = 'You lose!'; 
    }

    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('player-sum').innerText = yourSum;
    document.getElementById('results').innerText = message;

}

function reduceAce(playerSum, playerAceCount) {
    if (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }

    return playerSum;
}
