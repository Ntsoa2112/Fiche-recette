/**
 * Created by Luc, Ntsoa et Odilon on 20/11/2020.
 */
module.exports = {
    uploadFile : function(fichier, callback){       
        var noww = Date.now();
        fichier.upload({saveAs: function(file, cb) {cb(null, noww + file.filename.replace(/ /g,"_")); }, dirname: require('path').resolve(sails.config.appPath, 'assets/files')},function (err, uploadedFiles) {
            if (err) return res.send(err);
            console.log("++++++55555++++++++");
            var filename = noww  + uploadedFiles[0].filename.replace(/ /g,"_");
            console.log(filename);
            callback(null, filename);

        });           
    }
}