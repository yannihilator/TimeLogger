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
    }

}

/**
 * Self-adjusting interval to account for drifting
 * 
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds) - This 
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
function AdjustingInterval(interval, errorFunc) {
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
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
        //do work here
        var timespan = getTimeSpan(Date.now() - currentEntryStartTime);
        document.getElementById("timeElapsed").innerHTML = timespan.hour + ":" + timespan.minute + ":" + timespan.second;
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