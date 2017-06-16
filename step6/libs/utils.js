(function () {
  let exports = {};

  exports.sleep = function (millisec) {
    return new Promise(function (resove, reject) {
      setTimeout(function () {
        resove();
      }, millisec);
    });
  }

  exports.loadScript = function (element) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      element.async && (script.async = element.async);
      element.type && (script.type = element.type);
      element.charset && (script.charset = element.charset);
      element.defer && (script.defer = element.defer);
      if (!!element.src) {
        script.src = element.src;
      } else {
        script.innerHTML = element.innerHTML;
      }
      var elementAsync = element.getAttribute("async");
      elementAsync = elementAsync == true || elementAsync == null ? true : false;
      if (!!element.src && elementAsync) {
        script.onerror = script.onload = function () {
          resolve();
        }
      }

      document.head.appendChild(script);

      if (!element.src || !elementAsync) {
        resolve();
      }
    });
  }

  exports.consoleH = {
    log: function (info, element) {
      var text = info;
      console.log(info);
      if (typeof info === "function") {
        text = info.toString();
      } else if (typeof info === "object") {
        text = JSON.stringify(info, 0, 2);
      }

      if (element) {
        element.innerHTML = element.innerHTML + "\n\n" + text;
      }
    },
  }

  exports.splitByLength = function (str, length) {
    var result = [];
    if (!str) {
      return result;
    }
    length = length >= 1 ? length : 1;
    var tmpStr = str;
    while (tmpStr.length > 0) {
      result.push(tmpStr.slice(0, length));
      tmpStr = tmpStr.slice(length);
    }
    return result;
  };

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = exports;
  } else {
    Object.keys(exports).forEach(function (e) {
      window[e] = exports[e];
    });
  }
})();
