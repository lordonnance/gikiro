// var express = require('./node_modules/express/lib/express.js');
var express = require('express');
var app = express.createServer();
app.listen(80);

// var socket = require('./node_modules/socket.io/lib/socket.io').listen(app);
var socket = require('socket.io').listen(app);

// require('./node_modules/jade/lib/jade.js');
require('jade');

app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.get('/socket.io-client.js', function(req, res){
  res.sendfile("./node_modules/socket.io/node_modules/lib"+req.url);
});

app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public"+req.url);
});

app.get('/*.(wav|mp3)', function(req, res){
  res.sendfile("./public/sound"+req.url);
});

app.get('/', function(req, res){
	res.render('index');	
});

var activeClients = 0;
var noteValue;
var msgValue;
var clientId;

socket.on('connection', function(client){ 
  activeClients +=1;
  socket.broadcast({
        id:clientId,
        info:"connection",
        data:activeClients
  });
  console.log("+1");
  var key;
  var clients = client.listener.clients;
  for (key in clients) {
    clientId = key;
  }
  client.on('disconnect', function(){clientDisconnect(client)});
  client.on('message', function(message){
    handleData(client, message.info, message.data);
  });
}); 

function handleData(client, info, data) {

    client.broadcast({
        id:clientId,
        info:info,
        data:data
    });
    
    console.log(info + " : " + data);
}

function clientDisconnect(client){
  activeClients -=1;
  client.broadcast({
        id:clientId,
        info:"deconnection",
        data:activeClients
  });
  console.log("-1");
}