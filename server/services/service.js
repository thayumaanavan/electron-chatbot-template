

module.exports={

    getUrl: function(entities,callback){
        var jsonfile = require('jsonfile')
        var obj;
        jsonfile.readFile('./server/services/url.json', function (err, data) {
            if (err) callback("Sorry! I don't know");
            
            console.log(entities)
            var urlName=entities[0].entity.toString().toLowerCase();
            console.log(urlName)
            if(data[urlName])
                callback(data[urlName]);
            else
                callback("Sorry! I don't know");
        });
    }
}
