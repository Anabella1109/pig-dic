// Business logic
var num = 0, //variable to keep track of number of players
  newMark = 0,
  playerDetails = [],                                     //Initialise variables
  finalScore = 0,
  dicePic = "",
  pos = 0;

function PlayersInfo(name, score, totalScore) {
  this.playerNames = name;                            //Constructors for objects containing user's information
  this.playerMarks = score;
  this.totalScores = totalScore;
}

var genRandom = function() {
  randomNo = Math.floor(Math.random() * 6) + 1;                     //Function that chooses a random number between 1 and 6 without floating points when user rolls the dice
  return randomNo;
}

PlayersInfo.prototype.AddScores = function(thisMark) {
  if (thisMark === 1) {
    this.playerMarks = 0;
  } else if (thisMark !== 1) {
    this.playerMarks = this.playerMarks + thisMark;                    //Method for the PlayersInfo constructor to add total score per turn
  }
  return this.playerMarks;
}

PlayersInfo.prototype.Total = function(total) {
  return this.totalScores = this.totalScores + total                     //Method for the PlayersInfo constructor to add the players recent score to the new turn's score
}

var getdiceSide = function(getInput) {
  if (getInput == 1) dicePic = "img/dice/1.jpg";
  else if (getInput == 2) dicePic = "img/dice/2.jpg";
  else if (getInput == 3) dicePic = "img/dice/3.jpg";
  else if (getInput == 4) dicePic = "img/dice/4.jpg";                       //Function to display image according to number rolled
  else if (getInput == 5) dicePic = "img/dice/5.jpg";
  else if (getInput == 6) dicePic = "img/dice/6.jpg";

  return dicePic;
}

function reset() {
  pos = 0;
  PlayersInfo.playerMarks = 0;
  PlayersInfo.totalScores = 0;
  $("#dice-image").html("");                                    //Function to reset game when user clicks for new game
  $("p.text-uppercase").text("");
  $("h1").text("0");
  $(".cumulative").text("");
}


// User-interface logic
$(document).ready(function() {
  $("#fresh-game").click(function() {
    $("#start-game").hide();
    $("#new").show();
    $("#help").show();
    $(".dice-game").show();                    //section to hide screen with start game button and show empty new game
    $("#reset").hide();
    $("#image").hide();
  })
  $("#reset").click(function() {
    reset();
    $("#hold").show();
    $("#diceRoll").show();                          //section to reset game and show new game when Start game button is clicked 
    $("#reset").hide();
    $("#content1").addClass("new-turn");
    
  })

  $("#player-names").submit(function(event) {
    event.preventDefault();
    num++;    //incrementing when new user name is sumbitted
    if (num > 2) {
      alert("Players cannot exceed 2!");
      playerDetails = [];
      num = 0;                                 //section to make sure players don't exceed 2 and to reset the game so that new information can be entered
      reset();
    } else if (num == 2) {
      $("#input-details").modal('hide');              //section to stop showing the pop up for name insertion if 2 players are reached
    }
    var inputtedName = $("#name-player").val();
    var newPlayer = new PlayersInfo(inputtedName, 0, 0);                 //section to create new objects containing player's info
    playerDetails.push(newPlayer);
    $("#content1").addClass("new-turn");
    $("#content" + num + " h2").html("<span class=player" + num + ">" + newPlayer.playerNames + "</span>");
    $("#name-player").val("");
  });

  $("#diceRoll").click(function() {
    if (num == 2) {
      var switchPlayer;
      var getRandom = genRandom();
      var getPlayerId = playerDetails[pos];
      getPlayerId.AddScores(getRandom);
      if (getRandom == 1 && pos == 0) {
        $("#content" + (pos + 1) + " h4").text("0");             //section to give score 0 and change styling when player1 rolls 1
        $("#content" + (pos + 1)).removeClass("new-turn");
        $("#dice-image").html("");
        pos = 1;
        switchPlayer = playerDetails[pos];
        $("p.text-uppercase").html("Oy, You rolled a 1. <br>" + "It is " + switchPlayer.playerNames + "'s turn");
        $("#dice-image").html("<img class='dice' height='200' width = '200' src=" + getdiceSide(getRandom) + ">")
        $("#content" + (pos + 1)).addClass("new-turn");

      } else if (getRandom == 1 && pos == 1) {
        $("#content" + (pos + 1) + " h4").text("0");                //section to give score 0 and change styling when player2 rolls 1
        $("#content" + (pos + 1)).removeClass("new-turn");
        $("#dice-image").html("");
        pos = 0;
        switchPlayer = playerDetails[pos];
        $("p.text-uppercase").html("Oy, You rolled a 1. <br>" + "It is " + switchPlayer.playerNames + "'s turn");
        $("#dice-image").html("<img class='dice' height='200' width = '200' src=" + getdiceSide(getRandom) + ">")

        $("#content" + (pos + 1)).addClass("new-turn");

      } else if (getRandom > 1) {
        newMark = getPlayerId.playerMarks;                           //section to display image of dice and display player's turn score when a number different from 1 is rolled 
        $("p.text-uppercase").text("");
        $("#content" + (pos + 1) + " h4").text(newMark);
        $("#dice-image").html("<img class='dice' height='200' width = '200' src=" + getdiceSide(getRandom) + ">")
      }

     
    } else if (num == 1) {
      alert("Player 2 Name Required");             //section to require user's name to be entered if number of there is only one player
      $("#input-details").modal();
    } else if (num == 0) {
      alert("Players' Names Required");             //section to require user's name to be entered if number of there is no player entered
      $("#input-details").modal();
    }
  });
  $("#hold").click(function() {
    if (num == 2) {
      var getPlayerId = playerDetails[pos];
      newMark = getPlayerId.playerMarks;
      getPlayerId.Total(newMark);              //section to add turn's score to current score when player holds
      finalScore = getPlayerId.totalScores;
      
      //Make the total become 0;//Final score, This Round, Dice Value
      getPlayerId.playerMarks = 0;
      $("#content" + (pos + 1) + " h4").text("0"); //resets turn's score to zero
      $("#content" + (pos + 1) + " h1").text(finalScore); //displays new score on player's side
      $("#dice-image").html("");
      if (pos == 0) {
        $("#content" + (pos + 1)).removeClass("new-turn");
        pos = 1;
        $("#content" + (pos + 1)).addClass("new-turn");
      } else if (pos == 1) {                                                                    //section to add player's turn styling to current player's side and change player after hold
        $("#content" + (pos + 1)).removeClass("new-turn");
        pos = 0;
        $("#content" + (pos + 1)).addClass("new-turn");
      }
      if (finalScore >= 100) {
        playerDetails[0].totalScores = 0;
        playerDetails[1].totalScores = 0;
        $(".winner-text").html("<h3 class = 'text-uppercase'>" + getPlayerId.playerNames + " WON!!!</h3>")
        $("#winner-modal").modal();
        $("#hold").hide();
        $("#diceRoll").hide();                                     //section to determine and display the winner
        $("#reset").show();
        $("#content1").removeClass("new-turn");
        $("#content2").removeClass("new-turn");
      }
    } else if (num == 1) {
      alert("Player 2 Name Required");                     //section to require user's name to be entered if number of there is only one player
      $("#input-details").modal();
    } else if (num == 0) {
      alert("Players' Names Required");                     //section to require user's name to be entered if number of there is no player entered
      $("#input-details").modal();
    }
  });
});