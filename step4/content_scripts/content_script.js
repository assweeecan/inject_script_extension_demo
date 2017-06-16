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

co(function *() {
  // 加载脚本
  yield scriptLoader({ src: '//cdn.bootcss.com/jquery/3.2.1/jquery.js' });
  yield scriptLoader({ src: '//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js' });

  // 检查jquery和jquery.cookie是否顺利注入。注意检查代码也要注入到页面环境
  scriptLoader({
    innerHTML: `
      console.assert(window.jQuery, 'jQuery is not defined');
      console.log(window.jQuery);
      console.assert(window.jQuery.cookie, 'jQuery.cookie is not defined');
      console.log(window.jQuery.cookie);
    `,
  });
});