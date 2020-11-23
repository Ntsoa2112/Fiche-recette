/**
 * EtapeController
 *
 * @description :: Server-side logic for managing etapesd
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  findEtape: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Etape.find({}, function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['etapes'] = found;
      res.view( 'etape/listeEtape', retVal );
    });
  }
};

