(function () {
  function readAs(file, as) {
    if (!(file instanceof Blob)) {
      throw new TypeError('Must be a File or Blob')
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = e => reject(`Error reading ${file.name}: ${e.target.result}`)
      reader['readAs' + as](file)
    })
  }

  function readAsDataURL(file) {
    return readAs(file, 'DataURL')
  }

  function readAsText(file) {
    return readAs(file, 'Text')
  }

  function readAsArrayBuffer(file) {
    return readAs(file, 'ArrayBuffer')
  }

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = {
      default: {
        readAsDataURL,
        readAsText,
        readAsArrayBuffer
      },
      readAsDataURL,
      readAsText,
      readAsArrayBuffer
    }
  } else {
    window.FileReaderPromise = function () {
      return {
        readAsDataURL,
        readAsText,
        readAsArrayBuffer
      }
    }
  }

})();