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

getTab().then((tabs) => {
  let tab = tabs.pop();
  var websiteName = getWebsiteName(tab.url);
  var cookies = browser.cookies.getAll({url: tab.url});
  var session = browser.tabs.sendMessage(tab.id, {method: "sessionStorageData"});

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
      }
    }
  });
});