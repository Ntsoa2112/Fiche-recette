/**
 * FonctionnaliteController
 *
 * @description :: Server-side logic for managing fonctionnalites
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //fonction qui retourne la liste des fonctionnalités d'une application
  findFonctionnaliteApplication: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    var id_app = req.param('id_application',null);

    Fonctionnalite.getFonctionnaliteByApplication(id_app, function(err, fonctionnalite){
      if (err) return res.send(err);
      var retVal = [];
      retVal['fonctionnalites'] = fonctionnalite.rows;
    });
  },

  //____________________________________________debut fonctionn CREATE
  //fonction pour creer une nouvelle fonctionnalité
  createFonctionnalite: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    console.log("ID application ===> "+req.param('id_application'));
    Fonctionnalite.create({libelle:req.param('libelle'),entree:req.param('entree'),sortie:req.param('sortie'),delai:req.param('delai'),id_application:req.param('id_application') ,supp:0}).exec(function(err,model) {
      if (err) return res.send(err);
      var retVal = [];
      res.redirect('back');
    });
    /*else {
      var retVal = [];
      console.log(req.param('nom_application',null));
      res.view('application/ajoutApplication', retVal);
    }*/
  },
  //________________________________fin

  //____________________________________________debut fonctionn UPDATE fonctionalite
  updateFonctionnalite: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();

    //var id = req.param('id_fonctionnalite',null);
    var libelle = req.param('libelle',null);
    var entree = req.param('entree',null);
    var sortie = req.param('sortie',null);
    var delai = req.param('delai',null);

    console.log('PARAMS ALL ===> ' + params.id_fonctionnalite);
    console.log('PARAMS ALL ===> ' + params.libelle);
    console.log('PARAMS ALL ===> ' + params.entree);
    console.log('PARAMS ALL ===> ' + params.sortie);
    console.log('PARAMS ALL ===> ' + params.delai);

    /*console.log('PARAMS ALL ===> ' + req.param('nomApplication',null));
    console.log('PARAMS ALL ===> ' + req.param('nom_application',null));*/
    var id = params.id_fonctionnalite;
    Fonctionnalite.update({id_fonctionnalite: id}, params).exec(function (err, model) { //{libelle:libelle, entree:entree, sortie:sortie, delai:delai}
      if (err) res.send("Error:".err);
      console.log('UPDATE Fonctionnalite');
      return res.redirect('back');
    });
  },

  //Fonction pour supprimer fonctionnalité
  deleteFonctionnalite: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idFonctionnalite');
    Fonctionnalite.update({id_fonctionnalite: id},{supp:1}).exec(function (err, updated){
      if (err) return res.send(err);
      else return res.redirect('back');
    });
  },
};

