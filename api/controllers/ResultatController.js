/**
 * ResultatController
 *
 * @description :: Server-side logic for managing resultats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //____________________________________________debut fonctionn CREATE
  createResultat: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id_personnel = req.session.user;
    var datetime = new Date();
    var date_resultat = datetime;
    var resultat = req.param('resultat');
    //Test application
    var id_test = req.param('idTest');
    var id_appplication = req.param('id_application');
    var id_recette = 1; //pour tester
    Resultat.create({id_personnel:id_personnel, date_resultat:date_resultat, resultat:resultat}).exec(function(err,model) {
      if (err) return res.send(err);

      Resultat.findOne({id_personnel:id_personnel, date_resultat:date_resultat, resultat:resultat}).exec(function(err, found) {
        if (err) return res.send(err);
        TestApplication.create({id_test:id_test, id_appplication:id_appplication, id_resultat:found.id_resultat, id_recette: id_recette}).exec(function(err,model) {
          if (err) return res.send(err);
          res.redirect('/appByIdTest?id='+id_appplication);
        });
      });
    });
  },
};

