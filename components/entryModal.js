function entryModal() {
    document.write('<div class="modal-content">' +
    '<div class="modal-header">' +
    '  <h2>Save Entry</h2>' +
    '</div>' +
    '<br>' +
    '<div class="modal-body">' +
    '  <div class="row justify-content-lg-evenly">' +
    '    <div class="row justify-content-lg-center" style="width: 50%;">' +
    '      <label for="startTimePicker" style="width: 40%; margin-right: 0px;">Start Time</label>' +
    '      <input id="startTimePicker" type="datetime-local" style="width: 60%;"></input>' +
    '    </div>' +
    '    <div class="row justify-content-lg-center" style="width: 50%;">' +
    '      <label for="stopTimePicker" change="UpdateModalDuration()" style="width: 40%; margin-right: 0px;">End Time</label>' +
    '      <input id="stopTimePicker" change="UpdateModalDuration()" type="datetime-local" style="width: 60%;"></input>' +
    '    </div>' +
    '  </div>' +
    '  <br>' +
    '  <div class="text-center">' +
    '    <h1 class="display-6" style="color: #222529; font-size: large; font-weight: bolder;">' +
    '      Duration ' +
    '      <span id="durationModal" class="display-6" style="color: #222529; font-size: large;"></span>' +
    '    </h1>' +
    '  </div>' +
    '  <br>' +
    '  <div class="form-floating">' +
    '    <textarea class="form-control" placeholder="null" style="height: 100px;" id="floatingDescription"></textarea>' +
    '    <label for="floatingDescription">Description</label>' +
    '  </div>' +
    '  <br>' +
    '  <select id="chargeNumber" class="form-select" aria-label="Charge Number">' +
    '    <option selected>Charge Number</option>' +
    '    <option value="1">One</option>' +
    '    <option value="2">Two</option>' +
    '    <option value="3">Three</option>' +
    '  </select>' +
    '  <br>' +
    '</div>' +
    '<div class="modal-footer">' +
    '  <submit id="discardEntryButton" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-md">Discard</submit>' +
    '  <submit id="saveEntryButton" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-md">Save</submit>' +
    '</div>' +
  '</div>');
}