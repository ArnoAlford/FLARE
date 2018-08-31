// declare global vars
var xhttp,
  xhttp2,
  xhttp3,
  active_sitn_id,
  docs_url = '',
  top_expand = true,
  left_expand = true,
  right_expand = true,
  left_partial_expand = true,
  right_partial_expand = true,
  ext_ver = '1.0.6',
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s;

// page load function calls
getVersion();

// alert the user if they're using flare/
if (document.location.host == "flare") {
  alert("Hey! Looks like you're using http://flare/. Using just the hostname instead of the FQDN can be buggy, so if you have any issues with the site, try going to http://flare.example.com. Thanks!")
}

// set local storage variables and dropbox selected items for modularity
if (window.sessionStorage.getItem("topframe") == null) {
  window.sessionStorage.setItem("topframe", "https://alerts.example.com")
} else {
  $('#top-select')[0].value = window.sessionStorage.getItem("topframe");
}
$('#top-frame')[0].innerHTML = `<a id="top-expand-button" href="#" onclick="expandTop()"><i id="top-expand-icon" class="material-icons">fullscreen</i></a><iframe src="${$('#top-select')[0].value}" width="100%" height="100%"></iframe>`;

if (window.sessionStorage.getItem("leftframe") == null) {
  window.sessionStorage.setItem("leftframe", "https://tickets.example.com/")
} else {
  $('#left-select')[0].value = window.sessionStorage.getItem("leftframe");
}
$('#lower-left')[0].innerHTML = `<a id="left-expand-button" href="#" onclick="expandLeft()"><i id="left-expand-icon" class="material-icons">fullscreen</i></a><a id="left-partial-expand-button" href="#" onclick="expandPartialLeft()"><i id="left-partial-expand-icon" class="material-icons">chevron_right</i></a><iframe src="${$('#left-select')[0].value}" width="100%" height="100%"></iframe>`;

if (window.sessionStorage.getItem("rightframe") == null) {
  window.sessionStorage.setItem("rightframe", "https://chat.example.com/")
} else {
  $('#right-select')[0].value = window.sessionStorage.getItem("rightframe");
}
$('#lower-right')[0].innerHTML = `<a id="right-expand-button" href="#" onclick="expandRight()"><i id="right-expand-icon" class="material-icons">fullscreen</i></a><a id="right-partial-expand-button" href="#" onclick="expandPartialRight()"><i id="right-partial-expand-icon" class="material-icons">chevron_left</i></a><iframe src="${$('#right-select')[0].value}" width="100%" height="100%"></iframe>`;

if ($('#top-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html" || $('#left-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html" || $('#right-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html") {
  var sshxhttp = new XMLHttpRequest();
  sshxhttp.open("GET", "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html", "false");
  sshxhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status != 200) {
      $('#sshModal').modal('show');
    }
  }
  sshxhttp.send();
}

// generate alerts auth token if it is out of date or does not exist
if ((Date.now() - window.localStorage.getItem("alertsAuthTokenTime")) > 3600000) {
  getAlertsAuthToken();
  console.log("generated new auth token");
}

// add key listener for situation ID lookup submit
document.getElementById("sitn_box").addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    opsmodal($('#sitn_box')[0].value);
  }
});

// add key listener for game
document.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 68) {
    dinoGame();
  }
});

// add key listener for preferences (p)
document.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 80) {
    $('#loginModal').modal('show');
  }
});

// function to show ops modal
function opsmodal(sitn_id) {
  if (sitn_id == active_sitn_id) {
    $('#opsModal').modal('show');
  } else if (sitn_id === "") {
    alert("Please enter a situation!");
  } else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var leftSide, rightSide, tickets_id_exists = true, tsg_id_exists = true;
        if (JSON.parse(xhttp.response).custom_info.tickets_id == null) {
          leftSide = '<div class="text-center"><h1>No ticket found</h1></div>'
          tickets_id_exists = false;
        } else {
          leftSide = '<iframe class="modal-iframe" src="https://tickets.example.com/browse/' + JSON.parse(xhttp.response).custom_info.tickets_id + '" width="100%" height="100%"></iframe>'
        }
        getDocsURL(JSON.parse(xhttp.responseText).custom_info.tsg_id);
        $('#opsModal').modal('show');
        $('#opsModal')[0].innerHTML = '<div class="modal-dialog modal-dialog-lg" role="document"><div class="modal-content modal-content-lg"><div class="modal-header"><h5 class="modal-title" id="opsModalLabel">Situation&nbsp;' + sitn_id + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="modal-body p-2"><div class="modal-iframe" width="100%" height="100%"><div class="container-fluid"><div class="row"><div class="col loadinggif p-2" id="oml">' + leftSide + '</div><div class="col loadinggif p-2"><iframe class="modal-iframe" src="' + docs_url['fields'].customfield_13724 + '" width="100%" height="100%">Loading...</iframe></div></div></div></div></div></div></div><br>'
        if (!tickets_id_exists) {
          $('#oml')[0].classList.remove("loadinggif");
        }
        if (!tsg_id_exists) {
          $('#omr')[0].classList.remove("loadinggif");
        }
        active_sitn_id = sitn_id;
      } else if (this.status == 401) {
        getAlertsAuthToken();
      } else if (this.status != 0) {
        alert("Situation not found");
      }
    };
    xhttp.open("GET", "https://alerts.example.com/graze/v1/getSituationDetails?auth_token=" + window.localStorage.getItem("alertsAuthToken") + "&sitn_id=" + sitn_id, false);
    xhttp.send();
  }
}

// call ticketing api to get real TSG url
function getDocsURL(tsg_id) {
  var xhttp2 = new XMLHttpRequest();
  xhttp2.open("GET", "https://tickets.example.com/rest/api/latest/issue/" + tsg_id, false);
  xhttp2.setRequestHeader('Authorization', 'Basic ');
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      docs_url = JSON.parse(xhttp2.response);
    }
  }
  xhttp2.send();
}

// Alerts API call to generate auth token
function getAlertsAuthToken() {
  var alertsauthxhttp = new XMLHttpRequest();
  alertsauthxhttp.open("GET", "https://alerts.example.com/graze/v1/authenticate", false);
  alertsauthxhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.localStorage.setItem("alertsAuthToken", JSON.parse(alertsauthxhttp.response).auth_token);
      window.localStorage.setItem("alertsAuthTokenTime", new Date());
    }
  }
  alertsauthxhttp.send();
}

// get frame preferences from login modal and display them
function updateFrames() {
  var topframe, leftframe, rightframe;
  if (window.sessionStorage.getItem("topframe") != $('#top-select')[0].value) {
    topframe = `<a id="top-expand-button" href="#" onclick="expandTop()"><i id="top-expand-icon" class="material-icons">fullscreen</i></a><iframe src="${$('#top-select')[0].value}" width="100%" height="100%"></iframe>`
    $('#top-frame')[0].innerHTML = topframe;
    window.sessionStorage.setItem("topframe", $('#top-select')[0].value);
  }
  if (window.sessionStorage.getItem("leftframe") != $('#left-select')[0].value) {
    leftframe = `<a id="left-expand-button" href="#" onclick="expandLeft()"><i id="left-expand-icon" class="material-icons">fullscreen</i></a><a id="left-partial-expand-button" href="#" onclick="expandPartialLeft()"><i id="left-partial-expand-icon" class="material-icons">chevron_right</i></a><iframe src="${$('#left-select')[0].value}" width="100%" height="100%"></iframe>`
    $('#lower-left')[0].innerHTML = leftframe;
    window.sessionStorage.setItem("leftframe", $('#left-select')[0].value);
  }
  if (window.sessionStorage.getItem("rightframe") != $('#right-select')[0].value) {
    rightframe = `<a id="right-expand-button" href="#" onclick="expandRight()"><i id="right-expand-icon" class="material-icons">fullscreen</i></a><a id="right-partial-expand-button" href="#" onclick="expandPartialRight()"><i id="right-partial-expand-icon" class="material-icons">chevron_left</i></a><iframe src="${$('#right-select')[0].value}" width="100%" height="100%"></iframe>`
    $('#lower-right')[0].innerHTML = rightframe;
    window.sessionStorage.setItem("rightframe", $('#right-select')[0].value);
  }
  expandReset();
  if ($('#top-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html" || $('#left-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html" || $('#right-select')[0].value == "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html") {
    var sshxhttp = new XMLHttpRequest();
    sshxhttp.open("GET", "chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html", "false");
    sshxhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status != 200) {
        $('#sshModal').modal('show');
      }
    }
    sshxhttp.send();
  }
}

// resets frame preferences per user's request
function resetFrames() {
  $('#top-select')[0].value = "https://alerts.example.com";
  $('#left-select')[0].value = "https://tickets.example.com/";
  $('#right-select')[0].value = "https://chat.example.com/";
}

// gets extension version (or lack thereof) and alerts the user if it's out of date or not installed
function getVersion() {
  var versionxhttp = new XMLHttpRequest();
  versionxhttp.open("GET", "chrome-extension://gikgadnojiigifcnbipajhfelkaidkhb/manifest.json", "false");
  versionxhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (JSON.parse(this.response).version != ext_ver) {
        $('#extModal').modal('show');
      }
    } else if (this.status != 200) {
      $('#extModal').modal('show');
    }
  }
  versionxhttp.send();
}

// full screen top frame
function expandTop() {
  if (top_expand) {
    $('#bottom-div')[0].classList.add('d-none');
    $('#top-div')[0].classList.remove('half');
    $('#top-div')[0].classList.add('fullheight');
    top_expand = false;
    $('#top-expand-icon')[0].innerHTML = 'fullscreen_exit';
  } else {
    $('#bottom-div')[0].classList.remove('d-none');
    $('#top-div')[0].classList.add('half');
    $('#top-div')[0].classList.remove('fullheight');
    top_expand = true;
    $('#top-expand-icon')[0].innerHTML = 'fullscreen';
  }
}

// full screen left frame
function expandLeft() {
  if (left_expand) {
    $('#top-div')[0].classList.add('d-none');
    $('#lower-right')[0].classList.add('d-none');
    $('#bottom-div')[0].classList.add('fullheight');
    left_expand = false;
    $('#left-expand-icon')[0].innerHTML = 'fullscreen_exit';
  } else {
    $('#top-div')[0].classList.remove('d-none');
    $('#lower-right')[0].classList.remove('d-none');
    $('#bottom-div')[0].classList.remove('fullheight');
    left_expand = true;
    $('#left-expand-icon')[0].innerHTML = 'fullscreen';
  }
}

// full screen right frame
function expandRight() {
  if (right_expand) {
    $('#top-div')[0].classList.add('d-none');
    $('#lower-left')[0].classList.add('d-none');
    $('#bottom-div')[0].classList.add('fullheight');
    right_expand = false;
    $('#right-expand-icon')[0].innerHTML = 'fullscreen_exit';
  } else {
    $('#top-div')[0].classList.remove('d-none');
    $('#lower-left')[0].classList.remove('d-none');
    $('#bottom-div')[0].classList.remove('fullheight');
    right_expand = true;
    $('#right-expand-icon')[0].innerHTML = 'fullscreen';
  }
}

// full screen right frame
function expandPartialLeft() {
  if (left_partial_expand) {
    $('#lower-right')[0].classList.add('d-none');
    left_partial_expand = false;
    $('#left-partial-expand-icon')[0].innerHTML = 'chevron_left';
  } else {
    $('#lower-right')[0].classList.remove('d-none');
    left_partial_expand = true;
    $('#left-partial-expand-icon')[0].innerHTML = 'chevron_right';
  }
}

// full screen right frame
function expandPartialRight() {
  if (right_partial_expand) {
    $('#lower-left')[0].classList.add('d-none');
    right_partial_expand = false;
    $('#right-partial-expand-icon')[0].innerHTML = 'chevron_right';
  } else {
    $('#lower-left')[0].classList.remove('d-none');
    right_partial_expand = true;
    $('#right-partial-expand-icon')[0].innerHTML = 'chevron_left';
  }
}

// return all frames to normal size
function expandReset() {
  top_expand = left_expand = right_expand = false;
  $('#bottom-div')[0].classList.remove('d-none');
  $('#top-div')[0].classList.add('half');
  $('#top-div')[0].classList.remove('fullheight');
  top_expand = true;
  $('#top-expand-icon')[0].innerHTML = 'fullscreen';
  $('#top-div')[0].classList.remove('d-none');
  $('#lower-right')[0].classList.remove('d-none');
  $('#bottom-div')[0].classList.remove('fullheight');
  left_expand = true;
  $('#left-expand-icon')[0].innerHTML = 'fullscreen';
  $('#top-div')[0].classList.remove('d-none');
  $('#lower-left')[0].classList.remove('d-none');
  $('#bottom-div')[0].classList.remove('fullheight');
  right_expand = true;
  $('#right-expand-icon')[0].innerHTML = 'fullscreen';
}

// functions to load modal contents when modal is opened
function show_a() {
  if (!a) {
    $('#a')[0].src = 'http://dashboard.example.com';
    a = true;
  }
}

function show_b() {
  if (!b) {
    $('#b')[0].src = 'http://dashboard.example.com';
    b = true;
  }
}

function show_c() {
  if (!c) {
    $('#c')[0].src = 'http://dashboard.example.com';
    c = true;
  }
}

function show_d() {
  if (!d) {
    $('#d')[0].src = 'https://guardian.example.com';
    d = true;
  }
}

function show_e() {
  if (!e) {
    $('#e')[0].src = 'http://dashboard.example.com';
    e = true;
  }
}

function show_f() {
  if (!f) {
    $('#f')[0].src = 'http://dashboard.example.com';
    f = true;
  }
}

function show_g() {
  if (!g) {
    $('#g')[0].src = 'https://graphs.example.com';
    g = true;
  }
}

function show_h() {
  if (!h) {
    $('#h')[0].src = 'https://graphs2.example.com';
    h = true;
  }
}

function show_i() {
  if (!i) {
    $('#i')[0].src = 'http://dashboard.example.com';
    i = true;
  }
}

function show_j() {
  if (!j) {
    $('#j')[0].src = 'https://logs/en-US/app?earliest=-4h%40m&latest=now&form.env=prod';
    j = true;
  }
}

function show_k() {
  if (!k) {
    $('#k')[0].src = 'https://logs/en-US';
    k = true;
  }
}

function show_l() {
  if (!l) {
    $('#l')[0].src = 'https://graphs2.example.com/app/graphs2#/dashboard/';
    l = true;
  }
}

function show_m() {
  if (!m) {
    $('#m')[0].src = 'https://graphs2.example.com/app/graphs2#/dashboard/';
    m = true;
  }
}

function show_n() {
  if (!n) {
    $('#n')[0].src = 'https://logs/en-US/app/pgs?earliest=-24h%40h&latest=now&form.varEnv=prod&form.varAxis=mop&form.varAxis2=null&form.varFilter=*';
    n = true;
  }
}

function show_o() {
  if (!o) {
    $('#o')[0].src = 'https://map/';
    o = true;
  }
}

function show_p() {
  if (!p) {
    $('#p')[0].src = 'https://graphs.example.com/';
    p = true;
  }
}

function show_q() {
  if (!q) {
    $('#q')[0].src = 'https://cmdb/';
    q = true;
  }
}

function show_r() {
  if (!r) {
    $('#r')[0].src = 'http://changeboard/v2#/changes?columns=3';
    r = true;
  }
}

function show_s() {
  if (!s) {
    $('#s')[0].src = 'https://docs.example.com/display/OPS/FLARE';
    s = true;
  }
}

function dinoGame() {
  $('#emptyModal').modal('show');
  setTimeout(function () { $('#dino')[0].src = "http://flare.example.com/static/dino_light/index.html" }, 1000);
}
