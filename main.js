async function getTabs() {
  return new Promise((resolve) => {
    let queryOptions = {
      currentWindow: true
    }
  
    chrome.tabs.query(queryOptions, (tabs) => {
      resolve(tabs);
    });
  })
}

getTabs().then((tabs) => {
  tabs.forEach((tab) => {
    chrome.cookies.getAll({url: tab.url}, (cookies) => {
      console.log(cookies);
    });
  })
})