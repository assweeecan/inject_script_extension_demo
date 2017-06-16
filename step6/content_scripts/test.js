const scriptCreator = ({ src, innerHTML }) => {
  const theScript = document.createElement('script');
  if (src) {
    theScript.src = src;
  } else {
    theScript.innerHTML = innerHTML;
  }
  return theScript;
};

const theScripts = [
  scriptCreator({ src: '//cdn.bootcss.com/jquery/3.2.1/jquery.js' }),
  scriptCreator({ innerHTML: `console.log($);` }),
  scriptCreator({ src: '//cdn.bootcss.com/moment.js/2.18.1/moment.js' }),
  scriptCreator({ innerHTML: `console.log(moment);` }),
];

const theHtml = document.querySelector('*');
theScripts.forEach((theScript) => {
  theHtml.appendChild(theScript);
});