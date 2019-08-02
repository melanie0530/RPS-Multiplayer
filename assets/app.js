var firebaseConfig = {
    apiKey: "AIzaSyBNdx4YfEzSoFcA0gKxftDeDtM3gwWjyAE",
    authDomain: "testproject-75cbb.firebaseapp.com",
    databaseURL: "https://testproject-75cbb.firebaseio.com",
    projectId: "testproject-75cbb",
    storageBucket: "testproject-75cbb.appspot.com",
    messagingSenderId: "1085395169186",
    appId: "1:1085395169186:web:74adcd4bf76a07de"
  };

var NUM_PLAYERS = 2;
var GAME_LOCATION = 'https://rps-multiplayer-d9813.firebaseio.com/';
var PLAYERS_LOCATION = 'player_list';
var PLAYER_DATA_LOCATION = 'player_data';
var PLAYER_SCORES_LOCATION = 'player_scores';
function getMyUserId() {
    return prompt('Enter Username', 'Guest');
}
function setRPS(myPlayerNumber, myUserId, myRPS) {
    var playerDataRef = new Firebase(GAME_LOCATION).
        child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
    playerDataRef.set({userId: myUserId, state: 'picked', rps: myRPS});
}
function didYouWin(yourRPS, opponentRPS) {
    switch(yourRPS) {
    case 'rock':
      switch(opponentRPS) {
            case 'rock':
                return 'draw';
            case 'paper':
                return 'lose';
            case 'scissors':
                return 'win';
        }
      break;
    case 'paper':
        switch(opponentRPS) {
            case 'rock':
                return 'win';
            case 'paper':
                return 'draw';
            case 'scissors':
                return 'lose';
        }
      break;
    case 'scissors':
        switch(opponentRPS) {
            case 'rock':
                return 'lose';
            case 'paper':
                return 'win';
            case 'scissors':
                return 'draw';
        }
        break;
    }
 }
function playGame(myPlayerNumber, myUserId) {
  if (myPlayerNumber === null) {
    alert('Game is full.  Can\'t join. :-(');
  }
  else {
      $("#status").empty();
      $("#scoreboard").empty();
      $("#players-list").empty();
      $("#status").css("display", "block");
      $("#players").html("<ul id='players-list'"+
          "style='list-style-type:none'></ul>");
    var playerDataRef = new Firebase(GAME_LOCATION).
        child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
    var allPlayersDataRef = new Firebase(GAME_LOCATION).
        child(PLAYER_DATA_LOCATION);
    var playerScoresRef = new Firebase(GAME_LOCATION).
        child(PLAYER_SCORES_LOCATION);
    var opponentPlayerNumber = myPlayerNumber === 0 ? 1 : 0;
    playerScoresRef.on('value', function(snapshot) {
      if (snapshot.val() === null) {
        playerScoresRef.child(myUserId).set([0, 0]);
      } else if (!(myUserId in snapshot.val())) {
        playerScoresRef.child(myUserId).set([0, 0]);
      }
    });     var currentWins,
                currentLosses;
            if (nameSnapshot.val()[myPlayerNumber].state === 'picked') {
                playerScoresRef.child(myUserId).on('value', function(snapshot) {
                  currentWins = snapshot.val()[0];
                  currentLosses = snapshot.val()[1];
                });
                if(didYouWin(yourRPS, opponentRPS) === 'win') {
                    playerScoresRef.child(myUserId).set([currentWins + 1, currentLosses]);
                } else if (didYouWin(yourRPS, opponentRPS) === 'lose') {
                    playerScoresRef.child(myUserId).set([currentWins, currentLosses + 1]);
                }
            }
            $("#players-list").append("<input type='button' value='Play Again' " +
            "id='button_restart' onclick='playGame(" + myPlayerNumber +
            ", \"" + myUserId + "\")'/>");
            playerDataRef.set({userId: myUserId, state: 'finished', rps: yourRPS});
        }
      });
    });
  }
}
function assignPlayerNumberAndPlayGame() {
  var myUserId = getMyUserId();
  var playerListRef = new Firebase(GAME_LOCATION).
      child(PLAYERS_LOCATION);
    playerListRef.transaction(function(playerList) {
    var i;
    if (playerList === null) {
      playerList = {};
    }
    var joinedGame = false;
    for(i = 0; i < NUM_PLAYERS; i++) {
      if (playerList[i] === myUserId) {
          alert("Already in the game.");
        return; 
      }
      else if (!(i in playerList) && !joinedGame) {
        playerList[i] = myUserId;
        joinedGame = true;
        break;
      }
    }
    if (joinedGame) {
      return playerList;
    }
  }, function (success, transactionResultSnapshot) {
    var myPlayerNumber = null,
        resultPlayerList = transactionResultSnapshot.val();
    for(var i = 0; i < NUM_PLAYERS; i++) {
      if (resultPlayerList[i] === myUserId) {
        myPlayerNumber = i;
        break;
      }
    }
    playerListRef.child(myPlayerNumber).removeOnDisconnect();
    playGame(myPlayerNumber, myUserId);
  });
}
assignPlayerNumberAndPlayGame();