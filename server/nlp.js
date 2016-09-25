var service=require('./services/service.js');
var Client = require('node-rest-client').Client;

module.exports= {
    getResponse :function(message,callback){
        processMessage(message,function(processed){
            if(processed){
                if(processed.intent!='none'){
                    service[processed.intent](processed.entities,function(message){
                        callback(message);
                    });
                } 
            }
            else { callback("Sorry.I don't know.")}
        });
        //if(processed.
        
    }

} 

  processMessage= function(message,callback){
      var client = new Client();
      var args={
          parameters : {id: "Application.ID",'subscription-key': "Application.KEY",q:message}
      }

      var req=client.get("https://api.projectoxford.ai/luis/v1/application",args,
      function(data,response){
          callback({intent:data.intents[0].intent,entities:data.entities});
      });

      req.on('error', function (err) {
        console.log('request error', err);
        callback({intent:'error'});
      });
  }

//console.log(processMessage("send me ppmc url"));
