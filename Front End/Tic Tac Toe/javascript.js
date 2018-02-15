$(document).ready(function () {

    $("#announcer").css({
        'opacity': 0
    });
    $("#announcer").animate({
        'opacity': 1
    }, 2350);

    var sideChosen = false;
    var player = '';
    var computer = '';
    var playerTurn = Math.floor(Math.random() * 2);
    var gameOver = false;
    var boardArr = [
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8]
    ];
    var playerScore = 0;
    var computerScore = 0;

    for (let i = 0; i < boardArr.length; i++) {
        boardArr[i].usedOnBoard = false;
        boardArr[i].value = '';
    }

    function resetBoard() {
        player = '';
        computer = '';
        sideChosen = false;
        playerTurn = Math.floor(Math.random() * 2);
        playerScore = 0;
        computerScore = 0;
        $("#scoreDiv").html("Player: " + playerScore + " Computer: " + computerScore);
        for (let i = 0; i < 9; i++) {
            boardArr[i].usedOnBoard = false;
            boardArr[i].value = '';
            $("#" + i).html('');
        }
        $("#announcer").css({
            'opacity': 0
        });
        $("#announcer").html("What side will you play?");
        $("#announcer").animate({
            'opacity': 1
        }, 2350);
        $("#scoreDiv").fadeOut('slow');
        setTimeout(function () {
            $("#menu").fadeIn('slow');
        }, 1000);
        setTimeout(function () {
            gameOver = false;
        }, 1100);
    }

    function resetSaveScores() {
        player = '';
        computer = '';
        sideChosen = false;
        playerTurn = Math.floor(Math.random() * 2);
        for (let i = 0; i < 9; i++) {
            boardArr[i].usedOnBoard = false;
            boardArr[i].value = '';
            $("#" + i).html('');
        }
        $("#announcer").css({
            'opacity': 0
        });
        $("#announcer").html("What side will you play?");
        $("#announcer").animate({
            'opacity': 1
        }, 2350);
        $("#scoreDiv").fadeOut('slow');
        setTimeout(function () {
            $("#menu").fadeIn('slow');
        }, 1000);
        setTimeout(function () {
            gameOver = false;
        }, 1100);
    }

    function userVictory() {
        gameOver = true;
        $("#announcer").html("You won!");
        playerScore++;
        $("#scoreDiv").html("Player: " + playerScore + " Computer: " + computerScore);
        setTimeout(function () {
            resetSaveScores();
        }, 2000);
    };

    function computerVictory() {
        gameOver = true;
        $("#announcer").html("You Lost");
        computerScore++;
        $("#scoreDiv").html("Player: " + playerScore + " Computer: " + computerScore);
        setTimeout(function () {
            resetSaveScores();
        }, 2000);
    };

    function draw() {
        gameOver = true;
        $("#announcer").html("It was a draw...");
        $("#scoreDiv").html("Player: " + playerScore + " Computer: " + computerScore);
        setTimeout(function () {
            resetSaveScores();
        }, 2000);
    };

    function computerTurnPlacement() {
        if (boardArr.indexOf(false) == -1 && gameOver == false) {
            var pickASpot;
            //loop until the selection made hasn't been taken
            var validSelection = false;
            while (validSelection == false) {
                pickASpot = Math.floor(Math.random() * boardArr.length);
                if (boardArr[pickASpot].usedOnBoard == false) {
                    boardArr[pickASpot].usedOnBoard = true;
                    boardArr[pickASpot].value = computer;
                    $("#" + pickASpot).html(computer);
                    $("#" + boardArr[pickASpot][0]).html(computer);
                    validSelection = true;

                    //check for computer victory

                    if (boardArr[0].value == computer &&
                        boardArr[1].value == computer &&
                        boardArr[2].value == computer) {
                        $("#0").css("text-decoration", "line-through");
                        $("#1").css("text-decoration", "line-through");
                        $("#2").css("text-decoration", "line-through");
                        computerVictory();
                    } else if (boardArr[3].value == computer &&
                        boardArr[4].value == computer &&
                        boardArr[5].value == computer) {
                        computerVictory();
                    } else if (boardArr[6].value == computer &&
                        boardArr[7].value == computer &&
                        boardArr[8].value == computer) {
                        computerVictory();
                    } else if (boardArr[0].value == computer &&
                        boardArr[3].value == computer &&
                        boardArr[6].value == computer) {
                        computerVictory();
                    } else if (boardArr[1].value == computer &&
                        boardArr[4].value == computer &&
                        boardArr[7].value == computer) {
                        computerVictory();
                    } else if (boardArr[2].value == computer &&
                        boardArr[5].value == computer &&
                        boardArr[8].value == computer) {
                        computerVictory();
                    } else if (boardArr[6].value == computer &&
                        boardArr[4].value == computer &&
                        boardArr[2].value == computer) {
                        computerVictory();
                    } else if (boardArr[0].value == computer &&
                        boardArr[4].value == computer &&
                        boardArr[8].value == computer) {
                        computerVictory();
                    } else if (boardArr[0].usedOnBoard == true &&
                        boardArr[1].usedOnBoard == true &&
                        boardArr[2].usedOnBoard == true &&
                        boardArr[3].usedOnBoard == true &&
                        boardArr[4].usedOnBoard == true &&
                        boardArr[5].usedOnBoard == true &&
                        boardArr[6].usedOnBoard == true &&
                        boardArr[7].usedOnBoard == true &&
                        boardArr[8].usedOnBoard == true) {
                        draw();
                    }
                    if (!gameOver) {
                        playerTurn = true;
                        $("#announcer").html("Player's Turn");
                    }
                }
            }
        }
    }

    $(".bgGrey").click(function () {
        if (playerTurn == true && gameOver == false) {
            if (!boardArr[this.id].usedOnBoard) {
                $("#" + this.id).html(player);
                boardArr[this.id].value = player;
                boardArr[this.id].usedOnBoard = true;
            }

            //check for player victory
            if (boardArr[0].value == player &&
                boardArr[1].value == player &&
                boardArr[2].value == player) {
                userVictory();
            } else if (boardArr[3].value == player &&
                boardArr[4].value == player &&
                boardArr[5].value == player) {
                userVictory();
            } else if (boardArr[6].value == player &&
                boardArr[7].value == player &&
                boardArr[8].value == player) {
                userVictory();
            } else if (boardArr[0].value == player &&
                boardArr[3].value == player &&
                boardArr[6].value == player) {
                userVictory();
            } else if (boardArr[1].value == player &&
                boardArr[4].value == player &&
                boardArr[7].value == player) {
                userVictory();
            } else if (boardArr[2].value == player &&
                boardArr[5].value == player &&
                boardArr[8].value == player) {
                userVictory();
            } else if (boardArr[6].value == player &&
                boardArr[4].value == player &&
                boardArr[2].value == player) {
                userVictory();
            } else if (boardArr[0].value == player &&
                boardArr[4].value == player &&
                boardArr[8].value == player) {
                userVictory();
            } else if (boardArr[0].usedOnBoard == true &&
                boardArr[1].usedOnBoard == true &&
                boardArr[2].usedOnBoard == true &&
                boardArr[3].usedOnBoard == true &&
                boardArr[4].usedOnBoard == true &&
                boardArr[5].usedOnBoard == true &&
                boardArr[6].usedOnBoard == true &&
                boardArr[7].usedOnBoard == true &&
                boardArr[8].usedOnBoard == true) {
                draw();
            }
            if (!gameOver) {
                playerTurn = false;
                $("#announcer").html("Computer's Turn");
                setTimeout(function () {
                    computerTurnPlacement();
                }, 1000);
            }
        }
    });

    $("#chooseX").click(function () {
        $("#announcer").hide();
        sideChosen = true;
        player = 'x';
        computer = 'o';
        $("#gameBoard").fadeIn('slow');
        $("#menu").fadeOut('slow');
        setTimeout(function () {
            $("#scoreDiv").fadeIn('slow');
        }, 1000);
        if (playerTurn) {
            setTimeout(function () {
                $("#announcer").fadeIn('slow').html("Player's turn");
            }, 1000);
        } else {
            setTimeout(function () {
                $("#announcer").fadeIn('slow').html("Computer's Turn");
            }, 1000);
            setTimeout(function () {
                computerTurnPlacement();
            }, 2500);
        }
    });

    $("#chooseO").click(function () {
        $("#announcer").hide();
        sideChosen = true;
        player = 'o';
        computer = 'x';
        $("#gameBoard").fadeIn('slow');
        $("#menu").fadeOut('slow');
        setTimeout(function () {
            $("#scoreDiv").fadeIn('slow');
        }, 1000);
        if (playerTurn) {
            setTimeout(function () {
                $("#announcer").fadeIn('slow').html("Player's turn");
            }, 1000);
        } else {
            setTimeout(function () {
                $("#announcer").fadeIn('slow').html("Computer's Turn");
            }, 1000);
            setTimeout(function () {
                computerTurnPlacement();
            }, 2500);
        }
    });

    $("#resetButton").click(function () {
        resetBoard();
    });

}); //end of doc ready