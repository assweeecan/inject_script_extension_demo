const global = window;

const chromep = new ChromePromise();
const { storageKey, storageSourceKey } = defaultSetting;

let theModal = '';
let theRunScript = '';

global.initScript = function () {
  co(function *() {
    let valueArray;
    valueArray = yield chromep.storage.local.get([storageKey, storageSourceKey]);
    let source = valueArray[storageSourceKey];

    if (valueArray[storageKey]) {
      theModal = valueArray[storageKey].mode;

      if (theModal && theModal != 'close') {
        const container = document.createElement('div');
        container.innerHTML = source;
        const scriptDomList = container.querySelectorAll('script');
        scriptDomList.forEach(function (script) {
          container.removeChild(script);
        });

        const scriptPromiseList = Array.from(scriptDomList).map(script => {
          if (script.src) {
            let theSrc = script.src;
            if (theSrc.slice(0, 7) !== 'http://' && theSrc.slice(0, 8) !== 'https://') {
              theSrc = script.src.replace(/^.*?:\/\//, 'http://');
            }
            return fetch(theSrc).then(v => v.text()).catch(err => `;(function(){console.error('GET ${theSrc}');})();`);
          } else {
            return Promise.resolve(script.innerText);
          }
        });

        const scriptTextList = yield Promise.all(scriptPromiseList);
        theRunScript = scriptTextList.join('\n;\n');
        theRunScript = JSON.stringify(theRunScript);
      }
    }
  });
}

global.initScript();


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (theModal && theModal !== 'close') {
    if (changeInfo.status === 'loading') {
      if (tab.url.slice(0, 7) === 'http://' || tab.url.slice(0, 8) === 'https://') {
        chrome.tabs.executeScript(tabId, {
          code: `;(${function (s) {
            const theScript = document.createElement('script');
            theScript.innerHTML = s;
            document.documentElement.appendChild(theScript);
          }.toString()})(${theRunScript});`,
          allFrames: true,
          runAt: theModal,
        });
      }
    }
  }
});