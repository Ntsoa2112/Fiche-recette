/**
 * TestApplicationController
 *
 * @description :: Server-side logic for managing testapplications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  debutTest : function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    async.parallel(
    [
      function (callback) {
        TestApplication.findOne({id_test:req.param('test',null),id_application:req.param('id',null)}).exec(function (err, record) {
          if(err) console.log(err);
          callback(null, record);
        });
      },
    ],function (err, results) {
      if(results[0]==undefined){
        async.parallel(
        [
          function (callback) {
            TestApplication.create({id_test:req.param('test',null),id_application:req.param('id',null)}).exec(function (err, record2) {
                if(errr) console.log(err);
                callback(null, record2);
            });
          },
          function (callback) {
            Resultat.create({id_personnel:req.session.user}).exec(function (errr, resultat) {
              if(errr) console.log(errr);
              callback(null, resultat);
            });
          }
        ],function (err, resultats) {
          req.session.idresultat = resultats[1].id_resultat;
            TestAppRes.create({id_test_application:resultats[0].id_test_app,id_resultat:resultats[1].id_resultat}).exec(function (errrr, tar) {
              if(errr) console.log(errr);
              res.redirect("/appByIdTest?id="+req.param('id',null)+"&test="+req.param('test',null)+"&status=1&idres="+resultats[1].id_resultat);
            });
        });
			}
      else{
        async.parallel(
        [
          function (callback) {
            Resultat.create({id_personnel:req.session.user}).exec(function (errr, resultat) {
              if(errr) console.log(errr);
              callback(null, resultat);
            });
          },
        ],function (err, results2) {
          req.session.idresultat = results2[0].id_resultat;
          TestAppRes.create({id_test_application:results[0].id_test_app,id_resultat:results2[0].id_resultat}).exec(function (errr, tar) {
            if(errr) console.log(errr);
            res.redirect("/appByIdTest?id="+req.param('id',null)+"&test="+req.param('test',null)+"&status=1&idres="+results2[0].id_resultat);
          });
        });  
			}
      return true;
    });
    
	},

  finTest : function (req, res, next)
  {
    if (!req.session.user) return res.redirect('/login');
    var idApplication = req.param('id',null);
    
    console.log("COMMENTAIRE ===> "+unescape(req.param('com',null)));
    
    async.parallel(
    [
      function (callback) {
        TestApplication.findOne({id_test:req.param('test',null),id_application:req.param('id',null)}).exec(function (err, record) {
          if(err) console.log(err);
          callback(null, record); // --------------------------------------- 0
        });
      },
      function (callback) {
        //_______________MISE à JOUR du table fr_resultat (resultat, commentaire, date)___________________   unescape(
        Resultat.query("update fr_resultat set date_fin=now() , resultat="+req.param('res',null)+" ,commentaire='"+req.param('com',null)+"' where id_resultat="+req.param('idres',null), function (errr, resultat) {
          if(errr) console.log(errr);
          callback(null, resultat); // --------------------------------------- 1
        });
      },
      function (callback) {
        Test.findOne({id_test:req.param('test',null)}).exec(function (err, testName) {
            if(err) console.log(err);
            callback(null, testName); // --------------------------------------- 2
        });
      },
      function (callback) {
        Application.findOne({id_application:req.param('id',null)}).exec(function (err, appName) {
          if(err) console.log(err);
          callback(null, appName); // --------------------------------------- 3
        });
      }
    ],function (err, results) {
      
        async.parallel(
        [
          function (callback) {
            //Creation PDF ______________________________________________________________
              PdfService.fonctionGenererPdf(req, res, results[3].id_application, function(err){
                if(err) console.log(err);
                callback(null, 1); // --------------------------------------- 0
              });
          },
          function (callback) {
            // requette selection resultat
              Dossier.findOne({id_dossier:results[3].id_dossier}).exec(function (err, dossier) {
                if(err) console.log(err);
                callback(null, dossier); // --------------------------------------- 1
              });
          },
          function (callback) {
            Resultat.query("select fr_resultat.date_fin, fr_resultat.commentaire, fr_type_resultat.libelle_type_resultat, fr_type_resultat.id_type_resultat from fr_resultat join fr_type_resultat on fr_resultat.resultat = fr_type_resultat.id_type_resultat where fr_resultat.id_resultat="+req.param('idres',null),function (errr, resultatType) {
              if(errr) console.log(errr);
              callback(null, resultatType); // --------------------------------------- 2
            });
          },
          function (callback) {
             //_________________ENVOIE NOTIFICATION__________________________________________________________________________________________________
              NotificationService.sendNotification(req, req.session.user, req.param('id',null), results[3].nom_application, req.param('test',null), results[2].nom_test,  results[3].id_dossier, req.param('idres',null), function(err){
                if(err) console.log(err);
                callback(null, 1); // --------------------------------------- 3
              });
          }
        ],function (err, results2) {
          //__________________________________________________DEBUT envoie mail ______________________________________________________________________
          var resultat = "validation";  //Resultat test
          var resultatMessage = "validé. ";

          if(results2[2].rows[0].id_type_resultat == "2"){
            resultat = "rejet";
            resultatMessage = "rejeté. ";
          }
          var dateFin = DateService.changeFormatTimestamp(results2[2].rows[0].date_fin);
          var objet = "[fiche - recette] - "+results2[1].num_dossier+" - "+resultat+" application - "+results[3].nom_application+" - "+dateFin; //objet email
          var message = "Le test \""+results[2].nom_test+ "\" de l application "+results[3].nom_application+" du dossier "+results2[1].num_dossier+" a été "+resultatMessage+" "+unescape(results2[2].rows[0].commentaire); // message à envoyer
         
          console.log(" ******************************** Envoi email");
          var idPersonneConnecte = req.session.user;
          var queryFindMailUser = "select email from r_personnel where id_pers = "+idPersonneConnecte;
          console.log(" ******************************** Requete ---------->  "+ queryFindMailUser);

          async.parallel(
          [
            function (callback) {
              User.query(queryFindMailUser ,function (errr, user) { // exécution requete queryFindMailUser
                if(errr) console.log(errr);
                console.log(" ******************************** Email Sender ======>  "+user.rows[0].email);
                callback(null, user); // --------------------------------------- 0
              });
            },
            function (callback) {
              Dossier.getPersonneAffectationDossier(results[3].id_dossier, function(err, lstPersonne){
                if (err) console.log(err);
                callback(null, lstPersonne); // --------------------------------------- 1
              }); 
              
            }
          ],function (err, results3) {
             MailService.fonctionEnvoyerMail(results3[0].rows[0].email, results3[1], objet, message, results[3].nom_application, function(err){ // Envoie email
                if(err) return res.send(err);
                console.log('tonga ato **************************************************************');
              });
              res.redirect("/appByIdTest?id="+idApplication);
          });
        });
    });
  }
};



    /*
    TestApplication.findOne({id_test:req.param('test',null),id_application:req.param('id',null)}).exec(function (err, record) {
		  if(err)return res.send(err);

      if(record==undefined){
				TestApplication.create({id_test:req.param('test',null),id_application:req.param('id',null)}).exec(function (err, record2) {
						if(errr) return res.send(err);

							Resultat.create({id_personnel:req.session.user}).exec(function (errr, resultat) {
							if(errr) return res.send(errr);

								req.session.idresultat = resultat.id_resultat;
								TestAppRes.create({id_test_application:record2.id_test_app,id_resultat:resultat.id_resultat}).exec(function (errrr, tar) {
									if(errr)return res.send(errr);
                  res.redirect("/appByIdTest?id="+req.param('id',null)+"&test="+req.param('test',null)+"&status=1&idres="+resultat.id_resultat);
								});
						});
				});
			}else{
				Resultat.create({id_personnel:req.session.user}).exec(function (errr, resultat) {
					if(errr)return res.send(errr);

          req.session.idresultat = resultat.id_resultat;
          TestAppRes.create({id_test_application:record.id_test_app,id_resultat:resultat.id_resultat}).exec(function (errrr, tar) {
            if(errr)return res.send(errr);
            res.redirect("/appByIdTest?id="+req.param('id',null)+"&test="+req.param('test',null)+"&status=1&idres="+resultat.id_resultat);
          });
				});
			}
	  });
    return true;
    
    */