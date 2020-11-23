/**
 * Created by 01019 on 17/10/2016.
 */
module.exports = {
  sendNotification: function(req, id_pers, id_app, nom_app, id_test, nom_test, id_dossier, id_resultat, next) {
    var statut = 0; // non lu

    Dossier.findOne({id_dossier:id_dossier}).exec(function (err, dossier) {
      if(err) return next(err);

      // requette selection resultat
      Resultat.query("select fr_resultat.date_fin, fr_resultat.commentaire, fr_type_resultat.libelle_type_resultat, fr_type_resultat.id_type_resultat from fr_resultat join fr_type_resultat on fr_resultat.resultat = fr_type_resultat.id_type_resultat where fr_resultat.id_resultat="+id_resultat,function (errr, resultatType) {
        if(errr) return next(errr);

        //variable notification (message)
        var notific = "Le test "+nom_test+" de l'application "+nom_app+" a été "+resultatType.rows[0].libelle_type_resultat;

        //Insert à chaque personne affectée dans le dossier, (TO DO)

        Dossier.getPersonneAffectationDossier(id_dossier, function(err, listePersonneAffecte){
          if(err) return next(err);

          async.waterfall([
            function(callback){
              for(var i = 0; i<listePersonneAffecte.rows.length; i++){
                Notification.create({statut:statut,id_personnel:listePersonneAffecte.rows[i].id_pers,id_dossier:id_dossier,id_application:id_app,id_test:id_test,notification:notific}).exec(function(err,model) {
                  if(err) return next(err);
                });
              }
              callback(null);
            },
          ], function (err, result) {
            //get nb notif
            Notification.query('select * from fr_notification where statut = 0 and id_personnel = '+req.session.user,function (errr, liste) {
               if(err) return next(err);

               Notification.count({statut:'0', id_personnel:req.session.user}).exec(function countCB(err, nb_notif) {
               if(err) return next(err);

               var retVal = {
               'notif_content': notific,
               'nb_notif': nb_notif,
               'id_dossier': id_dossier
               }
               // fin get nb notif

               req.session.listNotification = liste.rows;
               req.session.nbNotification = nb_notif;
               console.log("-     -    -  - - -  -" +req.session.nb);
               sails.sockets.blast("notif", retVal); // envoie notification  <<=================

               next(null);
               });
             });
          });
        });
      });
    });
  }
}

