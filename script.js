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
        ShowEntryModal(false);
    }
}
  
function ShowEntryModal(edit, id) {
    if (edit === false) {
        //converts ticks to usable format
        var startTime = ConvertDateTicks(currentEntryStartTime, false);
        var stopTime = ConvertDateTicks(currentEntryStopTime, false);
        //sets time picker values
        document.getElementById("startTimePicker").value = ToDatetimeLocal(startTime);
        document.getElementById("stopTimePicker").value = ToDatetimeLocal(stopTime);
        var test = document.getElementById("startTimePicker").value;
        UpdateModalDuration();
        //displays modal
        var itemModal = document.getElementById("entryModal");
        document.getElementById("floatingDescription").value = null;
        document.getElementById("entryModalHeader").innerHTML = "Save Entry";
        document.getElementById("discardEntryButton").innerHTML = "Discard"
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
            var startTime = new Date(document.getElementById("startTimePicker").value).getTime();
            var stopTime = new Date(document.getElementById("stopTimePicker").value).getTime();
            var entry = new Entry(id.split("_").pop(), startTime, stopTime, description, chargeNumber);
            localStorage.setItem(id, JSON.stringify(entry));
            RefreshTodayUI();
        };
    }
    else {
        if (id !== undefined) {
            var entry = EntryById(id);
            //converts ticks to usable format
            var startTime = ConvertDateTicks(entry.startTime, false);
            var stopTime = ConvertDateTicks(entry.endTime, false);
            //sets values
            document.getElementById("startTimePicker").value = ToDatetimeLocal(startTime);
            document.getElementById("stopTimePicker").value = ToDatetimeLocal(stopTime);
            document.getElementById("floatingDescription").value = entry.description;
            document.getElementById("chargeNumber").value = entry.chargeNumber;
            UpdateModalDuration();
            //displays modal
            var itemModal = document.getElementById("entryModal");
            document.getElementById("entryModalHeader").innerHTML = "Edit Entry";
            document.getElementById("discardEntryButton").innerHTML = "Cancel"
            itemModal.value = entry.id;
            itemModal.style.display = "block";
            //sets discard button click method
            document.getElementById("discardEntryButton").onclick = function() {
                itemModal.style.display = "none";
            };
            //sets save button click method
            document.getElementById("saveEntryButton").onclick = function() {
                itemModal.style.display = "none";
                var id = "timeLogger.Entry_" + document.getElementById("entryModal").value;
                var description = document.getElementById("floatingDescription").value;
                var chargeNumber = document.getElementById("chargeNumber").value;
                var startTime = new Date(document.getElementById("startTimePicker").value).getTime();
                var stopTime = new Date(document.getElementById("stopTimePicker").value).getTime();
                var entry = new Entry(id.split("_").pop(), startTime, stopTime, description, chargeNumber);
                localStorage.setItem(id, JSON.stringify(entry));
                RefreshTodayUI();
            };
        }
    }
}

function ShowDeleteModal(id) {
    //displays modal
    var entry = EntryById(id);
    var duration = ConvertDateTicks(entry.endTime - entry.startTime, true);
    var itemModal = document.getElementById("deleteModal");
    document.getElementById("deleteDescription").innerHTML = entry.description;
    document.getElementById("deleteDuration").innerHTML = duration.hour + ":" + duration.minute + ":" + duration.second;
    document.getElementById("deleteCharge").innerHTML = entry.chargeNumber;
    itemModal.style.display = "block";
    //sets discard button click method
    document.getElementById("cancelDeleteButton").onclick = function() {
        itemModal.style.display = "none";
    };
    //sets deletes item function method
    document.getElementById("deleteEntryButton").onclick = function() {
        itemModal.style.display = "none";
        localStorage.removeItem("timeLogger.Entry_" + id);
        RefreshTodayUI();
    };
}

function CopyDescriptionToClipboard(charge) {
    //gets today's entries and creates string to copy
    var str = "";
    var entries = TodaysEntries();
    entries.filter(function(entry) { return entry.chargeNumber == charge; })
    .forEach(entry => 
        str += str === "" ? entry.description : " " + entry.description
    );
    //Creates dummy element
    var el = document.createElement('textarea');
    //Sets value (string to be copied)
    el.value = str;
    //Sets non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    //Selects text inside element
    el.select();
    //Copies text to clipboard
    document.execCommand('copy');
    //Removes temporary element
    document.body.removeChild(el);
    var button = document.getElementById("copy_" + charge);
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">' +
        '<path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>' +
        '<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>' +
        '<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>' +
    '</svg>';
    setTimeout(function() {
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">' +
            '<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>' +
            '<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>' +
        '</svg>';
    }, 2000);
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
          '<td>' + 
            '<button id="copy_' + chargeNumber[0].chargeNumber + '" onclick="CopyDescriptionToClipboard(' + chargeNumber[0].chargeNumber + ')" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-sm">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">' +
                    '<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>' +
                    '<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>' +
                '</svg>' +  
            '</button>' + 
          '</td>' +
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
          '<td><button onclick="ShowEntryModal(true, ' + entry.id + ')" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-sm">Edit</button></td>' +
          '<td><button onclick="ShowDeleteModal(' + entry.id + ')" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-sm">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">' +
                '<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>' +
            '</svg></button></td>' +
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
        total = new Date(TodaysEntries().map(function(entry) { return entry.endTime - entry.startTime; }).reduce((a, b) => a + b, 0)).setMilliseconds(0);
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

function ToDatetimeLocal(time) {
    return time.year + "-" + time.month + "-" + time.date + "T" + time.hour + ":" + time.minute + ":" + time.second;
}

function TwelveHourTime(hour, minute, second, showSeconds) {
    var suffix = hour >= 12 ? " PM":" AM";
    var hour = hour > 12 ? hour - 12 : hour;
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

function EntryById(id) {
    return JSON.parse(localStorage.getItem("timeLogger.Entry_" + id));
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