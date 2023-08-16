let startTime;
let timerInterval;
let isTiming = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isTiming) {
        isTiming = true;
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 10);
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space' && isTiming) {
        clearInterval(timerInterval);
        isTiming = false;
    }
});

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = elapsedTime % 1000;
    
    const formattedTime = `${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}.${formatTimeMilliseconds(milliseconds)}`;
    
    document.getElementById('timer').textContent = formattedTime;
}

function formatTimeComponent(value) {
    return value < 10 ? `0${value}` : value;
}

function formatTimeMilliseconds(value) {
    if (value < 10) {
        return `00${value}`;
    } else if (value < 100) {
        return `0${value}`;
    } else {
        return value;
    }
}
