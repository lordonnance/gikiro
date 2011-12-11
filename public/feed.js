var socket; // global variable

function msgReceived(msg){
    console.log(msg);
    $clientCounter.html(msg.data);
    
    writeAction(msg.id, msg.info, msg.data);
    
    if (msg.info == "play") {
        playSound(msg.data);
    }
}

function sendData(str, info) {
    socket.send({
        info: info,
        data: str
    });
}

function writeAction(id, info, data) {
    console.log("writeActionIN");
    console.log(info);
    switch(info) {
        case "play" :
            $("<li>").css('color', 'black').html(id + " played the " + data).prependTo($("#actions>ul"));
            break;
        case "write" :
            $("<li>").css('color', 'yellow').html(id + " wrote " + data).prependTo($("#actions>ul"));
            break;
        case "connection" :
            $("<li>").css('color', 'pink').html(id + " is now connected").prependTo($("#actions>ul"));
            break;
        case "deconnection" :
            $("<li>").css('color', 'pink').html(id + " deconnected").prependTo($("#actions>ul"));
            break;
        default :
    }
}

// SOUND FUNCTIONS

function playSound(note) {
  
    var audio = $('<audio>', {
        autoPlay : 'autoplay'
    });
    
    addSource(audio, note+'.wav');
    
    return false;
}

function addSource(elem, path) {
    $('<source>').attr('src', path).appendTo(elem);
}

// SOUND FUNCTIONS END

// KEYBOARD FUNCTIONS

function keyReaction(sound) {
    writeAction("You ", "play", sound);
    playSound(sound);
    sendData(sound, "play");
}

function listenKeys(event) {
    var note = event.which;
    // console.log(note);
    
    switch(note) {
        case 90 :
            keyReaction("hihat-close");
            break;
        case 50 :
            keyReaction("hihat-open");
            break;
        case 69 :
            keyReaction("snare");
            break;
        case 32 :
            keyReaction("kick-drum");
            break;
        case 73 :
            keyReaction("high-tom");
            break;
        case 79 :
            keyReaction("middle-tom");
            break;
        case 80 :
            keyReaction("low-tom");
            break;
        case 219  :
            keyReaction("cymbal");
            break;
        default:
    }
}
  
// KEYBOARD FUNCTIONS END

$(document).ready(function () {
  $clientCounter = $("#client_count");
  
  console.log("Document Ready !");

  socket = new io.Socket("http://apeye.nodejitsu.com", {port: 80});
  socket.connect();
  socket.on('message', function(msg){msgReceived(msg)});
  
  $('#chatInput').bind('keydown', function(event) {
    if (event.which == 13) {
        var chatInput = document.getElementById("chatInput");
        console.log(chatInput.value);
        sendData(chatInput.value, "write");
        writeAction("You ", "write", chatInput.value);
        chatInput.value="";
    }
  });
  
  $('body').bind('keydown', function(event) {
    listenKeys(event);
  });
  
  $('#chatInput').bind('focusin', function(event) {
    $('body').unbind('keydown');
  });  
  
  $('#chatInput').bind('focusout', function(event) {
    $('body').bind('keydown', function(event) {
      listenKeys(event);
    });
  });
  
});