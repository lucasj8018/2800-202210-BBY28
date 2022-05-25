"use strict";

// Plays the crunch.mp3 audio
function playCrunch(){
    let crunch = new Audio("./mp3/crunch.mp3");
    crunch.play();
}

//-----------------------------------------------------------------------------------
// Upon clicking the word "Bite" at the top of the page, a crunching sound will play, 
// and the classes for each chef hat will change to "chefHatVisible", such that
// the chef hats will then appear.
//----------------------------------------------------------------------------------- 

let biteCount = 0;

document.getElementById("bite").addEventListener("click", function() {

biteCount++;

if (biteCount == 4) {
    playCrunch();
    document.getElementById("chefHat1Image").className = "chefHatVisible";
    document.getElementById("chefHat2Image").className = "chefHatVisible";
    document.getElementById("chefHat3Image").className = "chefHatVisible";
    document.getElementById("chefHat4Image").className = "chefHatVisible";
}
});


