function getTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

function getWebsiteName(url) {
  var http = url.split("/")[0];
  var parsedUrl = new URL(url);
  var websiteName = http + parsedUrl.hostname;
  return websiteName;
}

const getCookies = (tabs) => {
  let tab = tabs.pop();
  var websiteName = getWebsiteName(tab.url);
  var cookies = browser.cookies.getAll({url: tab.url});

  cookies.then((cookies) => {

    var cookiesDiv = document.getElementById("cookies-div");
    var cookiesHeader = document.getElementById("header-title-cookies");
    var cookieList = document.getElementById('cookie-list');

    var cookiesNum = document.getElementById('number-cookies');
    var cookiesNumP = document.createElement("p");
    var cookiesNumText = document.createTextNode("Number of cookies: " + cookies.length);
    cookiesNumP.appendChild(cookiesNumText);
    cookiesNum.appendChild(cookiesNumP);

    var cookiesText = document.createTextNode("Cookies from " + websiteName);
    cookiesHeader.appendChild(cookiesText);

    if (cookies.length > 0) {
      for (let item of cookies) {
        var li = document.createElement("li");
        var liText = document.createTextNode(item.name + ": " + item.value);
        li.appendChild(liText);
        cookieList.appendChild(li);
      }
    } else {
      let noCookiesP = document.createElement("p");
      let noCookiesText = document.createTextNode(websiteName + " doesn't use cookies.");
      noCookiesP.appendChild(noCookiesText);
      cookiesDiv.innerHTML = "";
      cookiesDiv.appendChild(noCookiesP);
    }

    if (cookies.length > 0) {
      var secStatus = document.getElementById('cookies-security-status');
      var cookiesProgress = document.getElementById('cookies-status');
      
      if (cookies.length >= 200){
        cookiesProgress.setAttribute("value", "100");
        secStatus.style.color = "#F4364C";
      } else if(cookies.length > 100 && cookies.length < 200){
        cookiesProgress.setAttribute("value", cookies.length.toString());
        secStatus.style.color = "#FDB44E";
      } else {
        cookiesProgress.setAttribute("value", cookies.length.toString());
        secStatus.style.color = "#00FF00";
      }
    }
  });
}

const getLocalStorage = async (tabs) => {
  let tab = tabs.pop();
  var websiteName = getWebsiteName(tab.url);

  var localDiv = document.getElementById("local-div");
  var localHeader = document.getElementById("header-title-local-storage");
  var localList = document.getElementById('local-storage-list');

  var localSize = document.getElementById('size-local-storage');
  var localSizeP = document.createElement("p");

  const local = await browser.tabs.sendMessage(tab.id, {method: "localStorage"});

  var localSizeText = document.createTextNode("Number of items in Local Storage: " + local.data.length);
  localSizeP.appendChild(localSizeText);
  localSize.appendChild(localSizeP);

  var localText = document.createTextNode("Local Storage from " + websiteName);
  localHeader.appendChild(localText);

  if (local.data.length > 0) {
    for (item of local.data) {
      var li = document.createElement("li");
      var content = document.createTextNode(item[0] + ": " + item[1]);
      li.appendChild(content);
      localList.appendChild(li);
    }

    var localStatus = document.getElementById('local-storage-security-status');
    var localProgress = document.getElementById('local-storage-status');

    if(local.data.length > 20){
      localStatus.style.color = "#F4364C";
      localProgress.setAttribute("value", "20");
    } else if (local.data.length > 10 && local.data.length < 20){
      localStatus.style.color = "#FDB44E";
      localProgress.setAttribute("value", local.data.length.toString());
    } else {
      localStatus.style.color = "#00FF00"
      localProgress.setAttribute("value", local.data.length.toString());
    }
  } else {
    let noLocalP = document.createElement("p");
    let noLocalText = document.createTextNode(websiteName + " doesn't use Local Storage.");
    noLocalP.appendChild(noLocalText);
    localDiv.innerHTML = "";
    localDiv.appendChild(noLocalP);
  }
}

const getSessionStorage = async (tabs) => {
  let tab = tabs.pop();
  var websiteName = getWebsiteName(tab.url);

  var sessionDiv = document.getElementById("session-div");
  var sessionHeader = document.getElementById("header-title-session-storage");
  var sessionList = document.getElementById('session-storage-list');

  var sessionSize = document.getElementById('size-session-storage');
  var sessionSizeP = document.createElement("p");

  const session = await browser.tabs.sendMessage(tab.id, {method: "sessionStorage"});

  var sessionSizeText = document.createTextNode("Number of items in Session Storage: " + session.data.length);
  sessionSizeP.appendChild(sessionSizeText);
  sessionSize.appendChild(sessionSizeP);

  var sessionText = document.createTextNode("Session Storage from " + websiteName);
  sessionHeader.appendChild(sessionText);

  if (session.data.length > 0) {
    for (let item of session.data) {
      if (item) {
        var li = document.createElement("li");
        var content = document.createTextNode(item[0] + ": " + item[1]);
        li.appendChild(content);
        sessionList.appendChild(li);
      }
    }

    var sessionStatus = document.getElementById('session-storage-security-status');
    var sessionProgress = document.getElementById('session-storage-status');

    if(session.data.length > 20){
      sessionStatus.style.color = "#F4364C";
      sessionProgress.setAttribute("value", "20");
    } else if (session.data.length > 10 && session.data.length < 20){
      sessionStatus.style.color = "#FDB44E";
      sessionProgress.setAttribute("value", session.data.length.toString());
    } else {
      sessionStatus.style.color = "#00FF00"
      sessionProgress.setAttribute("value", session.data.length.toString());
    }
  } else {
    let noSessionP = document.createElement("p");
    let noSessionText = document.createTextNode(websiteName + " doesn't use Session Storage.");
    noSessionP.appendChild(noSessionText);
    sessionDiv.innerHTML = "";
    sessionDiv.appendChild(noSessionP);
  }
}

const getThirdParty = async (tabs) => {
  let tab = tabs.pop();
  var websiteName = getWebsiteName(tab.url);

  var tpDiv = document.getElementById("third-party-div");
  var tpList = document.getElementById('third-party-list');

  var tpSize = document.getElementById('size-third-party');
  var tpSizeP = document.createElement("p");

  const tp = await browser.tabs.sendMessage(tab.id, {method: "thirdParty"});

  var tpSizeText = document.createTextNode("Number of external links: " + tp.data.numberOfLinks);
  tpSizeP.appendChild(tpSizeText);
  tpSize.appendChild(tpSizeP);

  if (tp.data.links.length > 0) {
    tp.data.links.map((link) => {
      var li = document.createElement('li');
      li.innerText = link;
      tpList.appendChild(li);
    });
  } else {
    let noLinksP = document.createElement("p");
    let noLinksText = document.createTextNode(websiteName + " has no external links.");
    noLinksP.appendChild(noLinksText);
    tpDiv.innerHTML = "";
    tpDiv.appendChild(noLinksP);
  }
}

getTab().then(getCookies);
getTab().then(getLocalStorage);
getTab().then(getSessionStorage);
getTab().then(getThirdParty);