var currentEntryStartTime, currentEntryStopTime;
var recording = false;
var timer = new AdjustingInterval(1000);

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
    var startTime = ConvertDateTicks(currentEntryStartTime, false);
    var stopTime = ConvertDateTicks(currentEntryStopTime, false);
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
        RefreshTodayUI();
    };
    //sets save button click method
    document.getElementById("saveEntryButton").onclick = function() {
        itemModal.style.display = "none";
        var id = GetNextId("Entry");
        var description = document.getElementById("floatingDescription").value;
        var chargeNumber = document.getElementById("chargeNumber").value;
        var startTime = currentEntryStartTime;
        var stopTime = currentEntryStopTime;
        var entry = new Entry(id.split("_").pop(), startTime, stopTime, description, chargeNumber);
        localStorage.setItem(id, JSON.stringify(entry));
        RefreshTodayUI();
    };
}

function GetNextId(type) {
    var keys = Object.keys(localStorage).filter(function(key){ return key.includes("timeLogger." + type); });
    if(keys.length > 0) {
        var ids = keys.map(function(key) { return parseInt(key.split("_").pop()); });
        var newId = Math.max.apply(Math, ids) + 1;
        
        return "timeLogger." + type + "_" + newId;
    }
    else return "timeLogger." + type + "_1";
}

function UpdateModalDuration() {
    var start = Date.parse(document.getElementById("startTimePicker").value);
    var stop = Date.parse(document.getElementById("stopTimePicker").value);
    var duration = ConvertDateTicks(stop - start, true);
    document.getElementById("durationModal").innerHTML = duration.hour + ":" + duration.minute + ":" + duration.second;
}

function RefreshTodayUI() {
    var entries = TodaysEntries();
    var totalDuration = ConvertDateTicks(entries.map(function(entry) { return entry.endTime - entry.startTime; }).reduce((a, b) => a + b, 0), true);
    document.getElementById("todaysTotal").innerHTML = '<div class="text-center">' +
    '  <h1 class="display-6" style="color: #222529; font-size: x-large; font-weight: bold;">' +
    '    Total ' +
    '    <span id="totalDuration" class="display-6" style="color: #222529; font-size: x-large;">' + totalDuration.hour + ":" + totalDuration.minute + ":" + totalDuration.second + '</span>' +
    '  </h1>' +
    '</div>';
    //populates totals by charge number table
    document.getElementById("chargeTotalsRows").innerHTML = null; //resets
    var grouped = groupBy(entries, entry => entry.chargeNumber);
    grouped.forEach(chargeNumber => {
        let chargeDuration = ConvertDateTicks(chargeNumber.map(function(entry) { return entry.endTime - entry.startTime; }).reduce((a, b) => a + b, 0), true);
        document.getElementById("chargeTotalsRows").innerHTML += '<tr>' +
          '<td>' + chargeNumber[0].chargeNumber +'</td>' +
          '<td>' + chargeDuration.hour + ":" + chargeDuration.minute + ":" + chargeDuration.second +'</td>' +
          '<td>' + (parseInt(chargeDuration.hour) + parseInt(chargeDuration.minute)/60).toFixed(1) + '</td>' +
        '</tr>';
    });
    //populates entry list table
    document.getElementById("entryListRows").innerHTML = null; //resets
    entries.forEach(entry => {
        var duration = ConvertDateTicks(entry.endTime - entry.startTime, true);
        var startTime = ConvertDateTicks(entry.startTime, false);
        var endTime = ConvertDateTicks(entry.endTime, false);
        document.getElementById("entryListRows").innerHTML += '<tr>' +
          '<td>' + entry.description +'</td>' +  
          '<td>' + entry.chargeNumber +'</td>' +
          '<td>' + duration.hour + ":" + duration.minute + ":" + duration.second +'</td>' +
          '<td>' + TwelveHourTime(startTime.hour, startTime.minute, startTime.second, false) + '</td>' +
          '<td>' + TwelveHourTime(endTime.hour, endTime.minute, endTime.second, false) + '</td>' + 
        '</tr>';
    });
}

function AdjustingInterval(interval) {
    var that = this;
    var expected, timeout, total;
    this.interval = interval;

    //starts timer
    this.start = function() {
        expected = Date.now() + this.interval;
        currentEntryStartTime = Date.now();
        timeout = setTimeout(step, this.interval);
        total = TodaysEntries().map(function(entry) { return entry.endTime - entry.startTime; }).reduce((a, b) => a + b, 0)
    }

    //stops timer
    this.stop = function() {
        clearTimeout(timeout);
        currentEntryStopTime = Date.now();
    }

    //timer tick
    function step() {
        var drift = Date.now() - expected;
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
        
        //updates activity's timespan value
        var timespan = Date.now() - currentEntryStartTime;
        var timespanString = ConvertDateTicks(timespan, true);
        var timespanFormatted = timespanString.hour + ":" + timespanString.minute + ":" + timespanString.second;
        
        //updates today's total running value
        var runningTotal = ConvertDateTicks(total + timespan, true);
        var runningTotalString = runningTotal.hour + ":" + runningTotal.minute + ":" + runningTotal.second;

        //updates UI with new timespan, as well as continues to update the total
        document.getElementById("timeElapsed").innerHTML = timespanFormatted;
        document.getElementById("tabTitle").innerHTML = timespanFormatted + " - Time Logger"
        document.getElementById("totalDuration").innerHTML = runningTotalString;
    }
}

function ConvertDateTicks(ticks, timespan) {
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

function TwelveHourTime(hour, minute, second, showSeconds) {
    var suffix = hour >= 12 ? " PM":" AM";
    var hour = hour > 12 ? ((hour + 11) % 12 + 1) : hour;
    var value = showSeconds ? hour + ":" + minute + ":" + second + suffix : hour + ":" + minute + suffix;
    return value;
}

function GetEntries() {
    var entries = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        entries.push( localStorage.getItem(keys[i]) );
    }
    return entries;
}

function TodaysEntries() {
    var entries = GetEntries();
    var filtered = entries.map(function(json) {return JSON.parse(json); }).filter(function(entry) {
        return entry.startTime >= new Date().setHours(0,0,0,0);
    });
    return filtered.sort((a, b) => (a.startTime > b.startTime) ? -1 : 1);
}

//makeshift class for log entry
function Entry(id, startTime, endTime, description, chargeNumber) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
    this.chargeNumber = chargeNumber;
}

//makeshift class for charge number
function ChargeNumber(id, description, value) {  
    this.id = id;
    this.description = description;
    this.value = value;
}

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
            map.set(key, [item]);
         } 
         else {
            collection.push(item);
         }
    });
    return map;
}