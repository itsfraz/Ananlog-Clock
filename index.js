// DOM Elements
const hour = document.querySelector('#hour');
const minute = document.querySelector('#minute');
const second = document.querySelector('#second');
const digitalTime = document.querySelector('.time');
const dateDisplay = document.querySelector('.date');
const modeToggle = document.querySelector('.mode-toggle');
const body = document.querySelector('body');
const timezoneSelect = document.querySelector('#timezone-select');
const alarmTimeInput = document.querySelector('#alarm-time');
const setAlarmBtn = document.querySelector('#set-alarm');
const alarmsList = document.querySelector('#alarms-list');
const stopwatchDisplay = document.querySelector('.stopwatch-display');
const startStopwatchBtn = document.querySelector('#start-stopwatch');
const pauseStopwatchBtn = document.querySelector('#pause-stopwatch');
const resetStopwatchBtn = document.querySelector('#reset-stopwatch');
const lapsContainer = document.querySelector('.laps');
const formatToggle = document.querySelector('#format-toggle');
const formatLabel = document.querySelector('#format-label');

// Dark Mode
modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = modeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Clock Functions
function updateClock() {
    const now = new Date();
    const timezone = timezoneSelect.value;
    
    let timeToShow = now;
    if (timezone !== 'local') {
        timeToShow = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    }

    const hours = timeToShow.getHours();
    const minutes = timeToShow.getMinutes();
    const seconds = timeToShow.getSeconds();

    // Update analog clock (always in 12-hour format)
    const hrotation = 30 * (hours % 12) + minutes / 2;
    const mrotation = 6 * minutes;
    const srotation = 6 * seconds;

    hour.style.transform = `rotate(${hrotation}deg)`;
    minute.style.transform = `rotate(${mrotation}deg)`;
    second.style.transform = `rotate(${srotation}deg)`;

    // Update digital time based on format
    let displayHours = hours;
    let period = '';
    
    if (formatToggle.checked) {
        // 12-hour format
        period = hours >= 12 ? ' PM' : ' AM';
        displayHours = hours % 12 || 12;
    }

    digitalTime.textContent = 
        `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${period}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = timeToShow.toLocaleDateString('en-US', options);

    // Check alarms
    checkAlarms(hours, minutes);
}

// Alarm Functions
const alarms = new Set();

function addAlarm(time) {
    alarms.add(time);
    updateAlarmsList();
}

function removeAlarm(time) {
    alarms.delete(time);
    updateAlarmsList();
}

function updateAlarmsList() {
    alarmsList.innerHTML = '';
    alarms.forEach(time => {
        const alarmDiv = document.createElement('div');
        alarmDiv.style.margin = '10px 0';
        alarmDiv.innerHTML = `
            <span>${time}</span>
            <button onclick="removeAlarm('${time}')" style="margin-left: 10px">Delete</button>
        `;
        alarmsList.appendChild(alarmDiv);
    });
}

function checkAlarms(hours, minutes) {
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    if (alarms.has(currentTime)) {
        alert(`Alarm! It's ${currentTime}`);
        removeAlarm(currentTime);
    }
}

setAlarmBtn.addEventListener('click', () => {
    const time = alarmTimeInput.value;
    if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        let displayHours = hours;
        let period = 'AM';

        if (hours >= 12) {
            period = 'PM';
            displayHours = hours > 12 ? hours - 12 : hours;
        } else if (hours === 0) {
            displayHours = 12;
        }

        const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        addAlarm(formattedTime);
        alarmTimeInput.value = '';
    }
});

// Stopwatch Functions
let stopwatchTime = 0;
let stopwatchInterval = null;
let isRunning = false;

function updateStopwatch() {
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    const milliseconds = stopwatchTime % 1000;
    
    stopwatchDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 10; // Increment by 10 milliseconds
            updateStopwatch();
        }, 10);
        startStopwatchBtn.textContent = 'Lap';
    } else {
        // Add lap
        const lapDiv = document.createElement('div');
        lapDiv.textContent = stopwatchDisplay.textContent;
        lapsContainer.insertBefore(lapDiv, lapsContainer.firstChild);
    }
}

function pauseStopwatch() {
    isRunning = false;
    clearInterval(stopwatchInterval);
    startStopwatchBtn.textContent = 'Start';
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatch();
    lapsContainer.innerHTML = '';
}

// Event Listeners
startStopwatchBtn.addEventListener('click', startStopwatch);
pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);
timezoneSelect.addEventListener('change', updateClock);
formatToggle.addEventListener('change', () => {
    formatLabel.textContent = formatToggle.checked ? '12-hour' : '24-hour';
    updateClock();
});

// Initialize
setInterval(updateClock, 1000);
updateClock();