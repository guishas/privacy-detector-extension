const getExternalLinks = () => {
  var ExternalLinks = Array.prototype.map.call(
    document.querySelectorAll(
      "link, img, video, audio, script, iframe, source, embed"
    ),
    (HTMLtag) => { 
      return HTMLtag.href || HTMLtag.src; 
    }
  )

  const data = {
    links: ExternalLinks,
    numberOfLinks: ExternalLinks.length
  }
  
  return data;
} 

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method == "sessionStorage") {
    sendResponse({ 
      data: Object.entries(sessionStorage) 
    });
  } else if (request.method == "localStorage") {
    sendResponse({ 
      data: Object.entries(localStorage) 
    });
  } else if (request.method == "thirdParty") {
    sendResponse({ 
      data: getExternalLinks() 
    });
  } else{
    sendResponse({ 
      data: null 
    });
  }
});