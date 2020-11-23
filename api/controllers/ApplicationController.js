/**
 * ApplicationControllerl
 *
 * @description :: Server-side logic for managing applications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //_________________________________________________debut FIND APPLI
  //fonction qui retourne la liste de toutes les applications
  findApplication: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Application.getApplicationByUser(req.session.user, function(err, appli){
      if (err) console.log(err);
      var retVal = [];
      retVal['applications'] = appli.rows;
      res.view( 'application/accueil', retVal );  //redirection vers accueil avec la liste des applications
    });
  },

  //_________________________________________________debut FIND APPLI to TEST
  //fonction qui retourne la liste de toutes les applications qui ne sont pas encore testÃ©es
  findApplicationToTest: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Application.getApplicationNotTestedByUser(req.session.user, function(err, appli){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = appli.rows;
      res.view( 'application/listeApplication', retVal );
    });
  },

  //_________________________________________________debut FIND APPLI Resultat
  //fonction qui retourne la liste de toutes les applications qui ne sont pas encore testÃ©es
  findApplicationTested: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Application.getApplicationTestedByUser(req.session.user, function(err, appli){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = appli.rows;
      res.view( 'test/listeApplicationTeste', retVal );
    });
  },
  //_________________________________________________fin FIND APPLICATION Resultat


  //_________________________________________________debut FIND APPLI test Specifique
  //fonction qui retourne la liste de toutes les applications
  findApplicationTestSpecifique: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Application.query('select fr_application.nom_application,fr_application.id_application, p_dossier.num_dossier from fr_application join p_dossier on fr_application.id_dossier = p_dossier.id_dossier where fr_application.suppr = false', function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['users'] = user;
      retVal['applications'] = found.rows;
      console.log(found.rows);
      res.view( 'test/ajoutTestSpecifique', retVal );
    });
  },

  //_________________________________________________debut FIND APPLI PDF Specifique
  //fonction qui retourne la liste de toutes les applications
  findApplicationForPDF: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Application.findApplicationForPDF(function(err, appli){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = appli.rows;
      res.view( 'application/genererPdf', retVal );
    });
  },

  //____________________________________________debut fonctionn FIND BY ID application
  //fonction qui recherche une application par son id et qui retourne une application
  findApplicationById: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    var retVal = [];

    Application.findOne(id).exec(function (err, application){
      if (err) return res.negotiate(err);
      if (!id)return res.notFound('Could not find sorry.');
      Application.getDetailApplication(id, function(eror, test){
        if (eror) return res.negotiate(eror);
        //query jointure
        TestApp.query('SELECT fr_test.nom_test,fr_type_test.nom_type_test FROM fr_test JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test where fr_test_application.id_application = '+id+' and fr_test.suppr = false', function(erorSpec, testSpec) {
          if (erorSpec)return res.negotiate(erorSpec);
          sails.log('Found "%s"', testSpec);
          sails.log('Found "%s"', test);

          Dossier.getNumDossier(application.id_dossier, function(err, numDossier){
            if (err) return res.send(err);
            console.log(numDossier.rows);

            //personne ajout
            User.getDetailUser(application.id_pers_ajout, function(er, persAjout){
              if(er) return res.send(er);
              console.log(persAjout.rows);

              TypeTest.query('select * from fr_type_test where suppr = false', function(eror, type){
                if (eror) return res.send('erreur 2018');

                Etape.query('select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape WHERE id_dossier = '+application.id_dossier+' order by id_lien', function(eror, etape) {
                  if (eror) return res.send('erreur');

                  Fonctionnalite.getFonctionnaliteByApplication(id, function(err, fonctionnalite){
                    if (err) return res.send(err);

                    retVal['applications'] = application;
                    retVal['list_tests'] = test.rows;
                    retVal['list_tests_specifiques'] = testSpec.rows; //test specifique
                    retVal['numeroDossier'] = numDossier.rows;
                    retVal['etapes'] = etape.rows;
                    retVal['persAjout'] = persAjout.rows;
                    retVal['types'] = type.rows;
                    retVal['fonctionnalites'] = fonctionnalite.rows; //les fonctionnalités de l' application

                    res.view( 'application/detailApplication', retVal );
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  //____________________________________________debut fonctionn FIND BY ID TEST Makany am page test
  //fonction qui recherche une application par son id et qui retourne une application
  findApplicationByIdTest: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null);
    var idTest=req.param('test',null);
    var idTemp;
    if(idTest == null){
      idTemp = 1;
    }else{
      idTemp = idTest;
    }
    console.log("====================================== id Test =====>  "+idTest);
    var retVal = [];
    Application.findOne(id).exec(function (err, application){
      if (err) return res.negotiate(err);
      Test.findOne(idTemp).exec(function (err, testNom){
        if (err) return res.negotiate(err);
        if (!id) return res.notFound('Could not find sorry.');
        Application.getDetailApplication(id, function(eror, test){
          if (eror) return res.negotiate(eror);

          TestApp.query('SELECT fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test FROM fr_test JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test where fr_test_application.id_application = '+id+' and fr_test.suppr = false', function(erorSpec, testSpec) {
            if (erorSpec) return res.negotiate(erorSpec);

            Dossier.getNumDossier(application.id_dossier, function(err, numDossier){
              if(err) console.log(err);

              //personne ajout
              Application.query('select nom,prenom,matricule,id_departement  from r_personnel where id_pers = '+application.id_pers_ajout+'', function(er, persAjout){
                if(er) console.log(er);

                TypeTest.query('select * from fr_type_test', function(eror, type){
                  if (eror) return res.send('erreur type test' + eror);

                  Fonctionnalite.getFonctionnaliteByApplication(id, function(err, fonctionnalite){
                    if (err) return res.send(err);

                    console.log(numDossier.rows);
                    retVal['applications'] = application;
                    retVal['list_tests'] = test.rows;
                    retVal['list_tests_specifiques'] = testSpec.rows; //test specifique
                    retVal['numeroDossier'] = numDossier.rows;
                    retVal['persAjout'] = persAjout.rows;
                    retVal['types'] = type.rows;
                    retVal['tests'] = testNom;
                    retVal['fonctionnalites'] = fonctionnalite.rows; //les fonctionnalités de l' application
                    if(req.param('test',null)==null){
                      retVal['display'] = 'hidden';
                    }else{
                      retVal['display'] = '';
                    }
                    res.view( 'test/pageTest',retVal );
                });
              });
             });
            });
          });
        });
      });
    });
  },

  //Test 
  TestgetTabFonctionnalite: function(req, res) {
    var nb = 3;
    Application.getTabFonctionnalite(nb, function(err, tab){
      if (err) return res.send(err);
      res.send(tab);
    });
  },
  
  //____________________________________________debut fonctionn CREATE
  //fonction pour creer une application
  createApplication: function (req, res) // creation application avec ou sans les fonctionnalités
  {
    if (!req.session.user) return res.redirect('/login');
 
    if(req.method == 'POST' && req.param('nom_application',null) != null && req.param('dossier_num',null) != null && req.param('description',null) != null && req.param('chemin',null) != null)
    {
      async.parallel(
      [
        // pour les applications
        function (callback) {
          Application.create({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num'),description_application:req.param('description'),chemin:req.param('chemin'),id_pers_ajout:req.session.user,suppr:false,demande:false}).exec(function(err,model) {
            if (err) console.log(err);
            console.log("Create APPLICATION");
            callback(null, model);
          })
        }
      ],function (err, results) {
           //insertion fonctionnalité
          if(req.param('libelle-1') !== null){
            var nb_fonctionnalite = req.param('nb_fonctionnalite');
            console.log("Nombre fonctionnalité ================> "+nb_fonctionnalite);
            
            async.parallel(
            [
              // pour les applications
              function (callback) {
                Application.findOne({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num')}).exec(function (err, application) {
                    if(err) console.log(err);
                    callback(null, application);
                });
              },
              //get tableau num fonctionnalité
              function (callback) {
                Application.getTabFonctionnalite(nb_fonctionnalite, function(err, tab){
                  if (err) return res.send(err);
                  callback(null, tab);
                });
              }
            ],function (err, resultsApp) {
                var id_app = resultsApp[0].id_application;
                var application = resultsApp[0];
                console.log("ID App ==> "+id_app);
                console.log("RASULTAT TABLEAU ===> "+resultsApp[1]);
                async.parallel(
                [
                    function (callback) {
                      var tabFonct = resultsApp[1];
                      console.log("entree =========================");
                      //async = require("async");
                      async.each(tabFonct, function(i, callback){
                            var param = 'libelle-'+i;
                            var param2 = 'entree-'+i;
                            Fonctionnalite.create({libelle:req.param('libelle-'+i),entree:req.param('entree-'+i),sortie:req.param('sortie-'+i),delai:req.param('delai-'+i),id_application:id_app,supp:0}).exec(function(err,model) {
                              if (err) console.log(err);
                              console.log("CREATE FONCTIONNALITE ========================="+i);
                              callback();
                            }); 
                        },
                        function(err){
                          callback(null, 1);
                        }
                      );
                    },
                ],function (err, results) {
                  //Envoie email
                    async.parallel(
                    [
                      // pour les applications
                      function (callback) {
                        var idPersonneConnecte = req.session.user;
                        var queryFindMailUser = "select email from r_personnel where id_pers = "+idPersonneConnecte;
                        User.query(queryFindMailUser ,function (errr, user) { // exécution requete queryFindMailUser
                          if(errr) console.log(errr);
                          console.log(" ******************************** Email Sender ======>  "+user.rows[0].email);
                          callback(null, user.rows[0].email); // ------------------------------------------- 0
                        })
                      }, 
                      function (callback) {
                        Dossier.getPersonneAffectationDossier(application.id_dossier, function(err, lstPersonne){
                          if (err) console.log(err);
                          callback(null, lstPersonne); // ------------------------------------------- 1
                        });
                      }, 
                      function (callback) {
                        Dossier.findOne({id_dossier:application.id_dossier}).exec(function (err, dossier) {
                          if(err) console.log(err);
                          callback(null, dossier); // ------------------------------------------- 2
                        });
                      }, 
                      function (callback) {
                        Fonctionnalite.getFonctionnaliteByApplication(application.id_application, function(err, fonctionnalite){
                          if (err) console.log(err);
                          console.log("FONCTIONNALITE FOUND    ====> "+fonctionnalite);
                          console.log("FONCTIONNALITE FOUND    ====> "+fonctionnalite.rows[0]);
                          console.log("FONCTIONNALITE FOUND    ====> "+fonctionnalite.rows[0].libelle);
                          callback(null, fonctionnalite); // ------------------------------------------- 3
                        });
                      } 
                    ],function (err, resultsEmail) {
                        /*console.log("RESULT EMAIL     "+resultsEmail[3]);
                        console.log("RESULT EMAIL  ROWS   "+resultsEmail[3].rows[0].libelle);
                        var fonctionnaliteApp = resultsEmail[3].rows[0].libelle;*/
                        
                        return res.redirect('accueil');
                        
                        /*async = require("async");
                        async.each(resultsEmail[3].rows, function(resultEm, callback){
                          fonctionnaliteApp = fonctionnaliteApp + ", " +resultEm.libelle;
                          callback();
                        },function(err){
                          console.log(fonctionnaliteApp);
                          var objet = "[fiche - recette] - Demande d'application - "+resultsEmail[2].num_dossier+" - "+application.nom_application; //objet email
                          var message = "Demande d'application \""+application.nom_application+ "\" avec les fonctionnalités suivante: "+fonctionnaliteApp; // message à envoyer
                          console.log("Message email ===> "+message);
                          MailService.fonctionEnvoyerMailDemandeApplication(resultsEmail[0], resultsEmail[1], objet, message, application.nom_application, function(err){ // Envoie email
                            if(err) console.log(err);
                            console.log('Here **************************************************************');
                            // fin envoie email
                          });
                          res.redirect('accueil');
                        });*/
                      });  
                  });
              });
          }
        });
    }
    else {
        var retVal = [];
        console.log(req.param('nom_application',null));
        res.view('application/ajoutApplication', retVal);
    }
  },

  //____________________________________________debut fonctionn CREATE
  //fonction pour creer une application
  demanderApplication: function (req, res) // creation application avec ou sans les fonctionnalités
  {
    if (!req.session.user) return res.redirect('/login');
    
    TypeDemande.findTypeDemande(function(err, typeDemande){
      if (err) return res.send(err);
      var retVal = [];
      console.log("TYPE DEMANDE ===> " + typeDemande.rows);
      retVal['typeDemandes'] = typeDemande.rows;
      res.view('application/demandeApplication', retVal);
    });
    //var id_app = 0;
    /*if(req.method == 'POST' && req.param('nom_application',null) != null && req.param('dossier_num',null) != null && req.param('description',null) != null && req.param('chemin',null) != null)
    {
        Application.create({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num'),description_application:req.param('description'),chemin:req.param('chemin'),id_pers_ajout:req.session.user,suppr:false}).exec(function(err,model) {
          if (err) return res.send(err);
          //insertion fonctionnalité
          if(req.param('libelle-1') !== null){
            var nb_fonctionnalite = req.param('nb_fonctionnalite');
            console.log("Nombre fonctionnalité ================> "+nb_fonctionnalite);
            Application.findOne({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num')}).exec(function (err, application) {
              if(err) return next(err);
              var id_app = application.id_application;
              console.log("ID App ==> "+id_app);

              for(var i = 1; i<=nb_fonctionnalite; i++)
              {
                var param = 'libelle-'+i;
                var param2 = 'entree-'+i;
                console.log("Les fonctionnalités ================> "+req.param('libelle-'+i)+"  ==== "+req.param('entree-'+i));
                Fonctionnalite.create({libelle:req.param('libelle-'+i),entree:req.param('entree-'+i),sortie:req.param('sortie-'+i),delai:req.param('delai-'+i),id_application:id_app,supp:0}).exec(function(err,model) {
                  if (err) console.log(err);
                });
              }

              //Envoie email
              var idPersonneConnecte = req.session.user;
              var queryFindMailUser = "select email from r_personnel where id_pers = "+idPersonneConnecte;
              User.query(queryFindMailUser ,function (errr, user) { // exécution requete queryFindMailUser
                if(errr) return next(errr);

                console.log(" ******************************** Email Sender ======>  "+user.rows[0].email);
                Dossier.getPersonneAffectationDossier(application.id_dossier, function(err, lstPersonne){
                  if (err) return res.send(err);

                  Dossier.findOne({id_dossier:application.id_dossier}).exec(function (err, dossier) {
                    if(err) return next(err);

                    Fonctionnalite.getFonctionnaliteByApplication(application.id_application, function(err, fonctionnalite){
                      if (err) return res.send(err);

                      var fonctionnaliteApp = fonctionnalite.rows[0].libelle;
                      for(var i = 1; i<fonctionnalite.rows.length; i++){
                        fonctionnaliteApp = fonctionnaliteApp + ", " +fonctionnalite.rows[i].libelle;
                      }
                      console.log(fonctionnaliteApp);
                      var objet = "[fiche - recette] - Demande d'application - "+dossier.num_dossier+" - "+application.nom_application; //objet email
                      var message = "Demande d'application \""+application.nom_application+ "\" avec les fonctionnalités suivante: "+fonctionnaliteApp; // message à envoyer

                      MailService.fonctionEnvoyerMailDemandeApplication(user.rows[0].email, lstPersonne, objet, message, application.nom_application, function(err){ // Envoie email
                        if(err) return res.send(err);
                        console.log('Here **************************************************************');
                      });
                    });
                  });
                });
              });
              // fin envoie email
            });
          }
        });
        res.redirect('accueil');
    }
    else {
        var retVal = [];
        console.log(req.param('nom_application',null));
        res.view('application/demandeApplication', retVal);
    }*/
  },
  

  test: function (req, res) // creation application avec ou sans les fonctionnalités
  {
    var id = 97;
    Fonctionnalite.getFonctionnaliteByApplication(id, function(err, fonctionnalite){
      if (err) return res.send(err);

      var fonctionnaliteApp = fonctionnalite.rows[0].libelle;
      for(var i = 1; i<fonctionnalite.rows.length; i++){
        fonctionnaliteApp = fonctionnaliteApp + ", " +fonctionnalite.rows[i].libelle;
      }
      console.log(fonctionnaliteApp);
    });
    res.send("test fonctionnalite");
  },

  //____________________________________________debut fonctionn UPDATE
  updateApplication: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null);
    Application.findOne(id).done(function(err, model) {
      if(req.method=='POST' && req.param('Application',null)!=null) {
        var app=req.param('Application',null);
        model.nom_application=app.nom_application;
        model.id_dossier=app.id_dossier;
        model.save(function(err) {
          if (err) res.send('Error');
            res.redirect( 'user/view/'+model.id);
        });
      } else {
        res.render( 'user/update',{'model':model});
      }
    });
  },

  findApplicationByDossier : function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var dossier=req.param('idDossier',null);
    Application.query("SELECT fr_application.nom_application,fr_application.id_application, p_dossier.id_dossier FROM fr_application JOIN p_dossier ON fr_application.id_dossier = p_dossier.id_dossier where p_dossier.num_dossier ='"+dossier+"' and where fr_application.suppr = false", function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = found.rows;
      console.log(found.rows);
      res.view( 'application/resultatRecherche', retVal );
    });
  },

  //_________________________________________________debut FIND APPLI from Dossier
  //fonction qui retourne la liste de toutes les applications dans un dossier
  findAppliDossier: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var dossier=req.param('num_dossier',null);
    var retVal = [];
    Application.query("select fr_application.*, p_dossier.num_dossier from fr_application join p_dossier on fr_application.id_dossier = p_dossier.id_dossier where p_dossier.num_dossier ='"+dossier+"' and fr_application.suppr = false", function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = found.rows;
      retVal['numDossier'] = dossier;
      res.view( 'application/listeApplicationDossier', retVal );
    });
  },

// delete application ******************************************************MODIFIER
  deleteApplication: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idApplication');
    Application.update({id_application: id},{suppr:true}).exec(function (err, updated){
      if (err) return res.send(err);
      else return res.redirect('accueil');
    });
  },

  //____________________________________________debut fonctionn UPDATE
  updateApp: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();
    console.log('PARAMS ALL ===> ' + params.id_application);
    console.log('PARAMS ALL ===> ' + req.param('nomApplication',null));
    console.log('PARAMS ALL ===> ' + req.param('nom_application',null));
    var id = params.id_application;
    Application.update({id_application: id}, params).exec(function (err, model) {
      if (err) res.send("Error:".err);
      return res.redirect('accueil');
    });
  },

  //fonction qui recherche un test par son id et qui retourne un test
  findApplicationByIdUpdate: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    Application.findOne(id).exec(function (err, finn) {
      if (err) return res.negotiate(err);

      Fonctionnalite.getFonctionnaliteByApplication(id, function(err, fonctionnalite){
        if (err) return res.send(err);
        if (!id) return res.notFound('Could not find sorry.');
        var retVal = [];
        retVal['apps'] = finn;
        retVal['fonctionnalites'] = fonctionnalite.rows; //les fonctionnalités de l' application

        res.view( 'application/modifierApplication', retVal ) ;
      });
    });
  },

  //tableau liste app
  getTypeTestApp: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idDossier = req.param('idDossier',null);
    var idPers = parseInt(req.session.user);

    var queryTypeUnitaire = 'select get_count_type_test(1, '+idPers+')'; //app
    var queryTypeIntegration = 'select get_count_type_test(2, '+idPers+')'; //app
    var queryTypeMontee = 'select get_count_type_test(3, '+idPers+')'; //app
    var queryTypeSpecifique = 'select get_count_type_test(4, '+idPers+')'; //app

    if(idDossier !== "a"){
      queryTypeUnitaire = 'select get_count_type_test_dossier(1, '+idPers+', '+idDossier+')'; //app
      queryTypeIntegration = 'select get_count_type_test_dossier(2, '+idPers+', '+idDossier+')'; //app
      queryTypeMontee = 'select get_count_type_test_dossier(3, '+idPers+', '+idDossier+')'; //app
      queryTypeSpecifique = 'select get_count_type_test_dossier(4, '+idPers+', '+idDossier+')'; //app
    }
    TestApplication.query(queryTypeUnitaire, function(err1, unitaire){
      if (err1) return res.send(err1);

      TestApplication.query(queryTypeIntegration, function(err2, integration){
        if (err2) return res.send(err2);

        TestApplication.query(queryTypeMontee, function(err3, montee){
          if (err3) return res.send(err3);

          TestApplication.query(queryTypeSpecifique, function(err1, specifique){
            if (err1) return res.send(err1);

            var unitaireRes = unitaire.rows[0].get_count_type_test;
            var integrationRes = integration.rows[0].get_count_type_test;
            var monteeRes = montee.rows[0].get_count_type_test;
            var specifiqueRes = specifique.rows[0].get_count_type_test;
            if(idDossier !== "a"){
              console.log(" Différent de 'a' ");
              unitaireRes = unitaire.rows[0].get_count_type_test_dossier;
              integrationRes = integration.rows[0].get_count_type_test_dossier;
              monteeRes = montee.rows[0].get_count_type_test_dossier;
              specifiqueRes = specifique.rows[0].get_count_type_test_dossier;
            }
            var retVal = [];
            retVal['unitaire'] = unitaireRes; //appli
            retVal['integration'] = integrationRes;
            retVal['montee'] = monteeRes;
            retVal['specifique'] = specifiqueRes;
            res.view( 'application/applicationStat', retVal);
          });
        });
      });
    });
  },
};

/*
async.parallel(
[
  function (callback) {
    callback(null, 1);
  },
],function (err, results) {
  
});
*/
  
  /*createApplication: function (req, res) // creation application avec ou sans les fonctionnalités
  {
    if (!req.session.user) return res.redirect('/login');
    //var id_app = 0;
    if(req.method == 'POST' && req.param('nom_application',null) != null && req.param('dossier_num',null) != null && req.param('description',null) != null && req.param('chemin',null) != null)
    {
        Application.create({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num'),description_application:req.param('description'),chemin:req.param('chemin'),id_pers_ajout:req.session.user,suppr:false}).exec(function(err,model) {
          if (err) return res.send(err);
          //insertion fonctionnalité
          if(req.param('libelle-1') !== null){
            var nb_fonctionnalite = req.param('nb_fonctionnalite');
            console.log("Nombre fonctionnalité ================> "+nb_fonctionnalite);
            Application.findOne({nom_application:req.param('nom_application'),id_dossier:req.param('dossier_num')}).exec(function (err, application) {
              if(err) return next(err);
              var id_app = application.id_application;
              console.log("ID App ==> "+id_app);

              for(var i = 1; i<=nb_fonctionnalite; i++)
              {
                var param = 'libelle-'+i;
                var param2 = 'entree-'+i;
                console.log("Les fonctionnalités ================> "+req.param('libelle-'+i)+"  ==== "+req.param('entree-'+i));
                Fonctionnalite.create({libelle:req.param('libelle-'+i),entree:req.param('entree-'+i),sortie:req.param('sortie-'+i),delai:req.param('delai-'+i),id_application:id_app,supp:0}).exec(function(err,model) {
                  if (err) console.log(err);
                });
              }

              //Envoie email
              var idPersonneConnecte = req.session.user;
              var queryFindMailUser = "select email from r_personnel where id_pers = "+idPersonneConnecte;
              User.query(queryFindMailUser ,function (errr, user) { // exécution requete queryFindMailUser
                if(errr) return next(errr);

                console.log(" ******************************** Email Sender ======>  "+user.rows[0].email);
                Dossier.getPersonneAffectationDossier(application.id_dossier, function(err, lstPersonne){
                  if (err) return res.send(err);

                  Dossier.findOne({id_dossier:application.id_dossier}).exec(function (err, dossier) {
                    if(err) return next(err);

                    Fonctionnalite.getFonctionnaliteByApplication(application.id_application, function(err, fonctionnalite){
                      if (err) return res.send(err);

                      var fonctionnaliteApp = fonctionnalite.rows[0].libelle;
                      for(var i = 1; i<fonctionnalite.rows.length; i++){
                        fonctionnaliteApp = fonctionnaliteApp + ", " +fonctionnalite.rows[i].libelle;
                      }
                      console.log(fonctionnaliteApp);
                      var objet = "[fiche - recette] - Demande d'application - "+dossier.num_dossier+" - "+application.nom_application; //objet email
                      var message = "Demande d'application \""+application.nom_application+ "\" avec les fonctionnalités suivante: "+fonctionnaliteApp; // message à envoyer

                      MailService.fonctionEnvoyerMailDemandeApplication(user.rows[0].email, lstPersonne, objet, message, application.nom_application, function(err){ // Envoie email
                        if(err) return res.send(err);
                        console.log('Here **************************************************************');
                      });
                    });
                  });
                });
              });
              // fin envoie email
            });
          }
        });
        res.redirect('accueil');
    }
    else {
        var retVal = [];
        console.log(req.param('nom_application',null));
        res.view('application/ajoutApplication', retVal);
    }
  },*/
  
  
  