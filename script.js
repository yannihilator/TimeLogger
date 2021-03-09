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
    //converts ticks to usable format
    var startTime = convertDateTicks(currentEntryStartTime, false);
    var stopTime = convertDateTicks(currentEntryStopTime, false);
    //sets time picker values
    document.getElementById("startTimePicker").value = startTime.year + "-" + startTime.month + "-" + startTime.date + "T" + startTime.hour + ":" + startTime.minute + ":" + startTime.second;
    document.getElementById("stopTimePicker").value = stopTime.year + "-" + stopTime.month + "-" + stopTime.date + "T" + stopTime.hour + ":" + stopTime.minute + ":" + stopTime.second;
    UpdateModalDuration(null);
    //displays modal
    var itemModal = document.getElementById("myModal");
    itemModal.style.display = "block";
    //sets discard button click method
    document.getElementById("discardEntryButton").onclick = function() {
        itemModal.style.display = "none";
    };
    //sets save button click method
    document.getElementById("saveEntryButton").onclick = function() {
        itemModal.style.display = "none";
        var description = document.getElementById("floatingDescription").value;
        var chargeNumber = document.getElementById("chargeNumber").value;
        var startTime = currentEntryStartTime;
        var stopTime = currentEntryStopTime;
    };
}

function UpdateModalDuration() {
    var start = Date.parse(document.getElementById("startTimePicker").value);
    var stop = Date.parse(document.getElementById("stopTimePicker").value);
    var duration = convertDateTicks(stop - start, true);
    document.getElementById("durationModal").innerHTML = duration.hour + ":" + duration.minute + ":" + duration.second;
}

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
        var timespan = convertDateTicks(Date.now() - currentEntryStartTime, true);
        var timespanString = timespan.hour + ":" + timespan.minute + ":" + timespan.second;
        document.getElementById("timeElapsed").innerHTML = timespanString;
        document.getElementById("tabTitle").innerHTML = timespanString + " - Time Logger"
    }
}

function convertDateTicks(ticks, timespan) {
    var hours;
    var d = new Date(ticks);
    //if the tick value is for a timespan, the hours need to use the UTC method
    if (timespan === true) {
        hours = d.getUTCHours();
    }
    else {
        hours = d.getHours();
    }
    return {
        year: d.getFullYear(),
        month: (d.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
        date: d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
        hour: hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}), 
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

class ChargeNumber {
    constructor(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }
}