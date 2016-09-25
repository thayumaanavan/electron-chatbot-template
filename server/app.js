var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var linkifyHtml = require('linkifyjs/html');

var count=0;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('my_response', {'data': 'Connected', 'count': 0});

  socket.on('communicate',function(message){
    var bot_response=message.data
    if(bot_response=='conversation_start_x'){ bot_response='hi'}
    count=count+1;
    bot_response =linkifyHtml('hello this is the github link : http://github.com')
    socket.emit('bot_response', {'data': bot_response,'count':count});
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});