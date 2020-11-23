/**
 * Created by Luc, Ntsoa et Odilon on 20/11/2020.
 */
module.exports = {
    uploadFile : async function(fichier){
        if(fichier){
            console.log("#####################");
            console.log("&&&&&&&&&&&& : " + fichier);
            var noww = Date.now();
                await fichier.upload({saveAs: function(file, cb) {cb(null, noww  + file.filename); }, dirname: require('path').resolve(sails.config.appPath, 'assets/files')
                  },function (err, uploadedFiles) {
                    if (err) return res.serverError(err);
                    console.log("++++++55555++++++++");
                    console.log(uploadedFiles);
                    var filename = noww  + uploadedFiles[0].filename;
                    return filename;
                  });
        } 
    }
}