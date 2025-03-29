// split button if you have 2 aces
// use same deck? 
// keep score between the 2 players
// make the dealer hit - gotta change it from soft 16 and then get to a soft 17 at least
// change the look of it more?
// soft and hard values

let dealerSum = 0;
let dealerAceCount = 0;

let yourSum = 0;
let yourAceCount = 0;

let hidden; 
let deck;

let canHit = true; // checks if you are able to use the hit button or not

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['C', 'H', 'S', 'D'];

    // initialize empty array for deck
    deck = [];

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
    let cardImg = document.createElement('img');
    cardImg.id = 'hidden'; 
    hidden = deck.pop();
    cardImg.src = './cards/BACK.png';
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    document.getElementById('dealer-cards').append(cardImg);
    console.log(hidden);
    console.log(dealerSum);
    console.log(dealerAceCount);

    // dealer's 2nd card
    cardImg = document.createElement('img');                    // create a card img tag
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

    // check if there is a natural blackjack from starting cards 
    checkNaturalBlackjack();

    console.log(yourSum);
    console.log(yourAceCount);

    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stand').addEventListener('click', stand);
}

function getValue(card) {;
    // Get card number value
    // Necessary for value 10 to be correctly counted for
    let data = card.split('-'); // '10-C' => ['10', 'C']
    let value =  data[0];

    // check if it's an A, J, Q, or K
    if (isNaN(value)) {
        if (value == 'A') {
            return 11;
        }
        return 10; // J, Q, K
    }

    // else return first index of card value 
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == 'A') {
        return 1; 
    }
    return 0; 
}

function checkNaturalBlackjack() {
    let message = '';

    if (dealerSum == 21 && yourSum != 21) {
        message = 'Natural Ace! Dealer wins.';
        results(message);
    }
    else if (yourSum == 21 && dealerSum != 21) {
        message = 'Natural Ace! You win.'
        results(message);
    }
    else if (yourSum == 21 && dealerSum == 21) {
        message = "Tie!";
        results(message);
    }
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
    // disable hit button 
    disableHit();
    // reveal hidden card
    revealHidden();

    while(dealerSum < 17) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = './cards/' + card + '.png';
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer-cards').append(cardImg);
    }

    // check if either players can reduce an Ace
    yourSum = reduceAce(yourSum, yourAceCount);
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

    results(message);
}

function reduceAce(playerSum, playerAceCount) {
    if (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }

    return playerSum;
}

function results(message) {
    disableHit();
    revealHidden();
    
    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('player-sum').innerText = yourSum;
    document.getElementById('results').innerText = message;
        
    // show play-again button and listen for user interaction 
    document.getElementById('play-again').style.display = 'inline';
    document.getElementById('play-again').addEventListener('click', playAgain);
}

function disableHit() {
    // disable hit button 
    canHit = false;
}

function revealHidden() {
    // reveal hidden card
    document.getElementById('hidden').src = './cards/' + hidden + '.png' ;
}

function playAgain() {
    // clear cards from html
    let dealerCards = document.getElementById('dealer-cards');
    let yourCards = document.getElementById('player-cards');
    clearCards(dealerCards);
    clearCards(yourCards);

    // clear scores sums and result message
    document.getElementById('dealer-sum').innerText = '';
    document.getElementById('player-sum').innerText = '';
    document.getElementById('results').innerText = '';
    
    // reset sums and ace counts
    dealerSum = 0;
    dealerAceCount = 0;
    yourSum = 0;
    yourAceCount = 0;

    // enable canHit button
    canHit = true;

    // hide play-again button
    document.getElementById('play-again').style.display = 'none';

    // rebuild and shuffle deck
    buildDeck();
    shuffleDeck();

    startGame();
}

function clearCards(playerCards) {
    while (playerCards.hasChildNodes()) {
        playerCards.removeChild(playerCards.firstChild);
    }
}
