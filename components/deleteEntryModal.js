function deleteEntryModal() {
    document.write('<div class="modal-content">' +
        '<div class="modal-header">' +
        '  <h2>Delete Entry</h2>' +
        '</div>' +
        '<br>' +
        '<div class="modal-body">' +
        '  <div class="text-center">' +
        '    <h1 class="display-6" style="color: #222529; font-size: large; font-weight: bolder;">' +
        '      Description ' +
        '      <span id="deleteDescription" class="display-6" style="color: #222529; font-size: large;"></span>' +
        '    </h1>' +
        '    <h1 class="display-6" style="color: #222529; font-size: large; font-weight: bolder;">' +
        '      Duration ' +
        '      <span id="deleteDuration" class="display-6" style="color: #222529; font-size: large;"></span>' +
        '    </h1>' +
        '    <h1 class="display-6" style="color: #222529; font-size: large; font-weight: bolder;">' +
        '      Charge Number ' +
        '      <span id="deleteCharge" class="display-6" style="color: #222529; font-size: large;"></span>' +
        '    </h1>' +
        '  </div>' +
        '  <br>' +
        '  <br>' +
        '  <h1 class="display-6 text-center" style="color: #222529; font-size: large;">Are you sure you want to delete this entry?</h1>' +
        '  <br>' +
        '</div>' +
        '<div class="modal-footer">' +
        '  <submit id="cancelDeleteEntryButton" style="background-color:#bc6ff1;" type="button" class="btn btn-dark btn-md">Cancel</submit>' +
        '  <submit id="deleteEntryButton" style="background-color:#892cdc;" type="button" class="btn btn-dark btn-md">Delete</submit>' +
        '</div>' +
    '</div>');
}