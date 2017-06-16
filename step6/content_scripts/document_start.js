chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.type) {
      case "SEND_SOURCE": {
        var source = request.source;
        var parent = request.parent || 'body';
        var mode = request.mode;

        if (mode == "document_start") {
          var script = document.createElement('script');
          script.innerHTML = source;
          document.head.appendChild(script);
        } else {
        }
        break;
      }
      default:
    }
  }
);