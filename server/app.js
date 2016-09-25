var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var linkifyHtml = require('linkifyjs/html');
var nlp=require('./nlp');
var count=0;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('my_response', {'data': 'Connected', 'count': 0});

  socket.on('communicate',function(message){
    var bot_response=message.data
    count=count+1;
    nlp.getResponse(bot_response,function(response){
        bot_response =linkifyHtml(response)
        socket.emit('bot_response', {'data': bot_response,'count':count});
    });
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});