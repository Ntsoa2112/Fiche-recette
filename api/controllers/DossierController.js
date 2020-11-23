/**
 * DossierController
 *
 * @description :: Server-side logic for managing dossiers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  findDossier: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Dossier.query('SELECT p_affectation.id_dossier,p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE id_pers=' +req.session.user+' AND id_etat = 0 ORDER BY p_dossier.id_dossier', function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['dossiers'] = found.rows;
      console.log(found.rows);
      res.view( 'dossier/listeDossier', retVal );
    });
  },

  //____________________________________________debut fonctionn FIND BY ID dossier
  findDossierById: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null);
    Dossier.findOne(id).exec(function (err, dossier){
      if (err) return res.negotiate(err);
      if (!id) return res.notFound('Could not find sorry.');
      var retVal = [];
      retVal['dossier'] = dossier;
      res.view( 'application/ajoutApplicationDossier', retVal );
    });
  },
};

