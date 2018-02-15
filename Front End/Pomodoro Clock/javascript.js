$(document).ready(function(){

	var canvas = document.querySelector('canvas');

	var c = canvas.getContext('2d');

	canvas.width = 500;
	canvas.height = 500;

	c.arc(250, 250, 240, 0, Math.PI * 2, false);
	c.strokeStyle = '#000';
	c.font = "45px Arial";
	c.fillText("Pomodoro Clock", 80, 140);
	c.fillText("Session", 160, 180);
	c.stroke();

	var remainingSession = document.getElementById('sessionLength').innerHTML;
	var breakLength = document.getElementById('breakLength').innerHTML;
	var sessionLength = document.getElementById('sessionLength').innerHTML;
	var isPaused = true;
	var onBreak = false;

	c.fillText(remainingSession, 215, 250);

	//use if want timer to start once page loads
	// var myTimer = setInterval(function(){
	// 	remainingSession--;
	// 	remainingSession = remainingSession.toString();
	// 	c.clearRect(185, 200, 150, 75);
	// 	c.fillText(remainingSession, 215, 250);
	// 	c.stroke();
	// }, 1000);

	var timerArray = [];
	timerArray.push(Number(remainingSession));

	console.log('onBreak to start = ', onBreak);
	console.log('isPaused to start = ', isPaused);

	function convertMinutesToSeconds(inputArray){
		
		if(inputArray[0] == 0 && inputArray[1] == 0 && !onBreak){
			inputArray[0] = breakLength;
			inputArray[0]--;
			inputArray[1] = 60;
			onBreak = true;
			c.fillText('Break!', 185, 400);
			console.log('onBreak = ', onBreak);
		}

		if(inputArray[0] == 0 && inputArray[1] == 0 && onBreak){
			inputArray[0] = remainingSession;
			inputArray[0]--;
			inputArray[1] = 60;
			onBreak = false;
			c.clearRect(150, 350, 200, 90);
			console.log('onBreak = ', onBreak);
		}

		if(inputArray[1] > 0){
			inputArray[1]--;
		}
		else if(inputArray[0] > 0){
			inputArray[0]--;
			inputArray[1] = 59;
		}
	}

	$(canvas).click(function(){
		
		if(isPaused){
			isPaused = false;
		} else {
			isPaused = true;
		}

		console.log('isPaused = ', isPaused);

		if (isPaused){
			clearInterval(myTimer);
			c.fillText('Paused', 170, 85);
			c.stroke();
		}
		else if (!isPaused){
			c.clearRect(125, 50, 250, 50);
			myTimer = setInterval(function(){
				convertMinutesToSeconds(timerArray);
				c.clearRect(185, 200, 150, 75);
				c.fillText(timerArray[0] + ':' + timerArray[1], 190, 250);
				c.stroke();
			}, 1000);
		}
	});


	$("#minusBreakLength").click(function(){
		if(breakLength > 1){
			breakLength--;
			$("#breakLength").html(breakLength);
		}
	});

	$("#plusBreakLength").click(function(){
		breakLength++;
		$("#breakLength").html(breakLength);
	});

	$("#minusSessionLength").click(function(){
		if(remainingSession > 1){

			if(onBreak){
				onBreak = false;
				c.clearRect(150, 350, 200, 90);
				console.log('onBreak = ', onBreak);
			}

			sessionLength--;
			remainingSession = sessionLength;
			c.clearRect(175, 200, 150, 60);
			c.fillText(remainingSession, 215, 250);
			$("#sessionLength").html(sessionLength);
			timerArray = [];
			timerArray.push(Number(remainingSession));
		}
	});

	$("#plusSessionLength").click(function(){

		if(onBreak){
			onBreak = false;
			c.clearRect(150, 350, 200, 90);
			console.log('onBreak = ', onBreak);
		}

		sessionLength++;
		remainingSession = sessionLength;
		c.clearRect(175, 200, 150, 60);
		c.fillText(remainingSession, 215, 250);
		$("#sessionLength").html(sessionLength);
		timerArray = [];
		timerArray.push(Number(remainingSession));
	});

	$("#reset").click(function(){
		remainingSession = document.getElementById('sessionLength').innerHTML;
		breakLength = document.getElementById('breakLength').innerHTML;
		sessionLength = document.getElementById('sessionLength').innerHTML;
		isPaused = true;
		onBreak = false;

		if (isPaused){
			clearInterval(myTimer);
			c.clearRect(125, 50, 250, 50);
			c.fillText('Paused', 170, 85);
			c.stroke();
			timerArray = [];
			timerArray.push(Number(remainingSession));
			c.clearRect(185, 200, 150, 75);
			c.clearRect(150, 350, 200, 90);
			c.fillText(remainingSession, 215, 250);
		}
	});

// var remainingSession = document.getElementById('sessionLength').innerHTML;
// var breakLength = document.getElementById('breakLength').innerHTML;


}); //end of document ready

// to do:

// pause function
// plus and minus buttons on length values
// add % visual as timer gets closer to destination