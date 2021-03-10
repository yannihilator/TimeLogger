function nav(tab) {
    var today, history, chargeNumbers;
    switch (tab.toLowerCase()) {
        case "today": 
            today = 'class="nav-link active" aria-current="page" href="index.html"';
            history = 'class="nav-link" href="views/history.html"';
            chargeNumbers = 'class="nav-link" href="views/chargeNumbers.html"';
            break;
        case "history":
            today = 'class="nav-link" href="../index.html"';
            history = 'class="nav-link active" aria-current="page" href="history.html"';
            chargeNumbers = 'class="nav-link" href="chargeNumbers.html"';
            break;
        case "chargenumbers":
            today = 'class="nav-link" href="../index.html"';
            history = 'class="nav-link" href="history.html"';
            chargeNumbers = 'class="nav-link active" aria-current="page" href="chargeNumbers.html"';
            break;
        default:
            today = 'class="nav-link active" aria-current="page" href="index.html"';
            history = 'class="nav-link" href="views/history.html"';
            chargeNumbers = 'class="nav-link" href="views/chargeNumbers.html"';
            break;
    }
    document.write('<nav class="navbar navbar-expand-lg navbar-dark bg-dark">' +
    '<div class="container-fluid">' +
    '    &nbsp;' +
    '    &nbsp;' +
    '    <a class="navbar-brand" style="font-weight: bold; font-size: larger;" href="#">' +
    '    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">' +
    '        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/> ' +
    '        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>' +
    '        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>' +
    '    </svg>' +  
    '    &nbsp;' +
    '   Time Logger' +
    '    </a>' +
    '    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">' +
    '    <span class="navbar-toggler-icon"></span>' +     
    '    </button>' +
    '    <div class="collapse navbar-collapse" id="navbarScroll">' +
    '    <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">' +
    '        <li class="nav-item">' +
    '        <a ' + today +'>Today</a>' +
    '        </li>' +
    '        <li class="nav-item">' +
    '        <a ' + history +'>History</a>' +
    '        </li>' +
    '        <li class="nav-item">' +
    '        <a ' + chargeNumbers +'>Charge Numbers</a>' +
    '        </li>' +
    '    </ul>' +
    '    </div>' +
    '</div>' +
'</nav>'
);
}