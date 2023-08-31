$(document).ready(function() {
  function initWebsocket() {
    console.log("initWebsocket")
    path = "";
    if (location.protocol == "http:") {
      path += "ws://"
    } else {
      path += "wss://"
    }
    path += location.hostname + ":" + location.port + "/websocket"
    var ws = new ReconnectingWebSocket(path);

    ws.onopen = function () {
      console.log('Connection opened');
      $('#websocket').css("display", "block");
      $('#websocketStatus').removeClass('glyphicon-remove').addClass('glyphicon-ok');

      var articleName = $('head').data('article-dst-filename');
      console.log("Registering: ", articleName)
      ws.send(articleName)
    };

    ws.onmessage = function (msg) {
      //console.log (msg.data)
      var  dd = new diffDOM.DiffDOM();
      var htmlString = JSON.parse(msg.data)
      //console.log (htmlString)
      var outDiv = document.getElementById('headerAndArticle');
      var newElement = document.createElement("div");
      newElement.setAttribute("id", "headerAndArticle");
      newElement.innerHTML = htmlString;
      var diff = dd.diff(outDiv, newElement);
      //console.log(diff)
      dd.apply(outDiv, diff);

      $("#toc").remove()

      if (anchors !== undefined) {
        anchors.add('h1')
        anchors.add('h2')
        anchors.add('h3')
        anchors.add('h4')
        anchors.add('h5')
      }
    };

    ws.onclose = function (msg) {
      $('#websocketStatus').removeClass('glyphicon-ok').addClass('glyphicon-remove');
      console.log('Connection closed');
    };
  };
  initWebsocket();
});