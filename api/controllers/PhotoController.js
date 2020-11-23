/**
 * PhotoController
 *
 * @description :: Server-side logic for managing Photos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  acceuil : function(req, res){   //accueil
    var matricul = req.param('id');
    if(!matricul) matricul = 551;
    Photo.find({id_pers : matricul}, function(err, resultat){
      if(err || resultat[0] == undefined) return err;

      var imageToShow = ImageService.toBase64String(resultat[0].photo);
      res.view("pictureBox", {image : imageToShow});
    });
  }
};

