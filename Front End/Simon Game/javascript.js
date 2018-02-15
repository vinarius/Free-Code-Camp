$(document).ready(function() {

	var powerOn = false;
	var gameStarted = false;
	var scoreCounter = 0;
	var sequenceArr = [];
	var userArr = [];
	var buttons = ['redButton', 'yellowButton', 'greenButton', 'blueButton'];
	var playerTurn = false;
	var difficulty = [1150, 900, 750, 600];
	var bonusGame = false;
	var strictMode = false;

	var redSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
	var yellowSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
	var greenSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
	var blueSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

	function togglePower() {
		powerOn = !powerOn;
		if(powerOn){
			$("#noPowerSlot").removeClass("active");
			$("#noPowerSlot").addClass("inactive");
			$("#powerSlot").removeClass("inactive");
			$("#powerSlot").addClass("active");

			scoreCounter = 0;
			sequenceArr = [];
			userArr = [];
			scoreAnimationCounter = 0;
			gameStarted = false;
			playerTurn = false;
			bonusGame = false;
			strictMode = false;

			$("#score").html("- -");
			$(".gameButton").addClass("buttonLight");
		} else {
			$("#noPowerSlot").removeClass("inactive");
			$("#noPowerSlot").addClass("active");

			$("#powerSlot").removeClass("active");
			$("#powerSlot").addClass("inactive");

			$(".gameButton").removeClass("buttonLight");

			$("#score").html(" ");

			$("#strictModeButton").removeClass("buttonLight");
		}
	}

	$("#powerButtonContainer").click(function(){
		togglePower();
	});

	function animateScoreStart(callback){

		let animationCounter = 0;

		function stopMyTimer(timer){
			if(animationCounter > 2){
				clearInterval(myTimer);
				$("#score").html("- -");
				callback();
			}
		}

		let myTimer = setInterval(function(){
			if(animationCounter <= 2){
				displayText();
				hideText();
				animationCounter++;
			}
			stopMyTimer(myTimer);
		}, 500);

		function displayText(){
			$("#score").html(" ");
		}

		function hideText(){
			setTimeout(function(){$("#score").html("- -");}, 250);
		}
	}

	function addToSequence(callback){
		sequenceArr.push( buttons[Math.floor(Math.random() * buttons.length)] );
		scoreCounter++;
		console.log(sequenceArr);
		callback();
	}

	function blinkCurrentButtonInstruction(curArr){

		function setDifficulty(score) {
			if(scoreCounter <= 8){
				return difficulty[0];
			}
			else if(scoreCounter <= 12){
				return difficulty[1];
			}
			else if(scoreCounter <= 16){
				return difficulty[2];
			}
			else {
				return difficulty[3];
			}
		}

		$("#" + curArr).addClass("instructionActive");

		switch(curArr){
			case 'redButton':
			redSound.play();
			break;
			case 'yellowButton':
			yellowSound.play();
			break;
			case 'greenButton':
			greenSound.play();
			break;
			case 'blueButton':
			blueSound.play();
			break;
		}
		
		setTimeout(function(){
			$("#" + curArr).removeClass("instructionActive");
		}, setDifficulty(scoreCounter) / 2);
	}

	function instructions(instructionsArr){

		let animationCounter = 0;

		function setDifficulty(score) {
			if(scoreCounter <= 8){
				return difficulty[0];
			}
			else if(scoreCounter <= 12){
				return difficulty[1];
			}
			else if(scoreCounter <= 16){
				return difficulty[2];
			}
			else {
				return difficulty[3];
			}
		}


		function stopMyTimer(timer){
			if(animationCounter >= sequenceArr.length){
				clearInterval(myTimer);
				playerTurn = !playerTurn;
				userArr = [];
			}
		}

		let myTimer = setInterval(function(){
			if(animationCounter <= sequenceArr.length){
			//keep going if there are instructions left
			$("#score").html(scoreCounter);
			blinkCurrentButtonInstruction(instructionsArr[animationCounter]);
			animationCounter++;
		}
		stopMyTimer(myTimer);
	}, setDifficulty(scoreCounter));
	};

	function userVictory(){
		$("#victoryDiv").css("opacity", "1");
		$("#heckYeah").css("opacity", "1");
		$("#heckYeah").prop('disabled', false);
		$("#nopeBacon").css("opacity", "1");
		$("#nopeBacon").prop('disabled', false);
		$("#boardContainer").addClass("victoryPositionDown");
	}

	$("#startButton").click(function(){
		if(powerOn && !gameStarted){
			gameStarted = true;
			animateScoreStart(function(){
				addToSequence(function(){
					instructions(sequenceArr);
			});//end addToSequence
		});//end animateScoreStart

		}
	});

	$("#strictModeButton").click(function(){
		if(powerOn){
			if(!strictMode){
				strictMode = !strictMode;
				$("#strictModeButton").addClass("buttonLight");
			} else {
				strictMode = !strictMode;
				$("#strictModeButton").removeClass("buttonLight");
			}
		}
	});

	$("#redButton").click(function(){
		if(powerOn){
			if(playerTurn){
				redSound.play();
				userArr.push(this.id);
				if(userArr[userArr.length - 1] != sequenceArr[userArr.length - 1]){
					$("#score").html('oops!');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					userArr.pop();
					playerTurn = !playerTurn;
					if(strictMode){
						sequenceArr = [];
						userArr = [];
						scoreCounter = 0;
						addToSequence(function(){
							instructions(sequenceArr);
						});
					} else {
						instructions(sequenceArr);
					}
				}
				else if(userArr[userArr.length - 1] == sequenceArr[sequenceArr.length - 1] && userArr.length == sequenceArr.length){
					playerTurn = !playerTurn;
					$("#score").html('GGWP');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					if(scoreCounter >= 20 && bonusGame == false){
						userVictory();
					}
					else{
						addToSequence(function(){
							instructions(sequenceArr);
						});	
					}
				}
			}

		}
	});

	$("#yellowButton").click(function(){
		if(powerOn){
			if(playerTurn){
				yellowSound.play();
				userArr.push(this.id);
				if(userArr[userArr.length - 1] != sequenceArr[userArr.length - 1]){
					$("#score").html('oops!');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 1000);
					userArr.pop();
					playerTurn = !playerTurn;
					if(strictMode){
						sequenceArr = [];
						userArr = [];
						scoreCounter = 0;
						addToSequence(function(){
							instructions(sequenceArr);
						});
					} else {
						instructions(sequenceArr);
					}
				}
				else if(userArr[userArr.length - 1] == sequenceArr[sequenceArr.length - 1] && userArr.length == sequenceArr.length){
					playerTurn = !playerTurn;
					$("#score").html('GGWP');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					if(scoreCounter >= 20 && bonusGame == false){
						userVictory();
					}
					else{
						addToSequence(function(){
							instructions(sequenceArr);
						});	
					}
				}
			}
		}
	});

	$("#greenButton").click(function(){
		if(powerOn){
			if(playerTurn){
				greenSound.play();
				userArr.push(this.id);
				if(userArr[userArr.length - 1] != sequenceArr[userArr.length - 1]){
					$("#score").html('oops!');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					userArr.pop();
					playerTurn = !playerTurn;
					if(strictMode){
						sequenceArr = [];
						userArr = [];
						scoreCounter = 0;
						addToSequence(function(){
							instructions(sequenceArr);
						});
					} else {
						instructions(sequenceArr);
					}
				}
				else if(userArr[userArr.length - 1] == sequenceArr[sequenceArr.length - 1] && userArr.length == sequenceArr.length){
					$("#score").html('GGWP');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					playerTurn = !playerTurn;
					if(scoreCounter >= 20 && bonusGame == false){
						userVictory();
					}
					else{
						addToSequence(function(){
							instructions(sequenceArr);
						});	
					}
				}
			}
		}
	});

	$("#blueButton").click(function(){
		if(powerOn){
			if(playerTurn){
				blueSound.play();
				userArr.push(this.id);
				if(userArr[userArr.length - 1] != sequenceArr[userArr.length - 1]){
					$("#score").html('oops!');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					userArr.pop();
					playerTurn = !playerTurn;
					if(strictMode){
						sequenceArr = [];
						userArr = [];
						scoreCounter = 0;
						addToSequence(function(){
							instructions(sequenceArr);
						});
					} else {
						instructions(sequenceArr);
					}
				}
				else if(userArr[userArr.length - 1] == sequenceArr[sequenceArr.length - 1] && userArr.length == sequenceArr.length){
					$("#score").html('GGWP');
					setTimeout(function(){
						$("#score").html(scoreCounter);
					}, 500);
					playerTurn = !playerTurn;
					if(scoreCounter >= 20 && bonusGame == false){
						userVictory();
					}
					else{
						addToSequence(function(){
							instructions(sequenceArr);
						});	
					}
				}
			}
		}
	});

	$("#heckYeah").click(function(){
		$("#victoryDiv").css("opacity", "0");
		$("#heckYeah").css("opacity", "0");
		$("#heckYeah").prop('disabled', true);
		$("#nopeBacon").css("opacity", "0");
		$("#nopeBacon").prop('disabled', true);
		$("#boardContainer").removeClass("victoryPositionDown");
		bonusGame = true;
		setTimeout(function(){
			addToSequence(function(){
				instructions(sequenceArr);
			});	
		}, 1000);
	});

	$("#nopeBacon").click(function(){
		$("#boardContainer").removeClass("victoryPositionDown");
		setTimeout(function(){
			togglePower();
		}, 1250);
	});

// $("#testDiv").click(function(){
// 	addToSequence();
// });


}); //end of doc ready