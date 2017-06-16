co(function*() {
  const chromep = new ChromePromise();
  const { storageKey, storageSourceKey } = defaultSetting;
  const fileReader = FileReaderPromise();

  const onSaveClick = (event) => {
    co(function *() {
      let theSource = $('#input').val();
      let theMode = $('[name="mode"]:checked').val();


      let saveObj = {
        [storageKey]: {
          mode: theMode
        }
      };

      saveObj[storageSourceKey] = theSource;

      yield chromep.storage.local.set(saveObj);

      let backgroundWindow = chrome.extension.getBackgroundPage();
      backgroundWindow.initScript();

      $('#extra')[0].innerHTML = `<span style="color:red">save success !</span>`;
      yield sleep(2000);
      $('#extra')[0].innerText = "";
    });
  }

  $('#save').on('click', onSaveClick);

  const onSaveKeyup = (event) => {
    if (event.ctrlKey == true && event.keyCode == 19) {
      onSaveClick(event);
    }
  }

  $(document.body).on('keypress', onSaveKeyup);


  $('#input').on('drop', (event) => {
    event.preventDefault();
    var fileList = event.originalEvent.dataTransfer.files;
    if (fileList.length == 0) {
      return false;
    }

    co(function*() {
      let result = yield fileReader.readAsText(fileList[0]);
      if (!(/<script>[\s\S]*<\/script>/.test(result))) {
        result = "<script>\n" + result + "\n</script>";
      }
      $('#input').val(result);
      onSaveClick();
    });
  });
  co(function*() {
    var sourceKeyList = [];
    var valueArray = yield chromep.storage.local.get([storageKey, storageSourceKey]);
    var source = valueArray[storageSourceKey];

    if (valueArray[storageKey]) {
      $(`[name="mode"][value="${valueArray[storageKey].mode}"]`).attr('checked', 'true');
      $('#input').val(source);
    }
  });
}).catch(function (err) {
  console.log(err.toString());
  console.error(err);
  throw err;
});