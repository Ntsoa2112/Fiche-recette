/**
 * Created by 01019 on 23/08/2017.
 */

    //OBJECT
function Fonctionnalite (titre, entree, sortie) { //initialisation instance
    this.Titre = titre;
    this.Entree = entree;
    this.Sortie = sortie;
}

Fonctionnalite.prototype.getTitre = function() {// Get MyCsv's titre
    return this.Titre;
};

Fonctionnalite.prototype.getEntree = function() {// Get MyCsv's entree
    return this.Entree;
};

Fonctionnalite.prototype.getSortie = function() { // Get MyCsv's sortie
    return this.Sortie;
};
    //FIN OBJECT

module.exports = {
    
    testObject: function(Fone, Ftwo, Fthree) {
        module.exports = MyCSV; //export class
        var f= new Fonctionnalite('titre', 'entree', 'sortie');
        console.log('Titre ===>  ' + f.getFitrse());
    },
    
    readCsv: function(Fone, Ftwo, Fthree) {
        console.log("Read CSV Service");
        var csv = require('csv');
        var obj = csv();
        
        var MyData = []; 
        obj.from.path('./assets/CSV/testCsv.csv').to.array(function (data) {
            for (var index = 0; index < data.length; index++) {
                MyData.push(new Fonctionnalite(data[index][0], data[index][1], data[index][2]));
            }
            console.log(MyData);
        });
        var http = require('http'); //Load the http module
        var server = http.createServer(function (req, resp) {
            resp.writeHead(200, { 'content-type': 'application/json' });
            resp.end(JSON.stringify(MyData));
        });
// Create a webserver with a request listener callback.  This will write the response header with the content type as json, and end the response by sending the MyData array in JSON format.
        server.listen(8080);
    },
    
    //Get data from csv
    getDataFromCSV: function(callback) {
        console.log("Read CSV Service");
        var csv = require('csv');
        var obj = csv();
        var MyData = []; 
        obj.from.path('./assets/CSV/testCsv.csv').to.array(function (data) {
            for (var index = 0; index < data.length; index++) {
                MyData.push(new Fonctionnalite(data[index][0], data[index][1], data[index][2]));
            }
            console.log(MyData);
            return callback(null, MyData);
        });
    },
    
    //Insert
    insertFonctionnaliteCsv : function(callback) {
        this.getDataFromCSV(function(err, lstFonctionnalite){
            if (err) console.log(err);
            console.log(lstFonctionnalite);
        });
    },
};
