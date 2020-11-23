/**
 * DroitController
 *
 * @description :: Server-side logic for managing Droits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //_________________________________________________debut FIND APPLI to TEST
  //fonction qui retourne la liste de toutes les applications qui ne sont pas encore testÃ©es
  findDroit: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Droit.query('select fr_droit_user.*, r_personnel.matricule, r_personnel.nom, r_personnel.prenom from fr_droit_user join r_personnel on fr_droit_user.id_personnel = r_personnel.id_pers where fr_droit_user.droit = 1 order by fr_droit_user.id_droit_user', function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['droits'] = found.rows;
      console.log(found.rows);
      res.view( 'user/ListeAdministrateur', retVal );  //redirection vers accueil avec la liste des applications
    });
  },

  // delete droit
  deleteDroit: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idDroit');
    Droit.update({id_droit_user: id},{droit:0}).exec(function (err, updated){
      if (err) return res.send(err);
      return res.redirect('ListeAdministrateur');
    });
  },
};

