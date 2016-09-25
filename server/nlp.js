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
          parameters : {id: "104ea5b9-50ad-4b90-8c54-6bd8c27a391f",'subscription-key': "cd3ab42d747b45cb9ecf0c1796ed32ef",q:message}
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