'use strict';

var exampleSocket = new WebSocket("ws://" + location.host + "/ws/");

 

// Send text to all users through the server
function sendText(val) {
  // Construct a msg object containing the data the server needs to process the message from the chat client.
  
  var msg = {
    Type: "message",
    Text: val, 
    Date: Date.now()
  };

  // Send the msg object as a JSON-formatted string.
  exampleSocket.send(JSON.stringify(msg)); 
}

exampleSocket.onopen = function (event) {
    sendText("Oczekiwanie na wyniki"); 
};

exampleSocket.onmessage = function(event) {
  var history = $("#historyBox");
  var text = "";
  var msg = JSON.parse(event.data);
  var time = new Date(msg.Date);
  var timeStr = time.toLocaleTimeString();

  var wynik = $("#dashboardText")
  var wynikDate = $("#dashboardDate")
  
  switch(msg.Type) {
  
    case "css":
      wynik.css('color', msg.Text)

       text = "(" + timeStr + ") color set to:" + msg.Text + "<br>";
      break;
    case "message":
      wynik.text(msg.Text)
      wynikDate.text(timeStr)

      text = "(" + timeStr + ") " + msg.Text + "<br>";
      break;
    case "img":
       wynik.css( 'background-image', 'url("' + msg.Text +'")' );

       text = "(" + timeStr + ") background set to:" + msg.Text + "<br>";
      break;
  }
  
  if (text.length) {
     history.prepend( text ); 
  }
};


