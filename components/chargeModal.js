function chargeModal() {
    document.write('<div class="modal-content">' +
    '<div class="modal-header">' +
    '  <h2 id="chargeModalHeader">New Charge Number</h2>' +
    '</div>' +
    '<br>' +
    '<div class="modal-body">' +
    '  <div class="form-floating">' +
    '    <input class="form-control" placeholder="null" id="floatingChargeValue"></input>' +
    '    <label for="floatingChargeValue">Charge Number</label>' +
    '  </div>' +
    '  <br>' +
    '  <div class="form-floating">' +
    '    <input class="form-control" placeholder="null" id="floatingChargeDescription"></input>' +
    '    <label for="floatingChargeDescription">Description</label>' +
    '  </div>' +
    '  <br>' +
    '</div>' +
    '<div class="modal-footer">' +
    '  <submit id="discardChargeButton" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-md">Cancel</submit>' +
    '  <submit id="saveChargeButton" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-md">Save</submit>' +
    '</div>' +
  '</div>');
}