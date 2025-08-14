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
        const lapStopwatchBtn = document.querySelector('#lap-stopwatch');
        const resetStopwatchBtn = document.querySelector('#reset-stopwatch');
        const lapsContainer = document.querySelector('.laps');
        const formatToggle = document.querySelector('#format-toggle');
        const formatLabel = document.querySelector('#format-label');
        const themeSelect = document.querySelector('#theme-select');
        const alarmRepeat = document.querySelector('#alarm-repeat');
        const alarmSoundSelect = document.querySelector('#alarm-sound');
        const timerDisplay = document.querySelector('.timer-display');
        const hoursInput = document.querySelector('#hours');
        const minutesInput = document.querySelector('#minutes');
        const secondsInput = document.querySelector('#seconds');
        const startTimerBtn = document.querySelector('#start-timer');
        const pauseTimerBtn = document.querySelector('#pause-timer');
        const resetTimerBtn = document.querySelector('#reset-timer');
        const timerSoundSelect = document.querySelector('#timer-sound');
        const enableSoundBtn = document.querySelector('#enable-sound');
        const timezoneModal = document.getElementById('timezone-modal');
        const closeTimezoneModal = document.querySelector('.close-timezone-modal');
        const citySearch = document.getElementById('city-search');
        const searchCityBtn = document.getElementById('search-city');
        const worldMap = document.getElementById('world-map');
        const selectedTimezone = document.getElementById('selected-timezone');
        const selectedTime = document.getElementById('selected-time');
        const selectedDate = document.getElementById('selected-date');

        // Audio Elements
        const alarmSoundBeep = document.getElementById('alarm-sound-beep');
        const alarmSoundChime = document.getElementById('alarm-sound-chime');
        const alarmSoundDigital = document.getElementById('alarm-sound-digital');
        const timerSoundBeep = document.getElementById('timer-sound-beep');
        const timerSoundChime = document.getElementById('timer-sound-chime');
        const timerSoundDigital = document.getElementById('timer-sound-digital');

        // Set audio sources
        alarmSoundBeep.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
        alarmSoundChime.src = 'https://assets.mixkit.co/sfx/preview/mixkit-morning-clock-alarm-1003.mp3';
        alarmSoundDigital.src = 'https://assets.mixkit.co/sfx/preview/mixkit-digital-clock-digital-alarm-buzzer-992.mp3';
        timerSoundBeep.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
        timerSoundChime.src = 'https://assets.mixkit.co/sfx/preview/mixkit-morning-clock-alarm-1003.mp3';
        timerSoundDigital.src = 'https://assets.mixkit.co/sfx/preview/mixkit-digital-clock-digital-alarm-buzzer-992.mp3';

        // Initialize
        let currentTheme = 'default';
        let alarms = [];
        let stopwatchTime = 0;
        let stopwatchInterval = null;
        let isStopwatchRunning = false;
        let laps = [];
        let timerTime = 0;
        let timerInterval = null;
        let isTimerRunning = false;
        let activeAlarm = null;
        let soundsEnabled = false;
        let currentSelectedTimezone = 'UTC';
        let timezoneMarker = null;

        // Timezone data with coordinates
        const timezoneData = [
            { id: 'UTC', name: 'UTC', offset: 0, x: 50, y: 50 },
            { id: 'America/New_York', name: 'New York', offset: -5, x: 25, y: 40 },
            { id: 'America/Los_Angeles', name: 'Los Angeles', offset: -8, x: 15, y: 45 },
            { id: 'Europe/London', name: 'London', offset: 0, x: 48, y: 35 },
            { id: 'Europe/Paris', name: 'Paris', offset: 1, x: 50, y: 35 },
            { id: 'Asia/Tokyo', name: 'Tokyo', offset: 9, x: 85, y: 40 },
            { id: 'Asia/Shanghai', name: 'Shanghai', offset: 8, x: 80, y: 40 },
            { id: 'Australia/Sydney', name: 'Sydney', offset: 10, x: 90, y: 70 },
            { id: 'Asia/Dubai', name: 'Dubai', offset: 4, x: 65, y: 45 },
            { id: 'Africa/Cairo', name: 'Cairo', offset: 2, x: 55, y: 45 }
        ];

        // Sound Functions
        function playAlarmSound(soundType) {
            if (!soundsEnabled) return;
            
            stopAlarmSound(); // Stop any currently playing alarm
            
            const soundMap = {
                'beep': alarmSoundBeep,
                'chime': alarmSoundChime,
                'digital': alarmSoundDigital
            };
            
            const sound = soundMap[soundType];
            if (sound) {
                sound.currentTime = 0; // Rewind to start
                sound.loop = true;
                sound.play().catch(e => console.error("Audio play failed:", e));
            }
        }

        function stopAlarmSound() {
            [alarmSoundBeep, alarmSoundChime, alarmSoundDigital].forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        }

        // Enable Sounds Button
        enableSoundBtn?.addEventListener('click', () => {
            // Play and immediately pause a sound to satisfy browser autoplay policies
            alarmSoundBeep.play().then(() => {
                alarmSoundBeep.pause();
                alarmSoundBeep.currentTime = 0;
                soundsEnabled = true;
                showNotification("Sounds enabled successfully!", "success");
                enableSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sounds Enabled';
                setTimeout(() => {
                    enableSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Enable Sounds';
                }, 3000);
            }).catch(e => {
                console.error("Failed to enable sounds:", e);
                showNotification("Please interact with the page to enable sounds", "warning");
                enableSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Enable Sounds (Click Again)';
            });
        });

        // Theme Management
        themeSelect.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            applyTheme();
        });

        function applyTheme() {
            body.className = '';
            body.classList.add(`${currentTheme}-mode`);
            
            const icon = modeToggle.querySelector('i');
            if (currentTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }

        // Dark Mode Toggle
        modeToggle.addEventListener('click', () => {
            const icon = modeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
            
            if (currentTheme === 'dark') {
                currentTheme = 'light';
            } else if (currentTheme === 'light') {
                currentTheme = 'dark';
            } else {
                body.classList.toggle('dark-mode');
            }
            
            themeSelect.value = currentTheme;
        });

        // Clock Functions - FIXED TIME SYNCHRONIZATION
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
            const milliseconds = timeToShow.getMilliseconds();

            // Calculate precise rotations for smooth movement
            const hrotation = 30 * hours + minutes / 2;
            const mrotation = 6 * minutes + seconds / 10;
            const srotation = 6 * seconds + milliseconds / 1000 * 6;

            hour.style.transform = `rotate(${hrotation}deg)`;
            minute.style.transform = `rotate(${mrotation}deg)`;
            second.style.transform = `rotate(${srotation}deg)`;

            let displayHours = hours;
            let period = '';
            
            if (formatToggle.checked) {
                period = hours >= 12 ? ' PM' : ' AM';
                displayHours = hours % 12 || 12;
            }

            digitalTime.textContent = 
                `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${period}`;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.textContent = timeToShow.toLocaleDateString('en-US', options);

            checkAlarms(hours, minutes, seconds);
        }

        // Alarm Functions
        function addAlarm(time, repeat, sound) {
            const alarm = {
                id: Date.now(),
                time,
                repeat,
                sound,
                active: true
            };
            alarms.push(alarm);
            updateAlarmsList();
            showNotification(`Alarm set for ${time}`, "success");
        }

        function removeAlarm(id) {
            alarms = alarms.filter(alarm => alarm.id !== id);
            updateAlarmsList();
            showNotification("Alarm removed", "info");
        }

        function toggleAlarm(id) {
            const alarm = alarms.find(a => a.id === id);
            if (alarm) {
                alarm.active = !alarm.active;
                updateAlarmsList();
                showNotification(`Alarm ${alarm.active ? 'enabled' : 'disabled'}`, "info");
            }
        }

        function updateAlarmsList() {
            alarmsList.innerHTML = '';
            if (alarms.length === 0) {
                alarmsList.innerHTML = '<p class="no-alarms">No alarms set</p>';
                return;
            }
            
            alarms.forEach(alarm => {
                const alarmDiv = document.createElement('div');
                alarmDiv.className = 'alarm-item';
                alarmDiv.innerHTML = `
                    <div class="alarm-time ${alarm.active ? '' : 'disabled'}">${alarm.time}</div>
                    <div class="alarm-actions">
                        <button class="toggle-alarm" data-id="${alarm.id}">
                            <i class="fas fa-${alarm.active ? 'bell' : 'bell-slash'}"></i>
                        </button>
                        <button class="delete-alarm danger" data-id="${alarm.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="alarm-sound">${alarm.sound}</div>
                    <div class="alarm-repeat">${alarm.repeat ? 'Daily' : 'Once'}</div>
                `;
                alarmsList.appendChild(alarmDiv);
            });

            document.querySelectorAll('.toggle-alarm').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    toggleAlarm(parseInt(e.target.closest('button').dataset.id));
                });
            });

            document.querySelectorAll('.delete-alarm').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeAlarm(parseInt(e.target.closest('button').dataset.id));
                });
            });
        }

        function checkAlarms(hours, minutes, seconds) {
            if (seconds !== 0) return;
            
            const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            alarms.forEach(alarm => {
                if (alarm.active && alarm.time === currentTime) {
                    triggerAlarm(alarm);
                    if (!alarm.repeat) {
                        alarm.active = false;
                        updateAlarmsList();
                    }
                }
            });
        }

        function triggerAlarm(alarm) {
            activeAlarm = alarm;
            showNotification(`Alarm! It's ${alarm.time}`, "warning");
            playAlarmSound(alarm.sound);
            showAlarmModal();
        }

        function showAlarmModal() {
            const modal = document.createElement('div');
            modal.className = 'alarm-modal';
            modal.innerHTML = `
                <div class="alarm-modal-content">
                    <h3><i class="fas fa-bell"></i> Alarm!</h3>
                    <p>It's ${activeAlarm.time}</p>
                    <div class="alarm-modal-buttons">
                        <button id="snooze-alarm" class="secondary"><i class="fas fa-bed"></i> Snooze (5 min)</button>
                        <button id="dismiss-alarm" class="success"><i class="fas fa-check"></i> Dismiss</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            document.getElementById('dismiss-alarm').addEventListener('click', () => {
                stopAlarmSound();
                document.body.removeChild(modal);
                activeAlarm = null;
                showNotification("Alarm dismissed", "info");
            });
            
            document.getElementById('snooze-alarm').addEventListener('click', () => {
                stopAlarmSound();
                document.body.removeChild(modal);
                
                const now = new Date();
                const snoozeTime = new Date(now.getTime() + 5 * 60000);
                const hours = snoozeTime.getHours();
                const minutes = snoozeTime.getMinutes();
                const snoozeTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                showNotification(`Alarm snoozed until ${snoozeTimeStr}`, "info");
                
                const snoozeAlarm = {
                    id: Date.now(),
                    time: snoozeTimeStr,
                    repeat: false,
                    sound: activeAlarm.sound,
                    active: true,
                    isSnooze: true
                };
                alarms.push(snoozeAlarm);
                updateAlarmsList();
                activeAlarm = null;
            });
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
                const repeat = alarmRepeat.checked;
                const sound = alarmSoundSelect.value;
                addAlarm(formattedTime, repeat, sound);
                alarmTimeInput.value = '';
            } else {
                showNotification('Please select a time for the alarm', 'error');
            }
        });

        // Stopwatch Functions
        function updateStopwatch() {
            const hours = Math.floor(stopwatchTime / 3600000);
            const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
            const seconds = Math.floor((stopwatchTime % 60000) / 1000);
            const milliseconds = stopwatchTime % 1000;
            
            stopwatchDisplay.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
        }

        function startStopwatch() {
            if (!isStopwatchRunning) {
                isStopwatchRunning = true;
                const startTime = Date.now() - stopwatchTime;
                stopwatchInterval = setInterval(() => {
                    stopwatchTime = Date.now() - startTime;
                    updateStopwatch();
                }, 10);
                startStopwatchBtn.innerHTML = '<i class="fas fa-flag"></i> Lap';
                pauseStopwatchBtn.disabled = false;
                lapStopwatchBtn.disabled = false;
            }
        }

        function pauseStopwatch() {
            isStopwatchRunning = false;
            clearInterval(stopwatchInterval);
            startStopwatchBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        }

        function resetStopwatch() {
            pauseStopwatch();
            stopwatchTime = 0;
            updateStopwatch();
            laps = [];
            updateLaps();
            pauseStopwatchBtn.disabled = true;
            lapStopwatchBtn.disabled = true;
        }

        function lapStopwatch() {
            if (isStopwatchRunning) {
                laps.unshift({
                    number: laps.length + 1,
                    time: stopwatchTime,
                    display: stopwatchDisplay.textContent
                });
                updateLaps();
            }
        }

        function updateLaps() {
            lapsContainer.innerHTML = '';
            if (laps.length === 0) {
                lapsContainer.innerHTML = '<p class="no-laps">No laps recorded</p>';
                return;
            }
            
            laps.forEach((lap, index) => {
                const lapDiv = document.createElement('div');
                lapDiv.className = 'lap-item';
                lapDiv.innerHTML = `
                    <span class="lap-number">${lap.number}</span>
                    <span class="lap-time">${lap.display}</span>
                `;
                if (index === 0) {
                    lapDiv.classList.add('fastest');
                } else if (index === laps.length - 1 && laps.length > 1) {
                    lapDiv.classList.add('slowest');
                }
                lapsContainer.appendChild(lapDiv);
            });
        }

        // Timer Functions
        function updateTimer() {
            const hours = Math.floor(timerTime / 3600);
            const minutes = Math.floor((timerTime % 3600) / 60);
            const seconds = timerTime % 60;
            
            timerDisplay.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function startTimer() {
            if (!isTimerRunning) {
                // If timer is at 0, get values from inputs
                if (timerTime === 0) {
                    const hours = parseInt(hoursInput.value) || 0;
                    const minutes = parseInt(minutesInput.value) || 0;
                    const seconds = parseInt(secondsInput.value) || 0;
                    timerTime = hours * 3600 + minutes * 60 + seconds;
                    
                    if (timerTime === 0) {
                        showNotification('Please set a timer duration', 'error');
                        return;
                    }
                }
                
                isTimerRunning = true;
                timerInterval = setInterval(() => {
                    if (timerTime > 0) {
                        timerTime--;
                        updateTimer();
                    } else {
                        timerComplete();
                    }
                }, 1000);
                startTimerBtn.disabled = true;
                pauseTimerBtn.disabled = false;
            }
        }

        function pauseTimer() {
            isTimerRunning = false;
            clearInterval(timerInterval);
            startTimerBtn.disabled = false;
        }

        function resetTimer() {
            pauseTimer();
            timerTime = 0;
            updateTimer();
            hoursInput.value = '';
            minutesInput.value = '';
            secondsInput.value = '';
            pauseTimerBtn.disabled = true;
        }

        function timerComplete() {
            pauseTimer();
            showNotification('Timer completed!', 'success');
            
            // Play sound
            const soundMap = {
                'beep': timerSoundBeep,
                'chime': timerSoundChime,
                'digital': timerSoundDigital
            };
            
            const sound = soundMap[timerSoundSelect.value];
            if (sound && soundsEnabled) {
                sound.currentTime = 0;
                sound.play().catch(e => console.error("Timer sound failed:", e));
            }
            
            // Flash timer display
            let flashCount = 0;
            const flashInterval = setInterval(() => {
                timerDisplay.classList.toggle('highlight');
                flashCount++;
                if (flashCount >= 10) {
                    clearInterval(flashInterval);
                    timerDisplay.classList.remove('highlight');
                }
            }, 500);
        }

        // Helper Functions
        function showNotification(message, type = 'success') {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                    type === 'error' ? 'exclamation-circle' : 
                                    type === 'warning' ? 'exclamation-triangle' : 
                                    'info-circle'}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }

        // Timezone Map Functions
        function openTimezoneModal() {
            timezoneModal.classList.add('active');
            generateWorldMap();
            updateSelectedTimezoneInfo();
        }

        function closeTimezoneModalHandler() {
            timezoneModal.classList.remove('active');
        }

        function generateWorldMap() {
            // Clear previous map
            worldMap.innerHTML = '';
            
            // Create SVG container
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 100 100");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.style.width = "100%";
            svg.style.height = "100%";
            
            // Add world map paths (simplified for demo)
            const paths = [
                // North America
                "M10,30 L20,25 L30,30 L35,40 L30,50 L20,55 L10,50 Z",
                // South America
                "M20,55 L25,65 L20,75 L15,70 L15,60 Z",
                // Europe
                "M45,30 L50,25 L55,30 L55,40 L50,45 L45,40 Z",
                // Africa
                "M50,45 L55,40 L60,50 L55,60 L50,55 Z",
                // Asia
                "M60,30 L70,25 L80,30 L85,40 L80,50 L70,55 L60,50 Z",
                // Australia
                "M85,60 L90,65 L85,70 L80,65 Z"
            ];
            
            paths.forEach((pathData, index) => {
                const path = document.createElementNS(svgNS, "path");
                path.setAttribute("d", pathData);
                path.setAttribute("fill", "#4CAF50");
                path.setAttribute("stroke", "#388E3C");
                path.setAttribute("stroke-width", "0.5");
                path.setAttribute("opacity", "0.7");
                svg.appendChild(path);
            });
            
            // Add timezone boundaries (simplified)
            const boundaries = [
                // UTC boundary
                "M40,0 L40,100",
                // America boundaries
                "M30,0 L30,100",
                // Europe/Asia boundary
                "M60,0 L60,100",
                // Australia boundary
                "M85,0 L85,100"
            ];
            
            boundaries.forEach((pathData, index) => {
                const path = document.createElementNS(svgNS, "path");
                path.setAttribute("d", pathData);
                path.setAttribute("stroke", "#2196F3");
                path.setAttribute("stroke-width", "0.3");
                path.setAttribute("stroke-dasharray", "2,2");
                svg.appendChild(path);
            });
            
            // Add timezone markers
            timezoneData.forEach(tz => {
                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttribute("cx", tz.x);
                circle.setAttribute("cy", tz.y);
                circle.setAttribute("r", "1.5");
                circle.setAttribute("fill", "#FF9800");
                circle.setAttribute("stroke", "#F57C00");
                circle.setAttribute("stroke-width", "0.3");
                circle.setAttribute("class", "timezone-circle");
                circle.setAttribute("data-timezone", tz.id);
                circle.setAttribute("data-name", tz.name);
                circle.style.cursor = "pointer";
                svg.appendChild(circle);
                
                // Add click event
                circle.addEventListener('click', () => {
                    selectTimezone(tz.id, tz.name, tz.x, tz.y);
                });
            });
            
            worldMap.appendChild(svg);
        }

        function selectTimezone(timezoneId, timezoneName, x, y) {
            currentSelectedTimezone = timezoneId;
            selectedTimezone.textContent = timezoneName;
            
            // Remove existing marker
            if (timezoneMarker) {
                timezoneMarker.remove();
            }
            
            // Create new marker
            timezoneMarker = document.createElement('div');
            timezoneMarker.className = 'timezone-marker';
            timezoneMarker.style.left = `${x}%`;
            timezoneMarker.style.top = `${y}%`;
            worldMap.appendChild(timezoneMarker);
            
            // Update selected timezone info
            updateSelectedTimezoneInfo();
            
            // Update main clock
            timezoneSelect.value = timezoneId;
            updateClock();
        }

        function updateSelectedTimezoneInfo() {
            const now = new Date();
            let timeToShow = now;
            
            if (currentSelectedTimezone !== 'local') {
                try {
                    timeToShow = new Date(now.toLocaleString('en-US', { timeZone: currentSelectedTimezone }));
                } catch (e) {
                    console.error("Invalid timezone:", currentSelectedTimezone);
                }
            }
            
            const hours = timeToShow.getHours();
            const minutes = timeToShow.getMinutes();
            const seconds = timeToShow.getSeconds();
            
            let displayHours = hours;
            let period = '';
            
            if (formatToggle.checked) {
                period = hours >= 12 ? ' PM' : ' AM';
                displayHours = hours % 12 || 12;
            }
            
            selectedTime.textContent = 
                `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${period}`;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            selectedDate.textContent = timeToShow.toLocaleDateString('en-US', options);
        }

        function searchCity() {
            const searchTerm = citySearch.value.toLowerCase();
            const foundTimezone = timezoneData.find(tz => 
                tz.name.toLowerCase().includes(searchTerm) || 
                tz.id.toLowerCase().includes(searchTerm)
            );
            
            if (foundTimezone) {
                selectTimezone(foundTimezone.id, foundTimezone.name, foundTimezone.x, foundTimezone.y);
                showNotification(`Found timezone: ${foundTimezone.name}`, "success");
            } else {
                showNotification("Timezone not found", "error");
            }
        }

        // Event Listeners
        startStopwatchBtn.addEventListener('click', startStopwatch);
        pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
        lapStopwatchBtn.addEventListener('click', lapStopwatch);
        resetStopwatchBtn.addEventListener('click', resetStopwatch);
        startTimerBtn.addEventListener('click', startTimer);
        pauseTimerBtn.addEventListener('click', pauseTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
        timezoneSelect.addEventListener('change', updateClock);
        formatToggle.addEventListener('change', () => {
            formatLabel.textContent = formatToggle.checked ? '12-hour' : '24-hour';
            updateClock();
        });

        // Timezone modal events
        timezoneSelect.addEventListener('click', openTimezoneModal);
        closeTimezoneModal.addEventListener('click', closeTimezoneModalHandler);
        searchCityBtn.addEventListener('click', searchCity);
        citySearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchCity();
            }
        });

        // Initialize
        pauseStopwatchBtn.disabled = true;
        lapStopwatchBtn.disabled = true;
        pauseTimerBtn.disabled = true;

        // Update clock every 50ms for smooth second hand movement
        setInterval(updateClock, 50);
        setInterval(updateSelectedTimezoneInfo, 1000); // Update selected timezone info every second
        updateClock();
        applyTheme();
        updateAlarmsList();
        updateLaps();
        
        // Initialize with UTC selected
        selectTimezone('UTC', 'UTC', 50, 50);
