var TIMERSTATE = "off";
/* STATES:

    off (no interaction), 
    waiting (waiting to see if spacebar will be held longer than the waittime)
    ready (ready to start on spacebar release)
    timing (timer is timing solve)

*/

var timer = document.getElementById("timerDisplay");
var timerStateDisplay = document.getElementById("timerStateDisplay");
var spaceHeldTimeDisplay = document.getElementById("spaceHeldTime");
var spacePressedTime = null;
var spaceHeldTime = null;
var WAITTIME = 300;

var timerInitTime = null;
var timerUpdateInterval = null;

// functions

function getSpaceHeldTime() {
    if (spacePressedTime != null) {
    return Date.now() - spacePressedTime;
    }
    return 0;
}

function getElapsedTime() {
    return Date.now() - timerInitTime;
}

// actual timer functions

function pad(time, desiredLen) {
    var output = String(time)
    while (output.length < desiredLen) {
        output = "0" + output;
    }
    return output
}

function updateTimer() {
    var elapsedTime = getElapsedTime();
    var output = "";

    var minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    var seconds = Math.floor((elapsedTime / 1000) % 60);
    if (minutes > 0) {
        seconds = pad(seconds, 2);
        output = String(minutes) + ":";
    }
    var centiseconds = pad(Math.floor(elapsedTime % 1000 / 10), 2);

    output = output + String(seconds);
    output = output + "." + String(centiseconds);

    timer.textContent = output;
}

function updateStateDisplay() {
    timerStateDisplay.textContent = TIMERSTATE;
    spaceHeldTimeDisplay.textContent = getSpaceHeldTime();
}

// space press/release functions
function timerSpacePressed() {
    if (spacePressedTime == null) {
        spacePressedTime = Date.now();
    }
    var heldTime = getSpaceHeldTime();
    
    // handles if user pressed space before readying timer
    if (heldTime < WAITTIME && TIMERSTATE != "timing") {
        timer.classList.remove("timerDisplayOff");
        timer.classList.add("timerDisplayWaiting");
        //console.log("Should be waiting...")

        TIMERSTATE = "waiting"
    }

    // handles if user held space until timer was ready
    else if (heldTime >= WAITTIME && TIMERSTATE == "waiting") {
        timer.classList.remove("timerDisplayWaiting");
        timer.classList.add("timerDisplayReady");
        //console.log("Should be ready...")

        TIMERSTATE = "ready"
    }

    // handle if user stopped timer
    else if (TIMERSTATE == "timing") {
        clearInterval(timerUpdateInterval);
        timerUpdateInterval = null;
        updateTimer(); // one last time

        timer.classList.remove("timerDisplayTiming");
        timer.classList.remove("timerDisplayReady");
        timer.classList.remove("timerDisplayWaiting");
        timer.classList.add("timerDisplayOff");
        //console.log("Should have stopped the timer...")

        TIMERSTATE = "off";
        timerInitTime = null;
        spacePressedTime = null;
        spaceHeldTime = null;
    }

    updateStateDisplay();
}

function timerSpaceReleased() {
    var heldTime = getSpaceHeldTime();
    // handles if user released space before readying timer
    if (heldTime < WAITTIME) {
        timer.classList.remove("timerDisplayWaiting");
        timer.classList.add("timerDisplayOff");
        //console.log("Should have stopped waiting...")
        spacePressedTime = null;

        TIMERSTATE = "off"
    }

    // handles if user readied timer
    else if (heldTime >= WAITTIME && TIMERSTATE == "ready") {
        timer.classList.remove("timerDisplayWaiting");
        timer.classList.add("timerDisplayTiming");
        //console.log("Should have started timing...")
        spacePressedTime = null;

        timer.textContent = "0";

        TIMERSTATE = "timing"
        timerInitTime = Date.now();
        timerUpdateInterval = setInterval(updateTimer, 10);
    }

    else if (heldTime >= WAITTIME) {
        timer.classList.remove("timerDisplayWaiting")
        timer.classList.add("timerDisplayOff")

        TIMERSTATE = "off"
        spacePressedTime = null;
    }

    updateStateDisplay();
}

// event listeners

document.body.addEventListener("keydown", (event) => {
    if (event.key == " " || TIMERSTATE == "timing") {
        timerSpacePressed();
    }
});

document.body.addEventListener("keyup", (event) => {
    if (event.key == " ") {
        timerSpaceReleased();
    }
});
