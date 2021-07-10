"use strict";

window.onload = function () {
  var menuOpenBtn = document.getElementById("menu_btn"),
    sidebar = document.getElementById("sidebar"),
    bodyShadow = document.getElementById("on_sidebar_active"),
    sidebarClose = document.getElementById("close_sidebar"),
    particlesBg = document.getElementById("particles-js"),
    mainWrapper = document.getElementById("main_wrapper"),
    saveButton = document.getElementById("save_btn"),
    speedFast = document.getElementById("speed_fast"),
    speedMedium = document.getElementById("speed_medium"),
    speedSlow = document.getElementById("speed_slow"),
    savedBlock = document.getElementById("saved_text"),
    play = document.getElementById("play"),
    stop = document.getElementById("stop"),
    spawnArea = document.getElementById("circles_wrapper"),
    freeMode = document.getElementById("free_mode"),
    scoreMode = document.getElementById("score_mode"),
    scoreCounter = document.getElementById("show_score"),
    continueBtn = document.getElementById("cont_btn"),
    yourScoreText = document.getElementById("your_score"),
    gameIsOn = false,
    speed = 1300,
    score = 0,
    scoreModeOn = true,
    gameTimeout,
    timer = document.getElementById("timer"),
    timerField = document.getElementById("timer_field"),
    clickText = document.getElementById("click"),
    gameOverBlock = document.getElementById("game_over"),
    gameOverScore = document.getElementById("score"),
    showScore = document.getElementById("play_score"),
    circles = document.getElementsByClassName("circle"),
    controlItems = document.getElementsByClassName("control__item"),
    windowWidth = window.innerWidth,
    spawnEdge = 200,
    showOne,
    showTwo,
    showThree,
    showFour,
    showFive;

  if (windowWidth >= 2560) {
    spawnEdge = 310;
  } else if (windowWidth >= 1920 && windowWidth < 2560) {
    spawnEdge = 300;
  } else if (windowWidth >= 1680 && windowWidth < 1920) {
    spawnEdge = 260;
  } else if (windowWidth >= 1440 && windowWidth < 1680) {
    spawnEdge = 230;
  } else if (windowWidth >= 600 && windowWidth < 1080) {
    spawnEdge = 160;
  } else if (windowWidth >= 425 && windowWidth < 600) {
    spawnEdge = 130;
  } else if (windowWidth >= 320 && windowWidth < 425) {
    spawnEdge = 110;
  }

  play.onclick = function () {
    timer.style.display = "flex";
    var timerCounter = 2;

    this.classList.add("play-inactive");
    menuOpenBtn.classList.add("play-inactive");

    var startPlayTimer = setInterval(function () {
      timerField.innerHTML = timerCounter;

      if (timerCounter === 0) {
        gameIsOn = true;
        timerField.innerHTML = "3";
        timer.style.display = "none";
        timerCounter = 2;
        clearInterval(startPlayTimer);

        resetTimer();

        clickText.style.display = "flex";
        setTimeout(function () {
          clickText.style.display = "none";
        }, 750);

        if (gameIsOn === true) {
          (showOne = setInterval(function () {
            beginDraw(circles[0]);
          }, speed)),
            (showTwo = setInterval(function () {
              beginDraw(circles[1]);
            }, speed + 500)),
            (showThree = setInterval(function () {
              beginDraw(circles[2]);
            }, speed + 800)),
            (showFour = setInterval(function () {
              beginDraw(circles[3]);
            }, speed + 1100)),
            (showFive = setInterval(function () {
              beginDraw(circles[4]);
            }, speed + 1500));

          stop.onclick = function () {
            if (gameIsOn && scoreModeOn)
              stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
            else if (gameIsOn && !scoreModeOn)
              stopFreeGame(showOne, showTwo, showThree, showFour, showFive);
          };
        }
      }
      timerCounter--;
    }, 800);
  };

  menuOpenBtn.onclick = function () {
    sidebar.style.right = "0";
    bodyShadow.classList.add("body-shadow");
  };

  /* Close sidebar */
  sidebarClose.onclick = function () {
    sidebar.style.right = "-350px";
    bodyShadow.classList.remove("body-shadow");
  };

  bodyShadow.onclick = function () {
    sidebar.style.right = "-350px";
    this.classList.remove("body-shadow");
  };

  saveButton.onclick = function () {
    var darkTheme = document.getElementById("dark_theme"),
      lightTheme = document.getElementById("light_theme");

    if (lightTheme.checked) setLightTheme();
    else if (darkTheme.checked) setDarkTheme();

    if (speedFast.checked) speed = 1000;
    else if (speedMedium.checked) speed = 1300;
    else if (speedSlow.checked) speed = 2000;

    if (scoreMode.checked) {
      scoreModeOn = true;
      scoreCounter.style.display = "block";
      score = 0;
      showScore.innerHTML = 0;
      gameOverScore.innerHTML = 0;
      yourScoreText.style.display = "block";
    } else if (freeMode.checked) {
      scoreModeOn = false;
      scoreCounter.style.display = "none";
      score = 0;
      showScore.innerHTML = 0;
      gameOverScore.innerHTML = 0;
      yourScoreText.style.display = "none";
    }
    showTheSaved();
  };

  function timeIsOut() {
    if (gameIsOn && scoreModeOn)
      stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
    else if (gameIsOn && !scoreModeOn)
      stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
  }

  function resetTimer() {
    if (gameIsOn) {
      clearTimeout(gameTimeout);
      gameTimeout = setTimeout(timeIsOut, 3000);
    }
  }

  function setLightTheme() {
    particlesBg.classList.add("particles-bg_light");
    mainWrapper.classList.add("main__wrapper_light");
    sidebar.classList.add("sidebar_light");
    saveButton.classList.add("save-btn_light");
    menuOpenBtn.classList.add("open-btn_light");
    continueBtn.classList.add("continue_light");

    for (var c = 0; c < circles.length; c++)
      circles[c].classList.add("circle_light");

    for (var i = 0; i < controlItems.length; i++)
      controlItems[i].classList.add("control__item_light");
  }

  function setDarkTheme() {
    particlesBg.classList.remove("particles-bg_light");
    mainWrapper.classList.remove("main__wrapper_light");
    sidebar.classList.remove("sidebar_light");
    saveButton.classList.remove("save-btn_light");
    menuOpenBtn.classList.remove("open-btn_light");
    continueBtn.classList.remove("continue_light");

    for (var d = 0; d < circles.length; d++)
      circles[d].classList.remove("circle_light");

    for (var i = 0; i < controlItems.length; i++)
      controlItems[i].classList.remove("control__item_light");
  }

  function blow(object) {
    resetTimer();

    object.style.opacity = "0";
    object.style.transform = "scale(3)";
    object.classList.add("circle-blow");
    if (object.classList.contains("circle-blow")) {
      setTimeout(function () {
        object.classList.add("low_index");
      }, 100);
    }
    object.classList.remove("circle_animate");
  }

  function show(object) {
    object.classList.remove("low_index");
    object.style.transition = "all .3s ease";
    object.classList.remove("circle-blow");
    object.classList.add("circle_animate");
    object.style.transform = "scale(1)";
    object.style.opacity = "1";
  }

  function beginDraw(circle) {
    if (gameIsOn) {
      var x = String(getRandom(50, spawnArea.offsetWidth - spawnEdge));
      var y = String(getRandom(50, spawnArea.offsetHeight - spawnEdge));

      circle.style.left = x + "px";
      circle.style.top = y + "px";

      circle.style.display = "block";

      if (scoreModeOn) {
        spawnArea.onclick = function (e) {
          var target = e.target;

          if (target.classList.contains("circle")) {
            var currentCircle = document.getElementById(target.id);

            blow(currentCircle);
            score++;

            showScore.innerHTML = score;
          } else {
            if (gameIsOn && scoreModeOn)
              stopTheScoreGame(showOne, showTwo, showThree, showFour, showFive);
          }
        };
        show(circle);
      } else {
        circle.onclick = function () {
          blow(circle);
        };
        show(circle);
      }
    }
  }

  function stopTheScoreGame(iOne, iTwo, iThree, iFour, iFive) {
    gameIsOn = false;

    for (var i = 0; i < circles.length; i++) circles[i].style.display = "none";

    clearInterval(iOne);
    clearInterval(iTwo);
    clearInterval(iThree);
    clearInterval(iFour);
    clearInterval(iFive);

    play.classList.remove("play-inactive");
    menuOpenBtn.classList.remove("play-inactive");

    gameOverBlock.style.display = "flex";
    gameOverScore.innerHTML = score;

    continueBtn.onclick = function () {
      gameOverBlock.style.display = "none";
      gameOverScore.innerHTML = 0;
      showScore.innerHTML = 0;
      score = 0;
    };
  }

  function stopFreeGame(iOne, iTwo, iThree, iFour, iFive) {
    gameIsOn = false;

    for (var i = 0; i < circles.length; i++) circles[i].style.display = "none";

    clearInterval(iOne);
    clearInterval(iTwo);
    clearInterval(iThree);
    clearInterval(iFour);
    clearInterval(iFive);

    play.classList.remove("play-inactive");
    menuOpenBtn.classList.remove("play-inactive");
  }

  function showTheSaved() {
    if (windowWidth >= 320 && windowWidth < 767) {
      savedBlock.style.bottom = "30px";
      savedBlock.style.opacity = "1";
      setTimeout(function () {
        savedBlock.style.bottom = "-100px";
      }, 2000);
    } else {
      savedBlock.style.top = "30px";
      savedBlock.style.opacity = "1";
      setTimeout(function () {
        savedBlock.style.top = "-100px";
      }, 2000);
    }
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
