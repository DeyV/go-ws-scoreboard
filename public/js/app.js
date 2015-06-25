'use strict';

var exampleSocket = new WebSocket("ws://" + location.host + ":" + location.port + "/ws/");

 

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
    sendText("Here's some text that the server is urgently awaiting!"); 
};

exampleSocket.onmessage = function(event) {
  var f = $("#chatbox");
  var text = "";
  var msg = JSON.parse(event.data);
  var time = new Date(msg.Date);
  var timeStr = time.toLocaleTimeString();
  
  switch(msg.Type) {
  
    case "css":
       $("#bodyMess").css('color', msg.Text)
      text = "<b>css <em>color</em> set to " + msg.Text  + " in at " + timeStr + "</b><br>";
      break;
    case "message":
      $("#bodyMess").text(msg.Text )
      text = "(" + timeStr + ") <b>" + msg.Name + "</b>: " + msg.Text + "<br>";
      break;
    case "img":
      f.css( 'background: url(' + msg.Text +'); ')
      text = "<b>img <em>" + msg.Name + "</em> set to " + msg.Text  + " in at " + timeStr + "</b><br>";
      break;
   
  }
  
  if (text.length) {
    f.append( text ); 
  }
};


