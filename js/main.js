"use strict";

window.onload = function() {

	/* Get all variables */

	var 

		//UI

		menuOpenBtn    = document.getElementById('menu_btn'),  //open sidebar button
		sidebar 	   = document.getElementById('sidebar'),    //sidebar
		bodyShadow     = document.getElementById('on_sidebar_active'),  //shadow block on bg
		sidebarClose   = document.getElementById('close_sidebar'),    //close sidebar button
		particlesBg    = document.getElementById('particles-js'),   //background with particle.js
		mainWrapper    = document.getElementById('main_wrapper'),  //main wrapper
		saveButton     = document.getElementById('save_btn'),   //save button
		speedFast      = document.getElementById('speed_fast'),    // fast speed input
		speedMedium    = document.getElementById('speed_medium'),  //medium speed input
		speedSlow      = document.getElementById('speed_slow'),   // slow speed input
		savedBlock     = document.getElementById('saved_text'),   //alert block when user saves data
		play           = document.getElementById('play'),    //play button
		stop           = document.getElementById('stop'),   //stop button
		spawnArea      = document.getElementById('circles_wrapper'),  //spawnarea
		freeMode       = document.getElementById('free_mode'),  //free mode input
		scoreMode      = document.getElementById('score_mode'),	//score mode input
		scoreCounter   = document.getElementById('show_score'), //score counre on bottom of UI
		continueBtn    = document.getElementById('cont_btn'),   //button for continue after the end of the game
		yourScoreText  = document.getElementById('your_score'),

		//functionality

		gameIsOn       = false,  //game is off by default        * 
		speed          = 1300,  // speed of spawning circles         MAIN GAME DEPENDENCIES
		score          = 0,    //score indicator                 
		scoreModeOn    = true, //score mode is on by default     *
		gameTimeout, //game timeout indicator                    *
		timer 	       = document.getElementById('timer'),   //reverse timer before the playing
		timerField     = document.getElementById('timer_field'),
		clickText      = document.getElementById('click'),  //show this text after the start timer is over
		gameOverBlock  = document.getElementById('game_over'), //game over text block
		gameOverScore  = document.getElementById('score'),   //show score when game is over
		showScore      = document.getElementById('play_score'),  //show score while player in game
		circles        = document.getElementsByClassName('circle'), //circles array
		controlItems   = document.getElementsByClassName('control__item'), //control items array
		windowWidth    = window.innerWidth,  //get user window width
		spawnEdge      = 200,     //edge of spawning on spawn area (default, for 1366 - 768)

		//variables for spawning

		showOne, showTwo, showThree, showFour, showFive;  //all the five circles 

	//change spawn edge in different resolutions
	if (windowWidth >= 2560) { spawnEdge = 310; }   //2560 - up
	else if (windowWidth >= 1920 && windowWidth < 2560) { spawnEdge = 300; }  //1920 - 2559
	else if (windowWidth >= 1680 && windowWidth < 1920) { spawnEdge = 260; } //1680 - 1919
	else if (windowWidth >= 1440 && windowWidth < 1680) { spawnEdge = 230; } //1440 - 1679
	else if (windowWidth >= 600 && windowWidth < 1080) { spawnEdge = 160; } //600 - 1079
	else if (windowWidth >= 425 && windowWidth < 600) { spawnEdge = 130; } //425 - 600
	else if (windowWidth >= 320 && windowWidth < 425) { spawnEdge = 110; } //320 - 424

	//if user press play button
	play.onclick = function() {
		timer.style.display = 'flex';  //show reverse timer when user start the game
		var timerCounter = 2;

		this.classList.add('play-inactive');  //set some buttons in offline
		menuOpenBtn.classList.add('play-inactive');

		var startPlayTimer = setInterval(function() { //start the reverse counting
			timerField.innerHTML = timerCounter; 

			if (timerCounter === 0)
			{
				gameIsOn = true;  //init start of the game
				timerField.innerHTML = '3';
				timer.style.display = 'none';
				timerCounter = 2;
				clearInterval(startPlayTimer);

				resetTimer(); //when user click, reset the timer

				clickText.style.display = 'flex';  //show the text CLICK after the timer over
				setTimeout(function() {
					clickText.style.display = 'none';
				}, 750);

				if (gameIsOn === true)  //start the game
				{
					//spawning 
					showOne   = setInterval(function() { beginDraw(circles[0]); }, speed),
					showTwo   = setInterval(function() { beginDraw(circles[1]); }, speed + 500),
					showThree = setInterval(function() { beginDraw(circles[2]); }, speed + 800),
					showFour  = setInterval(function() { beginDraw(circles[3]); }, speed + 1100),
					showFive  = setInterval(function() { beginDraw(circles[4]); }, speed + 1500);

					//stop the game
					stop.onclick = function() {
						if (gameIsOn && scoreModeOn)
							stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
						else if (gameIsOn && !scoreModeOn)
							stopFreeGame(showOne, showTwo, showThree, showFour, showFive);
					}
				}
			}
			timerCounter--;
		} ,800); //reverse timer count
	}


  /*			  *
   *			  *
   *    Actions   *
   *  			  *
   *              */


   /* Open sidebar */
	menuOpenBtn.onclick = function() {
		sidebar.style.right = '0';
		bodyShadow.classList.add('body-shadow');
	}

	/* Close sidebar */
	sidebarClose.onclick = function() {
		sidebar.style.right = '-350px';
		bodyShadow.classList.remove('body-shadow');
	}

	bodyShadow.onclick = function() {
		sidebar.style.right = '-350px';
		this.classList.remove('body-shadow');
	}

	/* Save User Settings */
	saveButton.onclick = function() {
		var 
			darkTheme  = document.getElementById('dark_theme'),  //get theme inputs
			lightTheme = document.getElementById('light_theme');

		/* Set the user theme */
		if (lightTheme.checked)
			setLightTheme();
		else if (darkTheme.checked) // (default)
			setDarkTheme();

		/* Set the user speed */
		if (speedFast.checked) //(default)
			speed = 1000;
		else if (speedMedium.checked)
			speed = 1300;
		else if (speedSlow.checked)
			speed = 2000;

		/* Set the user mode */
		if (scoreMode.checked) {
			scoreModeOn                = true;     //switch some settings to score mode
			scoreCounter.style.display = 'block';
			score                      = 0;
			showScore.innerHTML        = 0;
			gameOverScore.innerHTML    = 0;
			yourScoreText.style.display = 'block';
		} else if (freeMode.checked) {
			scoreModeOn                = false;  //switch to free mode
			scoreCounter.style.display = 'none';
			score                      = 0;
			showScore.innerHTML        = 0;
			gameOverScore.innerHTML    = 0;
			yourScoreText.style.display = 'none';
		}
		showTheSaved();  //show the text after the saved data
	}



  /*			  *
   *			  *
   *   Functions  *
   *  			  *
   *              */


    // end the game if user inactive
	function timeIsOut() {
        if (gameIsOn && scoreModeOn)  //if user inactive, stop the game
				stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
		else if (gameIsOn && !scoreModeOn)
			stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
    }

    //reset timer
    function resetTimer() {
    	if (gameIsOn) {
    		clearTimeout(gameTimeout);  //clear interval if user play
        	gameTimeout = setTimeout(timeIsOut, 3000);  //set the timeout counter if user dont play
    	}
    }

   //Light theme
   function setLightTheme() 
   {
   		particlesBg.classList.add('particles-bg_light');  //set the light settings for UI
		mainWrapper.classList.add('main__wrapper_light');
		sidebar.classList.add('sidebar_light');
		saveButton.classList.add('save-btn_light');
		menuOpenBtn.classList.add('open-btn_light');	
		continueBtn.classList.add('continue_light');

		//set the light style for circles
		for (var c = 0; c < circles.length; c++)
			circles[c].classList.add('circle_light');

		//set the light style to all control buttons
		for (var i = 0; i < controlItems.length; i++)
			controlItems[i].classList.add('control__item_light')
   }

   //Dark theme
   function setDarkTheme() 
   {
   		particlesBg.classList.remove('particles-bg_light');  //set the dark settings for UI
		mainWrapper.classList.remove('main__wrapper_light');
		sidebar.classList.remove('sidebar_light');
		saveButton.classList.remove('save-btn_light');
		menuOpenBtn.classList.remove('open-btn_light');
		continueBtn.classList.remove('continue_light');

		//set the dark style for circles
		for (var d = 0; d < circles.length; d++)
			circles[d].classList.remove('circle_light');

		/* Remove the light theme from all control buttons */
		for (var i = 0; i < controlItems.length; i++)
			controlItems[i].classList.remove('control__item_light')
   }

	// Blow the circle if user click
	function blow(object) 
	{
		resetTimer(); //when user click, reset the timer
		
		object.style.opacity = '0';           // animate the circle for blowing effect
		object.style.transform = 'scale(3)';	
		object.classList.add('circle-blow');
		if (object.classList.contains('circle-blow')) {
			setTimeout(function() {
				object.classList.add('low_index');
			}, 100);
		}
		object.classList.remove('circle_animate');
	}

	//and show again
	function show(object) 
	{ 
		object.classList.remove('low_index');
		object.style.transition = 'all .3s ease';   //show circle with scaleUp animation
		object.classList.remove('circle-blow');
		object.classList.add('circle_animate');
		object.style.transform = 'scale(1)';
		object.style.opacity = '1';
	}

	//draw circle on random place
	function beginDraw(circle) 
	{
		if (gameIsOn) //check for the game is on
		{
			var 
				x = String(getRandom(50, spawnArea.offsetWidth - spawnEdge)),  //get random coordinates for spawn
				y = String(getRandom(50, spawnArea.offsetHeight - spawnEdge));

			circle.style.left = x + 'px';  //set coordinates to current circle
			circle.style.top  = y + 'px';

			circle.style.display = 'block';  //show circle on current coordinates

			if (scoreModeOn)   //if user set the score mode
			{
				spawnArea.onclick = function(e) {  
					var target = e.target;  //catch the target

					// check the target
			        if (target.classList.contains('circle')) 
			        {
			        	var currentCircle = document.getElementById(target.id);  //get the current circle

			            blow(currentCircle); //blow the target if this circle
			            score++;  //update the score on every click in circle

			            showScore.innerHTML = score; //and show the score for user 
			        } else {
			        	if (gameIsOn && scoreModeOn)  //if the game is on and the score mode is on, we stop the game
			        		stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
			        }
				}
				show(circle);  //show circle
			} else {
				circle.onclick = function() { //free mode
					blow(circle);
				} 
				show(circle);  //show circle
			}
		}
	}

	//function for stoping the game with score count
	function stopTheScoreGame(iOne, iTwo, iThree, iFour, iFive) {
		gameIsOn = false; //set the game flag on false

		for (var i = 0; i < circles.length; i++) //remove all circles
			circles[i].style.display = 'none';

		clearInterval(iOne); //clear all intervals
		clearInterval(iTwo);
		clearInterval(iThree);
		clearInterval(iFour);
		clearInterval(iFive);

		play.classList.remove('play-inactive');
		menuOpenBtn.classList.remove('play-inactive');

		gameOverBlock.style.display = 'flex';
    	gameOverScore.innerHTML     = score;

    	continueBtn.onclick = function() {
    		gameOverBlock.style.display = 'none';
    		gameOverScore.innerHTML     = 0;
    		showScore.innerHTML         = 0;
    		score                       = 0;
    	}
	}

	//function for the stoping the game with free mode
	function stopFreeGame(iOne, iTwo, iThree, iFour, iFive) {
		gameIsOn = false; //set the game flag on false

		for (var i = 0; i < circles.length; i++) //remove all circles
			circles[i].style.display = 'none';

		clearInterval(iOne); //clear all intervals
		clearInterval(iTwo);
		clearInterval(iThree);
		clearInterval(iFour);
		clearInterval(iFive);

		play.classList.remove('play-inactive');
		menuOpenBtn.classList.remove('play-inactive');
	}

	//show the message about saved data
	function showTheSaved() 
	{
		if (windowWidth >= 320 && windowWidth < 767) {
			savedBlock.style.bottom  = '30px';
			savedBlock.style.opacity = '1';
			setTimeout(function() {
				savedBlock.style.bottom = '-100px';  //set some timeout for alert window
			}, 2000);
		} else {
			savedBlock.style.top = '30px';
			savedBlock.style.opacity = '1';
			setTimeout(function() {
				savedBlock.style.top = '-100px';  //set some timeout for alert window
			}, 2000);
		}
	} 

	//random numbers generator
	function getRandom(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
}