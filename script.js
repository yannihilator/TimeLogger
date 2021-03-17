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
            let id = GetNextId("Entry");
            let description = document.getElementById("floatingDescription").value;
            let chargeNumber = document.getElementById("chargeNumber").value;
            let startTime = new Date(document.getElementById("startTimePicker").value).getTime();
            let stopTime = new Date(document.getElementById("stopTimePicker").value).getTime();
            let entry = new Entry(id.split("_").pop(), startTime, stopTime, description, chargeNumber);
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
                let id = "timeLogger.Entry_" + document.getElementById("entryModal").value;
                let description = document.getElementById("floatingDescription").value;
                let chargeNumber = document.getElementById("chargeNumber").value;
                let startTime = new Date(document.getElementById("startTimePicker").value).getTime();
                let stopTime = new Date(document.getElementById("stopTimePicker").value).getTime();
                let entry = new Entry(id.split("_").pop(), startTime, stopTime, description, chargeNumber);
                localStorage.setItem(id, JSON.stringify(entry));
                RefreshTodayUI();
            };
        }
    }
}

function ShowChargeModal(edit, id) {
    if (edit === false) {
        //displays modal
        var itemModal = document.getElementById("chargeModal");
        document.getElementById("floatingChargeDescription").value = null;
        document.getElementById("floatingChargeValue").value = null;
        document.getElementById("chargeModalHeader").innerHTML = "New Charge Number";
        itemModal.style.display = "block";
        //sets discard button click method
        document.getElementById("discardChargeButton").onclick = function() {
            itemModal.style.display = "none";
            RefreshChargeNumberUI();
        };
        //sets save button click method
        document.getElementById("saveChargeButton").onclick = function() {
            itemModal.style.display = "none";
            let id = GetNextId("Charge");
            let description = document.getElementById("floatingChargeDescription").value;
            let chargeNumber = document.getElementById("floatingChargeValue").value;
            let charge = new ChargeNumber(id.split("_").pop(), description, chargeNumber);
            localStorage.setItem(id, JSON.stringify(charge));
            RefreshChargeNumberUI();
        };
    }
    else {
        if (id !== undefined) {
            let charge = ChargeNumberById(id);
            //sets values
            document.getElementById("floatingChargeDescription").value = charge.description;
            document.getElementById("floatingChargeValue").value = charge.value;
            //displays modal
            var itemModal = document.getElementById("chargeModal");
            document.getElementById("chargeModalHeader").innerHTML = "Edit Charge Number";
            itemModal.value = charge.id;
            itemModal.style.display = "block";
            //sets discard button click method
            document.getElementById("discardChargeButton").onclick = function() {
                itemModal.style.display = "none";
            };
            //sets save button click method
            document.getElementById("saveChargeButton").onclick = function() {
                itemModal.style.display = "none";
                let id = "timeLogger.Charge_" + document.getElementById("chargeModal").value;
                let description = document.getElementById("floatingChargeDescription").value;
                let chargeNumber = document.getElementById("floatingChargeValue").value;
                let charge = new ChargeNumber(id.split("_").pop(), description, chargeNumber);
                localStorage.setItem(id, JSON.stringify(charge));
                RefreshChargeNumberUI();
            };
        }
    }
}

function ShowDeleteEntryModal(id) {
    //displays modal
    var entry = EntryById(id);
    var duration = ConvertDateTicks(entry.endTime - entry.startTime, true);
    var itemModal = document.getElementById("deleteEntryModal");
    document.getElementById("deleteDescription").innerHTML = entry.description;
    document.getElementById("deleteDuration").innerHTML = duration.hour + ":" + duration.minute + ":" + duration.second;
    document.getElementById("deleteCharge").innerHTML = entry.chargeNumber;
    itemModal.style.display = "block";
    //sets cancel button click method
    document.getElementById("cancelDeleteEntryButton").onclick = function() {
        itemModal.style.display = "none";
    };
    //sets deletes item function method
    document.getElementById("deleteEntryButton").onclick = function() {
        itemModal.style.display = "none";
        localStorage.removeItem("timeLogger.Entry_" + id);
        RefreshTodayUI();
    };
}

function ShowDeleteChargeModal(id) {
    //displays modal
    var charge = ChargeNumberById(id);
    var itemModal = document.getElementById("deleteChargeModal");
    document.getElementById("deleteChargeDescription").innerHTML = charge.description;
    document.getElementById("deleteChargeValue").innerHTML = charge.value;
    itemModal.style.display = "block";
    //sets cancel button click method
    document.getElementById("cancelDeleteChargeButton").onclick = function() {
        itemModal.style.display = "none";
    };
    //sets deletes item function method
    document.getElementById("deleteChargeButton").onclick = function() {
        itemModal.style.display = "none";
        localStorage.removeItem("timeLogger.Charge_" + id);
        RefreshChargeNumberUI();
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
    grouped.forEach(chargeId => {
        let chargeDuration = ConvertDateTicks(chargeId.map(function(entry) { return entry.endTime - entry.startTime; }).reduce((a, b) => a + b, 0), true);
        let charge = ChargeNumberById(chargeId[0].chargeNumber);
        let chargeNumberString = charge === null ? "None" : charge.value;
        document.getElementById("chargeTotalsRows").innerHTML += '<tr>' +
          '<td>' + chargeNumberString +'</td>' +
          '<td>' + chargeDuration.hour + ":" + chargeDuration.minute + ":" + chargeDuration.second +'</td>' +
          '<td>' + (parseInt(chargeDuration.hour) + parseInt(chargeDuration.minute)/60).toFixed(1) + '</td>' +
          '<td>' + 
            '<button id="copy_' + charge?.id + '" onclick="CopyDescriptionToClipboard(' + charge?.id + ')" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-sm">' +
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
        let duration = ConvertDateTicks(entry.endTime - entry.startTime, true);
        let startTime = ConvertDateTicks(entry.startTime, false);
        let endTime = ConvertDateTicks(entry.endTime, false);
        let charge = ChargeNumberById(entry.chargeNumber);
        let chargeNumberString = charge === null ? "None" : charge.value;
        document.getElementById("entryListRows").innerHTML += '<tr>' +
          '<td>' + entry.description +'</td>' +  
          '<td>' + chargeNumberString +'</td>' +
          '<td>' + duration.hour + ":" + duration.minute + ":" + duration.second +'</td>' +
          '<td>' + TwelveHourTime(startTime.hour, startTime.minute, startTime.second, false) + '</td>' +
          '<td>' + TwelveHourTime(endTime.hour, endTime.minute, endTime.second, false) + '</td>' + 
          '<td><button onclick="ShowEntryModal(true, ' + entry.id + ')" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-sm">Edit</button></td>' +
          '<td><button onclick="ShowDeleteEntryModal(' + entry.id + ')" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-sm">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">' +
                '<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>' +
            '</svg></button></td>' +
        '</tr>';
    });
}

function RefreshHistoryUI(group) {
    var entries = GetEntries();
    var grouped;
    //groups entries based on group by filter
    switch (group) {
        case "day":
            grouped = groupBy(entries, function(entry) {
                return new Date(entry.startTime).setHours(0,0,0,0);
            });
        break;
        case "week":
            grouped = groupBy(entries, function(entry) {
                let start = new Date(entry.startTime);
                return new Date(start.setHours(0,0,0,0)).setDate(start.getDate() - start.getDay());
            });
        break;
        case "month":
            grouped = groupBy(entries, function(entry) {
                return new Date(new Date(entry.startTime).setHours(0,0,0,0)).setDate(1);
            });
        break;
        default:
            grouped = groupBy(entries, function(entry) {
                let start = new Date(entry.startTime);
                return new Date(start.setHours(0,0,0,0)).setDate(start.getDate() - start.getDay());
            });
        break;     
    }

    //sorts groups in most recent to oldest order
    grouped = new Map([...grouped.entries()].sort());

    //creates dropdown for each group
    var cards = "";
    grouped.forEach(group => 
        cards += '<div class="card">' +
        '<div class="card-header" style="background-color: #222529; ">' +
        '  <h2 class="mb-0">' +
        '    <button class="btn collapsed" style="background-color:#222529; width: 100%; text-align: left; color: whitesmoke;" type="button" data-toggle="collapse" data-target="#collapsible' + group[0].id + '" aria-expanded="false" aria-controls="collapseTwo">' +
                HistoryCollapsibleTitle(group[0].startTime) +
        '    </button>' +
        '  </h2>' +
        '</div>' +
        '<div id="collapsible' + group[0].id + '" class="collapse" aria-labelledby="headingTwo" data-parent="#historyAccordion">' +
        '  <div class="card-body">' +
        '    <div class="row justify-content-md-center">' +
        '      <table class="table table-hover table-striped caption-top" style="width: 85%;">' +
        '        <caption class="display-6 text-center" style="color: #222529; font-size: large;">Charge Numbers</caption>' +
        '        <style>' +
        '          td{border: none};' +
        '          th{border-bottom-width: thick; border-bottom-color: #222529;}' +
        '        </style>' +
        '        <thead>' +
        '          <tr style="border-width: thick; border-color: #222529; border-style: double; border-right-style: solid; border-left-style: solid; border-left-width: thin; border-right-width: thin;">' +
        '            <script type="text/javascript">' +
        '              if (document.getElementById())' +
        '            </script>' +
        '            <th scope="col">Charge Number</th>' +
        '            <th scope="col">Description</th>' +
        '            <th scope="col"></th>' +
        '            <th scope="col"></th>' +
        '          </tr>' +
        '        </thead>' +
        '        <tbody id="chargeListRows"></tbody>' +
        '      </table>' +
        '    </div>' +
        '  </div>' +
        '</div>' +
    '</div>');
    document.getElementById("historyAccordion").innerHTML = cards;
}

function RefreshChargeNumberUI() {
    var chargeNumbers = GetChargeNumbers();
    //populates charge number table
    document.getElementById("chargeListRows").innerHTML = null; //resets
    chargeNumbers.forEach(charge => {
        document.getElementById("chargeListRows").innerHTML += '<tr>' +
          '<td>' + charge.value +'</td>' +  
          '<td>' + charge.description +'</td>' +
          '<td><button onclick="ShowChargeModal(true, ' + charge.id + ')" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-sm">Edit</button></td>' +
          '<td><button onclick="ShowDeleteChargeModal(' + charge.id + ')" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-sm">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">' +
                '<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>' +
            '</svg></button></td>' +
        '</tr>';
    });
}

function HistoryCollapsibleTitle(time) {
    var title;
    switch (document.getElementById("groupBySelection").value) {
        case "day":
            title = new Date(time).toLocaleString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
            break;
        case "week":
            let date = new Date(time);
            title = "Week of " + new Date(date.setDate(date.getDate() - date.getDay() + 1)).toLocaleString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
            break;
        case "month":
            title = new Date(time).toLocaleString("en-US", { month: 'long', year: 'numeric'});
            break;
        case "year":
            title = Date(time).toLocaleString("en-US", { year: 'numeric' });
            break; 
    }
    return title;
}

function LoadChargeNumbersToModal() {
    var chargeNumbers = GetChargeNumbers();
    //populates charge number modal select dropdown
    var dropdown = document.getElementById("chargeNumber");
    dropdown.innerHTML = null; //resets
    dropdown.innerHTML += '<option selected>Charge Number</option>';
    chargeNumbers.forEach(charge => {
        dropdown.innerHTML += '<option value="' + charge.id + '">' + charge.value + '</option>';
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

function GetChargeNumbers() {
    var chargeNumbers = [],
        keys = Object.keys(localStorage).filter(function(key){ return key.includes("timeLogger.Charge"); }),
        i = keys.length;

    while ( i-- ) {
        chargeNumbers.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return chargeNumbers;
}

function GetEntries() {
    var entries = [],
        keys = Object.keys(localStorage).filter(function(key){ return key.includes("timeLogger.Entry"); }),
        i = keys.length;

    while ( i-- ) {
        entries.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return entries;
}

function TodaysEntries() {
    var entries = GetEntries();
    var filtered = entries.filter(function(entry) {
        return entry.startTime >= new Date().setHours(0,0,0,0);
    });
    return filtered.sort((a, b) => (a.startTime > b.startTime) ? -1 : 1);
}

function EntryById(id) {
    return JSON.parse(localStorage.getItem("timeLogger.Entry_" + id));
}

function ChargeNumberById(chargeId) {
    return JSON.parse(localStorage.getItem("timeLogger.Charge_" + chargeId));
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

function TimeSpan(str) {
    var from = str.split("-")[0];
    var to = str.split("-")[1];
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