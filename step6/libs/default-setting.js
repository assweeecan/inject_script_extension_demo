(function () {
  const option = {
    storageKey: "settings",
    storageSourceKey: "source"
  };

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports.default = option;
  } else {
    window["defaultSetting"] = option;
  }
})();