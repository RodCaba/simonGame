var playPattern = Array();
var level = 1;
var promiseArray = Array();
var n = 0;

function playButton(delayNumber, stringPattern){
  var buttonPlay = $("."+stringPattern);
  var audioPlay = new Audio("sounds/"+stringPattern+".mp3");
  setTimeout(function(){
    buttonPlay.animate({
      opacity:"0.5"
    }, 300).animate({
      opacity:"1"
    }, 300)
    audioPlay.play();
  }, delayNumber);
}

function pressButton(stringPattern){
  var buttonPlay = $("."+stringPattern);
  var audioPlay = new Audio("sounds/"+stringPattern+".mp3");
  buttonPlay.illuminate({
    'intensity': 0.1,
    'blink': true,
    'outerGlow': false,
    'blinkSpeed': 400
  });
  setTimeout(function(){
    buttonPlay.css("box-shadow", 'rgb(255, 255, 255) 0px 0px 0px 0px');
  }, 700);

  audioPlay.play();
  if(stringPattern === 'green'){
    return 0;
  }else if (stringPattern === 'red') {
    return 1;
  }else if (stringPattern === 'yellow') {
    return 2;
  }else if (stringPattern === 'blue') {
    return 3;
  }

}

function promiseAppend(nTimes){
    var p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          $(".simon-button").click(function(){
            var j;
            if ($(this).hasClass('green')){
              j = 'green';
            }else if ($(this).hasClass('red')) {
              j = 'red';
            }else if ($(this).hasClass('yellow')) {
              j = 'yellow'
            }else if ($(this).hasClass('blue')) {
              j = 'blue';
            }
            resolve(j);
          })
        }, 300);

      })
      p1
      .then(function(val){
          promiseArray.push(pressButton(val));
          n++;
          promiseAppend(n);
      })
}

for (var i = 0; i < 21; i++) {
  playPattern.push(Math.floor((Math.random()*3)));
}

function playSlice(slice){
  var buttons = $(".simon-button");
  for (var i = 0; i < slice.length; i++) {
    var button = buttons[slice[i]];
    delayNum = 1000 * (i+1);
    if ($(button).hasClass('green')){
      playButton(delayNum, 'green');
    }else if ($(button).hasClass('red')) {
      playButton(delayNum, 'red');
    }else if ($(button).hasClass('yellow')) {
      playButton(delayNum, 'yellow')
    }else if ($(button).hasClass('blue')) {
      playButton(delayNum, 'blue')
    }
  }
}

promiseAppend(n);

function playLevel(level){
  $("h1").text("Level " + level);
  var playPatternSlice = playPattern.slice(0,level);
  playSlice(playPatternSlice);
  promiseArray = Array();
  var p2 = new Promise((resolve, reject) =>{
    setTimeout(() => {
      var compare = true;
      for (var i = 0; i < playPatternSlice.length; i++) {
        if (playPatternSlice[i] != promiseArray[i]) {
          compare = false;
        }
      }
      resolve(compare);
    }, 2500 * level);
  })
  p2
  .then(function(val){
    if(val){
      level++;
      playLevel(level);
    }
    else{
      loseAnimation(nLoseAnimation);
      var wrongAudio = new Audio("sounds/wrong.mp3");
      wrongAudio.play();
    }
  })
}

var nLoseAnimation = 0;
function loseAnimation(nTimesAnimation){
  $("h1").text("You lose! Refresh the page to play again.");
  setTimeout(function(){
    $("body").toggleClass('warning');
  }, 100 * (1+nTimesAnimation));
  nLoseAnimation++;
  if(nLoseAnimation < 8){
    loseAnimation(nLoseAnimation);
  }

}

$(document).keydown(function(){
  playLevel(level);
})
