var recording = false;
var timer = new AdjustingInterval(1000);
var currentEntryStartTime, currentEntryStopTime;

function ToggleTimer() {
    var timeElapsed = document.getElementById("timeElapsed");
    var startStopButton = document.getElementById("startStopButton");

    if (recording === false){
        recording = true;
        timer.start();

        //updates UI elements
        startStopButton.innerHTML = "Stop";
        startStopButton.style.backgroundColor = "#892cdc";
        timeElapsed.style.fontWeight = "bold";
    }
    else{
        recording = false;
        timer.stop();

        //resets UI elements
        timeElapsed.innerHTML = "00:00:00";
        startStopButton.innerHTML = "Start";
        startStopButton.style.backgroundColor = "#52057b";
        timeElapsed.style.fontWeight = "normal";
        document.getElementById("tabTitle").innerHTML = "Time Logger"
        ShowModal();
    }
}
  
function ShowModal() {
    document.getElementById("startTimePicker").value = currentEntryStartTime;
    document.getElementById("stopTimePicker").value = currentEntryStopTime;
    var itemModal = document.getElementById("myModal");
    itemModal.style.display = "block";
    document.getElementById("discardEntryButton").onclick = function() {
        itemModal.style.display = "none";
    };
    document.getElementById("saveEntryButton").onclick = function() {
        itemModal.style.display = "none";
        var description = document.getElementById("floatingDescription").value;
        var chargeNumber = document.getElementById("chargeNumber").value;
        var startTime = currentEntryStartTime;
        var stopTime = currentEntryStopTime;
    };
}

/*
 * Self-adjusting interval to account for drifting
 * @param {int}      interval  Interval speed (in milliseconds) - This 
 */
function AdjustingInterval(interval) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        currentEntryStartTime = Date.now();
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
        currentEntryStopTime = Date.now();
    }

    function step() {
        var drift = Date.now() - expected;
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
        
        //updates UI with new timespan
        var timespan = getTimeSpan(Date.now() - currentEntryStartTime);
        var timespanString = timespan.hour + ":" + timespan.minute + ":" + timespan.second;
        document.getElementById("timeElapsed").innerHTML = timespanString;
        document.getElementById("tabTitle").innerHTML = timespanString + " - Time Logger"
    }
}

function getTimeSpan(ticks) {
    var d = new Date(ticks);
    return {
        hour: d.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}), 
        minute: d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}), 
        second: d.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    }
}

class Entry {
    constructor(id, startTime, endTime, description, chargeNumber) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
        this.chargeNumber = chargeNumber;
    }
}