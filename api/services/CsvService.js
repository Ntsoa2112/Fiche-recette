/**
 * Created by 01019 on 23/08/2017.
 */
module.exports = {
    
    MyCSV: function(Fone, Ftwo, Fthree) {
        this.FieldOne = Fone;
        this.FieldTwo = Ftwo;
        this.FieldThree = Fthree;
    },
    
    readCsv: function(Fone, Ftwo, Fthree) {
        console.log("Read CSV Service");
        /*var csv = require('csv');
        var obj = csv();
        
        var MyData = []; 
        obj.from.path('../THEPATHINYOURPROJECT/TOTHE/csv_FILE_YOU_WANT_TO_LOAD.csv').to.array(function (data) {
            for (var index = 0; index < data.length; index++) {
                MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2]));
            }
            console.log(MyData);
        });
        
        var http = require('http'); //Load the http module
        var server = http.createServer(function (req, resp) {
            resp.writeHead(200, { 'content-type': 'application/json' });
            resp.end(JSON.stringify(MyData));
        });
// Create a webserver with a request listener callback.  This will write the response header with the content type as json, and end the response by sending the MyData array in JSON format.

        server.listen(8080);*/
    },
};
