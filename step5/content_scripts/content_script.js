const scriptLoader = ({ src, innerHTML }) => {
  if (src) {
    return new Promise((resolve, reject) => {
      const theScript = document.createElement('script');
      theScript.src = src;
      theScript.onload = () => {
        resolve(theScript);
      };
      theScript.onerror = () => {
        reject(`load ${src} failed`);
      };
      document.querySelector('*').appendChild(theScript);
    });
  }
  const theScript = document.createElement('script');
  theScript.innerHTML = innerHTML;
  document.body.appendChild(theScript);
  return theScript;
}

const storageGet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(items, resolve);
  });
};

const storageSet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, resolve);
  });
};

const sleep = (sec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec);
  });
}

co(function *() {
  // 由于一开始并没有代码在storage里，为了演示需要就直接写入一段代码
  yield storageSet({
    code: `
      console.log('write some code into storage...');
      Date = null;
    `,
  });
  // 模拟读写耗时，方便展示异步读写带来的影响
  yield sleep(1000);
  const theCode = (yield storageGet('code')).code;
  scriptLoader({
    innerHTML: theCode,
  });
});