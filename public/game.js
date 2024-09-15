var twistButton = document.getElementById("twist-button");
var stickButton = document.getElementById("stick-button");

var computersCards = document.getElementsByClassName("computer-card-image");
var playersCards = document.getElementById("players-cards-container");
const newCardWrapper = document.createElement('div');
const newCardImg = document.createElement('img');
var randomCard = 0;
var randomCardImage = "./Images/Playing Cards/2_of_clubs.png";
var imageURLs = [
  "./Images/Playing Cards/2_of_clubs.png",
  "./Images/Playing Cards/2_of_diamonds.png",
  "./Images/Playing Cards/2_of_hearts.png",
  "./Images/Playing Cards/2_of_spades.png",
  "./Images/Playing Cards/3_of_clubs.png",
  "./Images/Playing Cards/3_of_diamonds.png",
  "./Images/Playing Cards/3_of_hearts.png",
  "./Images/Playing Cards/3_of_spades.png",
  "./Images/Playing Cards/4_of_clubs.png",
  "./Images/Playing Cards/4_of_diamonds.png",
  "./Images/Playing Cards/4_of_hearts.png",
  "./Images/Playing Cards/4_of_spades.png",
  "./Images/Playing Cards/5_of_clubs.png",
  "./Images/Playing Cards/5_of_diamonds.png",
  "./Images/Playing Cards/5_of_hearts.png",
  "./Images/Playing Cards/5_of_spades.png",
  "./Images/Playing Cards/6_of_clubs.png",
  "./Images/Playing Cards/6_of_diamonds.png",
  "./Images/Playing Cards/6_of_hearts.png",
  "./Images/Playing Cards/6_of_spades.png",
  "./Images/Playing Cards/7_of_clubs.png",
  "./Images/Playing Cards/7_of_diamonds.png",
  "./Images/Playing Cards/7_of_hearts.png",
  "./Images/Playing Cards/7_of_spades.png",
  "./Images/Playing Cards/8_of_clubs.png",
  "./Images/Playing Cards/8_of_diamonds.png",
  "./Images/Playing Cards/8_of_hearts.png",
  "./Images/Playing Cards/8_of_spades.png",
  "./Images/Playing Cards/9_of_clubs.png",
  "./Images/Playing Cards/9_of_diamonds.png",
  "./Images/Playing Cards/9_of_hearts.png",
  "./Images/Playing Cards/9_of_spades.png",
  "./Images/Playing Cards/10_of_clubs.png",
  "./Images/Playing Cards/10_of_diamonds.png",
  "./Images/Playing Cards/10_of_hearts.png",
  "./Images/Playing Cards/10_of_spades.png",
  "./Images/Playing Cards/jack_of_clubs2.png",
  "./Images/Playing Cards/jack_of_diamonds2.png",
  "./Images/Playing Cards/jack_of_hearts2.png",
  "./Images/Playing Cards/jack_of_spades2.png",
  "./Images/Playing Cards/queen_of_clubs2.png",
  "./Images/Playing Cards/queen_of_diamonds2.png",
  "./Images/Playing Cards/queen_of_hearts2.png",
  "./Images/Playing Cards/queen_of_spades2.png",
  "./Images/Playing Cards/king_of_clubs2.png",
  "./Images/Playing Cards/king_of_diamonds2.png",
  "./Images/Playing Cards/king_of_hearts2.png",
  "./Images/Playing Cards/king_of_spades2.png",
  "./Images/Playing Cards/ace_of_clubs.png",
  "./Images/Playing Cards/ace_of_diamonds.png",
  "./Images/Playing Cards/ace_of_hearts.png",
  "./Images/Playing Cards/ace_of_spades.png",
];

var cardScores = [
  2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8,
  8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 11, 11, 11, 11,
];
    
let playersScore = 0;
let playersScoreList = [];
let checkPlayerScore = false;
let computersScore = 0;

document.getElementById("player-score-p").textContent = playersScore.toString();

twistButton.addEventListener("click", () => {
    
    twistButtonFunction();
    
});

window.onload = startUp();

console.log("hello");

function startUp(){
    for (let x = 0; x < 2; x++) {
      const newCardWrapper = document.createElement("div");
      const newCardImg = document.createElement("img");
      randomCard = Math.floor(Math.random() * cardScores.length);
      //randomCard = 0;
      randomCardImage = imageURLs[randomCard];

      playersScoreList.push(cardScores[randomCard]);

      playersScore = playersScore + cardScores[randomCard];
      newCardImg.src = randomCardImage;
      newCardImg.classList.add("card-image");
      newCardImg.width = "100px";
      newCardWrapper.appendChild(newCardImg);
      newCardWrapper.classList.add("card-wrapper");
      playersCards.appendChild(newCardWrapper);

      var cardsContainerWidth = playersCards.offsetWidth;
      var newCardsContainerWidth = cardsContainerWidth + 30;
      playersCards.setAttribute(
        "style",
        "width:" + newCardsContainerWidth + "px"
      );

      document.getElementById("player-score-p").textContent = playersScore.toString();

      cardScores.splice(randomCard, 1);
      imageURLs.splice(randomCard, 1);

    }};

stickButton.addEventListener("click", () => {
  console.log("Stick button clicked");
    for (let x = 0; x < 2; x++){
        randomCard = Math.floor(Math.random() * cardScores.length);
        //randomCard = 0;
        computersScore = computersScore + cardScores[randomCard];
        computersCards[x].src = imageURLs[randomCard];

        cardScores.splice(randomCard, 1);
        imageURLs.splice(randomCard, 1);
    }

    document.getElementById("computer-score-p").textContent = computersScore.toString();
   
    setTimeout(compareScores, 500);

});

function checkForBust(){
    if (playersScore > 21){
        alert("You've gone bust!");
        location.reload();
    }
    twistButton.disabled = false;
}

function compareScores(){
    if (playersScore > computersScore){
        alert("You win!");
        location.reload();
    }
    else if (computersScore > playersScore){
        alert("You lose!");
        location.reload();
    }

    else{
        alert("Draw!");
        location.reload();
    }
}

function sumPlayerScore(){
    playersScore = 0;
    playersScoreList.forEach(score => {
        playersScore += score;
    })
}

function aceBustCheck(){
    while (checkPlayerScore) {
      if (playersScore > 21) {
        if (playersScoreList.includes(11)) {
            playersScoreList[playersScoreList.indexOf(11)] = 1;
            sumPlayerScore();
          }
        
        else{
        checkPlayerScore = false;
        }
      } 
      else {
        checkPlayerScore = false;
      }
    }

    sumPlayerScore();
}

function twistButtonFunction(){

    twistButton.disabled = true;

    //Create new card wrapper and card image
    const newCardWrapper = document.createElement('div');
    const newCardImg = document.createElement('img');

    //Generate random card
    randomCard = Math.floor(Math.random() * cardScores.length);
    //randomCard = 0;
    randomCardImage = imageURLs[randomCard];
    newCardImg.src = randomCardImage;

    //Add new card image to new card wrapper
    newCardImg.classList.add("card-image");
    newCardImg.width = "100px";
    newCardWrapper.appendChild(newCardImg);
    newCardWrapper.classList.add("card-wrapper");

    //Add new card to players cards
    playersCards.appendChild(newCardWrapper);

    //Add current card to players score list
    playersScoreList.push(cardScores[randomCard]);

    //Calculate score.
    sumPlayerScore();

    //Bust check with aces.
    checkPlayerScore = true;
    aceBustCheck();

    var cardsContainerWidth = playersCards.offsetWidth;
    var newCardsContainerWidth = cardsContainerWidth + 30;
    playersCards.setAttribute("style", "width:" + newCardsContainerWidth + "px");
    document.getElementById("player-score-p").textContent = playersScore.toString();

    cardScores.splice(randomCard, 1);
    imageURLs.splice(randomCard, 1);

    setTimeout(checkForBust, 500);

}



