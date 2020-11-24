/**
 * Created by Luc, Ntsoa et Odilon on 20/11/2020.
 */
module.exports = {
    uploadFile : function(fichier){
        return new Promise(download(fichier));
            function download(fichier){
                var noww = Date.now();
                fichier.upload({saveAs: function(file, cb) {cb(null, noww + file.filename); }, dirname: require('path').resolve(sails.config.appPath, 'assets/files')
                  },function (err, uploadedFiles) {
                    if (err) return res.serverError(err);
                     console.log("++++++55555++++++++");
                   
                    var filename = noww  + uploadedFiles[0].filename;
                    console.log(filename);
                  });
            }           
    }
}