const timeDisplay = document.querySelector("#timeDisplay");

let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let intervalId;
let mins = 0;
let secs = 0;
let centi = 0;
let spacebarPressedTime = 0;
let spacebarReleasedTime = 0;

function getSettings(){
    /*
    VIEW TYPES:

        cs - include centiseconds (2 digits after .)
        ds - use deciseconds (1 digit after .)
        hide - don't show the time until after you stop the timer

    */
    if (localStorage.getItem("timerSettings") == null) {
        var timerSettings = {
            "view": "ms",
            "timerHiddenText": "Solve"
        };
        localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
    }
    else {
        var timerSettings = JSON.parse(localStorage.getItem('timerSettings'));
    }
    return timerSettings;
}

function updateSettings(newSettings){
    localStorage.setItem('timerSettings', JSON.stringify(newSettings))
}

function setSetting(setting, newValue) {
    var settings = getSettings();
    settings[setting] = newValue;
    updateSettings(settings);
}

setSetting("view", "cs");
var timerSettings = getSettings();

document.body.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        spacebarPressedTime = Date.now();
    }
});

document.body.addEventListener("keyup", (event) => {
    if (event.key === " ") {
        spacebarReleasedTime = Date.now();
        const spacebarHoldDuration = spacebarReleasedTime - spacebarPressedTime;
        console.log(spacebarHoldDuration)

        if (spacebarHoldDuration >= 300) {
            resetTimer();
        } else {
            if (intervalId) {
                pauseTimer();
            } else {
                resetTimer()
                startTimer();
            }
        }
    }
});

function startTimer() {
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateTime, 10);
}

function pauseTimer() {
    elapsedTime = Date.now() - startTime;
    clearInterval(intervalId);
    intervalId = null;

    timeDisplay.textContent = formatTime(String(`${mins}:${secs}.${centi}`)); //display real time
}

function resetTimer() {
    elapsedTime = 0;
    clearInterval(intervalId);
    intervalId = null;
    mins = 0;
    secs = 0;
    centi = 0;
    timeDisplay.textContent = "0.00";
}

function formatTime(time){
    let output = String(time);
    //no minutes
    if (output.slice(0, 2) == "0:") {
        output = output.slice(2, output.length);
    }
    
    else if (output.slice(0, 2) !== "0:") {
        output = String(mins) + ":" + pad(secs) + "." + pad(centi);
    }
    
    return output;
};

function pad(unit) {
    return (("0") + unit).length > 2 ? unit : "0" + unit;
}

function getTime(time) {
    if (timerSettings["view"] == "hide") {
        return timerSettings["timerHiddenText"];
    }

    if (timerSettings["view"] == "cs") {
        return time;
    }
    else if (timerSettings["view"] == "ds") {
        return time.slice(0, time.length - 1);
    }
    else {
        return time;
    }
}

function updateTime() {
    elapsedTime = Date.now() - startTime;

    centi = Math.floor((elapsedTime / 10) % 100);
    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);

    centi = pad(centi); // pad it so it's always 2 digits

    timeDisplay.textContent = getTime(formatTime(String(`${mins}:${secs}.${centi}`)));
}
