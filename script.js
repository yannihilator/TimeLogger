var recording = false;
var timer = new AdjustingInterval(1000);

function ToggleTimer(){
    if (recording === false){
        recording = true;
        timer.start();
        document.getElementById("startStopButton").innerHTML = "Stop";
    }
    else{
        recording = false;
        timer.stop();
        document.getElementById("timeElapsed").innerHTML = "00:00:00";
        document.getElementById("startStopButton").innerHTML = "Start";
        document.getElementById("tabTitle").innerHTML = "Time Logger"
    }

}

/*
 * Self-adjusting interval to account for drifting
 * @param {int}      interval  Interval speed (in milliseconds) - This 
 */
function AdjustingInterval(interval) {
    var that = this;
    var expected, timeout, currentEntryStartTime;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        currentEntryStartTime = Date.now();
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
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