$(document).ready(function() {
	var availableQuotes = [];

	availableQuotes[0] = '"The master has failed more times than the beginner has even tried." - Anonymous';
	availableQuotes[1] = '"It always seems impossible until it' + "'" + 's done." - Nelson Mandela';
	availableQuotes[2] = '"You are never too old to set a new goal or to dream a new dream." - C.S. Lewis';
	availableQuotes[3] = '"The secret of getting ahead is getting started." - Mark Twain';
	availableQuotes[4] = '"If you can dream it, you can do it." - Walt Disney';
	availableQuotes[5] = '"The journey of a thousand miles must begin with a single step." - Lao Tzu';
	availableQuotes[6] = '"Aim for the moon. If you miss, you may hit a star." - W. Clement Stone';
	availableQuotes[7] = '"Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better." - Samuel Beckett';
	availableQuotes[8] = '"Your talent is God' + "'" + 's gift to you. What you do with it is your gift back to God." - Leo Buscaglia';
	availableQuotes[9] = '"Knowing is not enough; we must apply. Willing is not enough; we must do." - Johann Wolfgang von Goethe';

	

	$("#quoteBox").click(function() {
		var currentQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
		$("#theQuote").html("<p>" + currentQuote + "</p>")
	}); // end of #quoteBox .click event handler

}); //end of jQuery