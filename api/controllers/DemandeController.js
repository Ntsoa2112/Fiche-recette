/**
 * DemandeController
 *
 * @description :: Server-side logic for managing demandes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fileService = require('../services/FileService');


module.exports = {
  indexDemande: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    async.series([
      function(callback){
        TypeDemande.findTypeDemande(callback);
        },
      function(callback){
        Demande.findPriorite(callback);
      },
      function(callback){
        Demande.getDemandeurs(callback); //demandeur all CP
      }
    ],function (error,resultat){
      var retVal = [];
      retVal['typeInterventions'] = resultat[0].rows;
      retVal['priorite']=resultat[1].rows;
      retVal['demandeurs']=resultat[1].rows;
      res.view('application/demandeIntervention', retVal);

    });

  },

  getListeDemandeur: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        async.series([
            function (callback) {
                Demande.getListeDemandeur(null,callback);
            }
        ],function (err,result) {
            if (err) return res.send("Erreur de requete");
            return res.ok(JSON.stringify(result[0]));//retourne de la liste en JSON
        })
    },

  indexSousTache: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    res.view('application/gestionSousTache');
  },

  getStatistiqueDemande: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    res.view('application/statistiqueIntervention');
  },

  rechercheDeveloppement: function (req, res) // creation application avec ou sans les fonctionnalités
  {
      if (!req.session.user) return res.redirect('/login');
      

      //var id_type_intervention = req.param('id_type_intervention',null);
      //var typeIntervention = 5; //id
      var id_etat_demande = 2;
      var id_personne_demande = req.session.user;

      var description = req.param('descriptionRecherche',null);
      var estimation = req.param('estimationRecherche',null);
      var delai = req.param('delaiRecherche',null);

      var typeIntervention = req.param('typeIntervention',null);

      /*var idDossier = req.param('dossier_num2',null);
      var idApplication = req.param('idApplication',null);
      var delai = req.param('delai',null);*/

      console.log("Description demande ====> "+description);
      /*console.log("ID dossier ====> "+idDossier);
      console.log("ID App ====> "+idApplication);
      console.log("ID App ====> "+delai);*/

      var id_app = 546;
      /*switch (typeIntervention) {
        case 5:
          id_app = 546;
          break;
        case 6:
          id_app = 547;
          break;
        case 7:
          id_app = 548;
          break;
        case 8:
          id_app = 549;
          break;
        case 9:
          id_app = 550;
          break;
          default:
            text = 546;
      }*/

      if(typeIntervention == 5){
        id_app = 546;
      }
      else if (typeIntervention == 6){ 
        id_app = 547;
      }   
      else if (typeIntervention == 7){ 
        id_app = 548;
      }   
      else if (typeIntervention == 8){ 
        id_app = 549;
      }   
      else if (typeIntervention == 9){ 
        id_app = 550;
      }   
     

      async.parallel(
      [
        //id_dossier:idDossier, id_application:idApplication,
        //var requete="UPDATE fr_demande SET id_personne_dev="+id_pers_dev+",id_etat_demande=2,delai='"+delai+"' WHERE id_demande="+id_demande_application;
        function (callback) {
           Demande.create({id_type_intervention:typeIntervention, id_dossier:839, id_application : id_app , id_priorite : 3, id_etat_demande:id_etat_demande, id_personne_demande:id_personne_demande, description:unescape(description), id_personne_dev : id_personne_demande, estimation_dev : estimation, delai : delai}).exec(function(err,model) { //, delai:delai
              if (err) console.log(err);
              console.log("5 - Create Demande");
              callback(null, model);
            });
        }
      ],function (err, resultsApp) {
          res.redirect('demandeIntervention');
      });
  },


  /*

  */
  demandeIntervention: async function (req, res) // creation application avec ou sans les fonctionnalités
  {
      if (!req.session.user) return res.redirect('/login');

      //var id_type_intervention = req.param('id_type_intervention',null);
      var typeIntervention = req.param('typeIntervention',null); //id
      var id_etat_demande = 1;

      //var id_personne_demande = req.session.user;
      var id_personne_demande = req.param('demandeur',null);
      if(!id_personne_demande){
        id_personne_demande = req.session.user;
      }

      var description = req.param('description',null);
      var idDossier = req.param('dossier_num2',null);
      var idApplication = req.param('idApplication',null);
      var delai = req.param('delai',null);

      var delai_prod = req.param('delai_prod',null);

      let abaque = " ";
      let cTest = " ";
      let fichier;
      /*

      if(req.file("abaque")){
        fichier = req.file("abaque");
        async.series([
          function (callback){
            console.log("///////////////////////0000000000000000");
            fileService.uploadFile(fichier, callback);
          }
        ], function(err, result){
            if (err) return res.send(err);
            console.log("___________________________________");
            console.log(result[0]);
        })        
      };
      if(req.file("cTest")){
        fichier = req.file("cTest");
        cTest = await fileService.uploadFile(fichier);
      };
      console.log("abaqueZZZZZZZ : " + abaque + " ;  cahier test ZZZZZZZZZZZZZZ: " + cTest + " *********************************0");
*/
      var priorite= 1;
      console.log("Type intervention ====> "+typeIntervention);
      console.log("Description demande ====> "+description);
      console.log("ID dossier ====> "+idDossier);
      console.log("ID App ====> "+idApplication);
      console.log("ID App ====> "+delai);
      console.log("priorite===>"+priorite);

      console.log("DELAI PROD ===>"+delai_prod);
      
      async.series(
      [
        function (callback){
            Application.findOne({id_application:idApplication}).exec(function (err, application) {
                if(err) console.log(err);
                console.log("1 - Find application ");
                callback(null, application);
            });
        },
        function (callback){
            console.log("2 - Get type intervention  ");
            TypeDemande.findTypeDemandeById(typeIntervention, callback);
        },
        function (callback) {
            //Si il y a un fichier abaque ou fichier test envoyer, on upload les fichiers on les enregistre dans le 'assets/files' et ses noms dans la BDD
            if(req.file("abaque") || req.file("cTest")){
                async.series([
                    function(callback){
                          fichier = req.file("abaque");
                          fileService.uploadFile(fichier, callback);                 
                    },
                    function(callback){
                          fichier = req.file("cTest");
                          fileService.uploadFile(fichier, callback);
                    }
                ], function(err, resultats){
                    if(err) return res.send(err);
                    abaque = resultats[0];
                    cTest = resultats[1];

                    console.log("abaque111 : " + abaque + " ;  cahier test111 : " + cTest + " *********************************0");
                    Demande.create({id_type_intervention:typeIntervention, id_etat_demande:id_etat_demande, id_personne_demande:id_personne_demande, description:unescape(description), id_dossier:idDossier, id_application:idApplication, qualite_dev:1, id_priorite: priorite, delai_prod: delai_prod, abaque:abaque, file_test:cTest }).exec(function(err,model) { //, delai:delai
                        if (err) console.log(err);
                        console.log("3 - Create Demande");
                        callback(null, model);
                        });
                })
            }

            
        },
        function (callback) {
            var option = [];
            option.idUser = req.session.user;
            option.nomTest = unescape(description);
            option.idApplication = idApplication;
            // insert test to app
            if(typeIntervention == 1 || typeIntervention == 2){
              Test.createTestAppDemande(option, function(err, tab){
                if (err) console.log(err);
                callback(null, tab);
              });
            }else{
              callback(null, 0);
            }

        }
      ],function (err, resultsApp) {
          var application = resultsApp[0];
          var typeInterv = resultsApp[1];
          console.log("Type interv ==> "+ typeInterv);
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
            }
          ],function (err, resultsEmail) {

              var objet = "[fiche - recette] - Demande d'intervention ("+typeInterv.rows[0].libelle+") - "+resultsEmail[2].num_dossier+" - "+application.nom_application; //objet email
              var message = "Demande d'intervention dans l'application \""+application.nom_application+ "\"  "+". " +description; // message à envoyer
              console.log("Message email ===> "+message);
              MailService.fonctionEnvoyerMailDemande(req.session.user, resultsEmail[1], objet, message, application.nom_application, function(err){ // Envoie email
                if(err) console.log(err);
                console.log('Here **************************************************************');
                // fin envoie email
              });
              res.redirect('demandeIntervention');
            });
          //res.redirect('demandeIntervention');
      });
  },

  demandeApplication: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("DEMANDE APP    "+req.param('nom_application',null) +"  "+req.param('dossier_num',null)+"   "+req.param('description',null)+"   "+req.param('chemin',null));
    //var id_app = 0;

      var typeIntervention = 4; //id
      var id_etat_demande = 1;

      var id_personne_demande = req.param('demandeur_application',null);
      if(!id_personne_demande){
        id_personne_demande = req.session.user;
      }

      var description = req.param('description',null);
      var idDossier = req.param('dossier_num',null);
      var idApplication = req.param('idApplication',null);
      var delai = " ";  //req.param('delai',null)

      var delai_prod_app = req.param('delai_prod_app',null);

      console.log("Type intervention ====> "+typeIntervention);
      console.log("Description demande ====> "+description);
      console.log("ID dossier ====> "+idDossier);
      console.log("ID App ====> "+idApplication);
      console.log("ID App ====> "+delai);


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
                    function (callback) {  //CREATE NEW DEMANDE
                      //Si il y a un fichier abaque ou fichier test envoyer, on upload les fichiers on les enregistre dans le 'assets/files' et ses noms dans la BDD
                      if(req.file("abaque") || req.file("cTest")){
                        async.series([
                            function(callback){
                                  fichier = req.file("abaque");
                                  fileService.uploadFile(fichier, callback);                 
                            },
                            function(callback){
                                  fichier = req.file("cTest");
                                  fileService.uploadFile(fichier, callback);
                            }
                        ], function(err, resultats){
                            if(err) return res.send(err);
                            abaque = resultats[0];
                            cTest = resultats[1];

                            Demande.create({id_type_intervention:typeIntervention, id_etat_demande:id_etat_demande, id_personne_demande:id_personne_demande, description:unescape(description), id_dossier:idDossier, id_application:id_app, delai:delai, qualite_dev:1, id_priorite: 1, delai_prod: delai_prod_app, abaque:abaque, file_test:cTest}).exec(function(err,demandeRes) {
                              if (err) console.log(err);
                              console.log("Create Demande");
                              callback(null, demandeRes);
                            });  
                        })
                    }

                    }

                ],function (err, results) {

                  var idDemande = results[0].id_demande;
                  var estimation = 0;

                  async.parallel(
                  [
                      function (callback) {
                        var tabFonct = resultsApp[1];
                        console.log("entree =========================");
                        //async = require("async");
                        async.each(tabFonct, function(i, callback){
                              var param = 'libelle-'+i;
                              var param2 = 'entree-'+i;

                              async.parallel(
                                [
                                  //CREATE Fonctionnalite
                                  function (callback) {
                                    Fonctionnalite.create({libelle:req.param('libelle-'+i),entree:req.param('entree-'+i),sortie:req.param('sortie-'+i),delai:req.param('delai-'+i),id_application:id_app,supp:0}).exec(function(err,model) {
                                      if (err) console.log(err);
                                      console.log("CREATE FONCTIONNALITE ========================="+i);
                                      callback();
                                    });
                                  }
                                ],function (err, resultsResultat) {
                                  async.parallel(
                                    [
                                      function (callback) {
                                        var option = [];
                                        option.idUser = req.session.user;
                                        option.nomTest = req.param('libelle-'+i);
                                        option.idApplication = id_app;
                                        // insert test to app
                                        Test.createTestAppDemande(option, function(err, tab){
                                          if (err) return res.send(err);
                                          callback(null, tab);
                                        });
                                      }
                                    ],function (err, resultsResultat) {
                                      // insert sous-tache
                                        var option = [];
                                        option.idDemande = idDemande;
                                        option.sousTache = req.param('libelle-'+i);
                                        // insert test to app //
                                        Demande.AjouterSousTacheDemande(option, function(err, tab){
                                          if (err) return res.send(err);
                                          callback(null, tab);
                                        });
                                    }
                                  );
                                }
                              );
                          },
                          function(err){
                            callback(null, 1);
                          }
                        );
                      }
                    ],function (err,resultat) {

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
                            console.log("RESULT EMAIL     "+resultsEmail[3]);
                            console.log("RESULT EMAIL  ROWS   "+resultsEmail[3].rows[0].libelle);

                            var fonctionnaliteApp = resultsEmail[3].rows[0].libelle;

                            async.each(resultsEmail[3].rows, function(resultEm, callback){
                              fonctionnaliteApp = fonctionnaliteApp + ", " +resultEm.libelle;
                              callback();
                            },function(err){
                              console.log(fonctionnaliteApp);
                              var objet = "[fiche - recette] - Demande d'une nouvelle application - "+resultsEmail[2].num_dossier+" - "+application.nom_application; //objet email
                              var message = "Demande d'une nouvelle application \""+application.nom_application+ "\"."+description+". Avec les fonctionnalités: "+fonctionnaliteApp; // message à envoyer
                              console.log("Message email ===> "+message);
                              MailService.fonctionEnvoyerMailDemande(req.session.user, resultsEmail[1], objet, message, application.nom_application, function(err){ // Envoie email
                                if(err) console.log(err);
                                console.log('Here **************************************************************');
                                // fin envoie email
                              });
                              //res.redirect('accueil');
                              res.redirect('demandeIntervention');
                            });
                          });

                    }
                  );

                });
            });
          }
        });
    }
    else {
        var retVal = [];
        console.log(req.param('nom_application',null));
        res.view('application/demandeIntervention', retVal);
    }
  },
  //**************************************  DEMANDE APPLICATION/BUG **********************************************//
  getListeDemandeApplication:function(req,res){
    var filtreDossierValue=req.param("id_dossier","");
    var filtrePersonneDemandeValue=req.param("id_personne_demande","");
    async.series([
      function (callback) {
        Utilisateur.getListeDev(callback);
      },
      function (callback){
        Application.getListeOfDemande(filtreDossierValue,filtrePersonneDemandeValue,callback);
      },
      function (callback){
        Application.getListeOfDemandeUser(req.session.user, callback);
      },
      function (callback){
        Demande.findPriorite(callback);
      },
      function (callback){
        Application.getListeDossier_FiltreListeDemande(callback);
      },
      function (callback){
        Application.getListePersonneDemande_FiltreListeDemande(callback);
      }
    ],function(err,resultat){
      var RetourValues=[];
   //   console.log(resultat[1]);
      RetourValues['Liste_Dev']=resultat[0];
      RetourValues['Demande_Application']=resultat[1];
      RetourValues['Demande_Application_User']=resultat[2];
      RetourValues['priorite']=resultat[3].rows;
      RetourValues['filtreDossier']=resultat[4];
      RetourValues['filtrePersonneDemande']=resultat[5];
      res.view( 'application/LsAppDemande',RetourValues);
    });
  },

  getListeDemandeNouvelleApplication:function(req,res){
    async.series([
      function (callback) {
        Utilisateur.getListeDev(callback);
      },
      function (callback){
        var idUser = req.session.user;
        Application.getListeOfDemandeNewApp(idUser, callback);
      }
    ],function(err,resultat){
      var RetourValues=[];
      RetourValues['Liste_Dev']=resultat[0];
      RetourValues['Liste_demande_new_app']=resultat[1];
      res.view( 'application/LsNewAppDemande',RetourValues);
    });
  },

  assignerDeveloppeurDemandeApplication:function(req,res){
    console.log("ASSIGNER DEVELOPPEUR DEMANDE");


    //var id_pers_dev=req.param('id_pers_dev');
    var id_pers_dev= req.session.user;

    var delai_demande=req.param('delai');
    console.log(" =========================================================>   DELAI  "+delai_demande);

    var id_demande_application=req.param('id_demande');

    var estimation=req.param('estimation');

    var id_application = req.param('id_application');
    var estimation_dev = req.param('estimation');
    var priorite = req.param('priorite');
    async.series([
      function (callback) {
        //,delai='"+delai+"',estimation_dev = '"+estimation+"'
       var requete="UPDATE fr_demande SET id_personne_dev="+id_pers_dev+",id_etat_demande=2, estimation_dev = '"+estimation_dev+"' , id_priorite="+priorite+", delai ='"+delai_demande+"' WHERE id_demande="+id_demande_application;
       Demande.query(requete,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      },
      function (callback) {   //GET Application
        var requeteDemande="select * from fr_application WHERE id_application="+id_application; ///
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      },
      function (callback) {
        var requeteDemande="select * from fr_demande WHERE id_demande="+id_demande_application;
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      }
    ],function(err,resultat){

      var applicationNom = resultat[1].rows[0].nom_application;
        var pers_demande = resultat[2].rows[0].id_personne_demande;
        var pers_dev = resultat[2].rows[0].id_personne_dev;
        //var dll = resultat[2].rows[0].delai;
        var idDemande = resultat[2].rows[0].id_type_intervention;
        console.log('====> ID APP = '+resultat[1].rows[0].id_dossier+'  ID PERS DEMANDE = '+pers_demande+'    ID PERS DEV = '+pers_dev ); //+"     DLL : "+dll

        var idDossier = resultat[2].rows[0].id_dossier;

        async.parallel(
        [
          function (callback) {
            var requeteDemande="select num_dossier from p_dossier WHERE id_dossier="+idDossier;
            Demande.query(requeteDemande,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          },
          function (callback) {
            var requetePersDev="select nom, prenom, appelation from r_personnel WHERE id_pers="+pers_dev; //,delai='"+delai+"'
            Demande.query(requetePersDev,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          },
          function (callback){
            TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention where id_type_intervention = '+idDemande+'', function(err, listeDemande){
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, listeDemande);
            });
          }
        ],function (err, resultsEmail) {
          var numDossier = resultsEmail[0].rows[0].num_dossier;
          var typeInterv = resultsEmail[2];
          //Send mail New application
          var objet = "[fiche - recette] - Demande d'intervention ("+resultsEmail[2].rows[0].libelle+") -"+numDossier+" - "+applicationNom; //objet email
          //var message = "Demande prise en main par "+resultsEmail[1].rows[0].appelation +" (matricule : "+pers_dev+").  DLL: "+dll+" ."; // message à envoyer
          var message = "Demande prise en main par "+resultsEmail[1].rows[0].appelation +" (matricule : "+pers_dev+") .";
          console.log("Message email ===> "+message+"   Objet ===> "+objet);

                 //fonctionEnvoyerMailDemandePris: function(idPersonne, objet, message, next)
          MailService.fonctionEnvoyerMailDemandePris(pers_demande, objet, message, function(err){ // Envoie email
            if(err) console.log(err);
            console.log('Here **************************************************************');
            // fin envoie email
          });
          //Fin send mail
          console.log("ID_DEV=====>"+id_pers_dev);
          console.log("iD DEMANDE APPLICATION====>"+id_demande_application);
          res.redirect('ListeDemandeApp');
      });
    });
  },


  envoyerMailConfirmationDemande: function (req, res)   //MAIL CONFIRMATION DLL ESTIMATION
  {
    if (!req.session.user) return res.redirect('/login');

      var id_demande = "";


      console.log("ENVOYER MAIL CONFIRMATION DDL et ESTIMATION");
      //var id_pers_dev=req.param('id_pers_dev');

      var id_demande_application=req.param('idDemande');

      async.series([
        function (callback) {
          var requeteDemande="select * from fr_demande WHERE id_demande="+id_demande_application;
          Demande.query(requeteDemande,function (err,resultat) {
            if(err) {  console.log(err); res.json(JSON.stringify(err)); }
            callback(null, resultat);
          });
        }
      ],function(err,resultat){

          var id_application = resultat[0].rows[0].id_application;
          async.parallel(
          [
            function (callback) {   //GET Application
              var requeteDemande="select * from fr_application WHERE id_application="+id_application; ///
              Demande.query(requeteDemande,function (err,resultat) {
                if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                callback(null, resultat);
              });
            },
          ],function (err, resultsEmail) {

              var applicationNom = resultsEmail[0].rows[0].nom_application;
              var pers_demande = resultat[0].rows[0].id_personne_demande;

              //estim
              var sec_num = parseInt(resultat[0].rows[0].estimation_dev, 10); // don't forget the second param
              var hours   = Math.floor(sec_num / 3600);
              var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
              var seconds = sec_num - (hours * 3600) - (minutes * 60);

              if (hours   < 10) {hours   = "0"+hours;}
              if (minutes < 10) {minutes = "0"+minutes;}
              if (seconds < 10) {seconds = "0"+seconds;}
              var res =  hours+":"+minutes+":"+seconds;

              var estimation = res;
              //fin estim


              var deadline = resultat[0].rows[0].delai;
              if(resultat[0].rows[0].delai == null){
                deadline = "-";
              }

              var pers_dev = resultat[0].rows[0].id_personne_dev;


              var idDemandeType = resultat[0].rows[0].id_type_intervention;
              //console.log('====> ID APP = '+resultat[0].rows[0].id_dossier+'  ID PERS DEMANDE = '+pers_demande+'    ID PERS DEV = '+pers_dev ); //+"     DLL : "+dll

              var idDossier = resultat[0].rows[0].id_dossier;

              async.parallel(
              [
                function (callback) {
                  var requeteDemande="select num_dossier from p_dossier WHERE id_dossier="+idDossier;
                  Demande.query(requeteDemande,function (err,resultat) {
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, resultat);
                  });
                },
                function (callback) {
                  var requetePersDev="select nom, prenom, appelation from r_personnel WHERE id_pers="+pers_dev; //,delai='"+delai+"'
                  Demande.query(requetePersDev,function (err,resultat) {
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, resultat);
                  });
                },
                function (callback){
                  TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention where id_type_intervention = '+idDemandeType+'', function(err, listeDemande){
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, listeDemande);
                  });
                },
                //get sous_tache
                function (callback){
                  var querySousTache = 'select fr_soustache.temps_passe, fr_soustache.avancement, fr_soustache.delai, fr_soustache.estimation, fr_soustache.libelle_soustache, fr_demande.id_demande '+
                                        'from fr_soustache JOIN fr_demande on fr_soustache.id_demande = fr_demande.id_demande '+
                                        'WHERE fr_demande.id_demande = '+id_demande_application;
                  TypeDemande.query(querySousTache, function(err, listeDemande){   // get sous tache
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, listeDemande);
                  });
                }
              ],function (err, resultsEmail) {
                var numDossier = resultsEmail[0].rows[0].num_dossier;
                var typeInterv = resultsEmail[2];


                var listeSousTache = resultsEmail[3].rows;
                sails.log(listeSousTache);

                //sails.log("ROWS     ===>" + resultsEmail[2=3]);
                var listeSousTacheMail = " ";
                async.each(resultsEmail[3].rows, function(sousTache, callback){
                  var sec_num = parseInt(sousTache.estimation, 10); // don't forget the second param
                  var hours   = Math.floor(sec_num / 3600);
                  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                  var seconds = sec_num - (hours * 3600) - (minutes * 60);

                  if (hours   < 10) {hours   = "0"+hours;}
                  if (minutes < 10) {minutes = "0"+minutes;}
                  if (seconds < 10) {seconds = "0"+seconds;}
                  var res =  hours+":"+minutes+":"+seconds;

                  var estimationSoustache = res;

                    console.log(" paragraphe sous tache ================>"+ sousTache.libelle_soustache);
                    listeSousTacheMail = listeSousTacheMail + "<p> - "+ sousTache.libelle_soustache+" - Estimation: "+estimationSoustache+"</p>";
                });


                //Send mail New application
                var objet = "[fiche - recette] - Demande d'intervention ("+resultsEmail[2].rows[0].libelle+") -"+numDossier+" - "+applicationNom; //objet email
                if( idDemandeType == 4){
                  objet = "[fiche - recette] - Demande d'une nouvelle application - "+numDossier+" - "+applicationNom;
                }

                var message = "Estimation d: "+ estimation +" - Deadline: "+ deadline + " " + listeSousTacheMail;
                console.log("Message email ===> "+message+"   Objet ===> "+objet);

                      //fonctionEnvoyerMailDemandePris: function(idPersonne, objet, message, next)
                MailService.fonctionEnvoyerMailDemandePris(pers_demande, objet, message, function(err){ // Envoie email
                  if(err) console.log(err);
                  console.log('Here **************************************************************');
                  // fin envoie email

                });
                //Fin send mailcls

              });

           });
           res.redirect('back'); ////
      });
    },

 envoyerMailConfirmationDemandeTermine: function (req, res)   //MAIL CONFIRMATION DLL ESTIMATION
  {
    //if (!req.session.user) return res.redirect('/login');

      var id_demande = "";

      console.log("ENVOYER MAIL TERMINE");
      //var id_pers_dev=req.param('id_pers_dev');

      var id_demande_application=req.param('idDemande');
      var cheminApp = req.param('chemin');

      async.series([
        function (callback) {
          var requeteDemande="select * from fr_demande WHERE id_demande="+id_demande_application;
          Demande.query(requeteDemande,function (err,resultat) {
            if(err) {  console.log(err); res.json(JSON.stringify(err)); }
            callback(null, resultat);
          });
        }
      ],function(err,resultat){

          var id_application = resultat[0].rows[0].id_application;
                //update
          var sqlUpdate = 'update fr_demande set id_etat_demande = 3, date_demande_termine = now() where id_demande = '+id_demande_application+' ';
          var sqlUpdateApp = 'update fr_application set chemin = '+cheminApp+' where id_application = '+id_application+' ';

          var idDemandeType = resultat[0].rows[0].id_type_intervention;

          async.parallel(
          [
            function (callback) {   //GET Application
              var requeteDemande="select * from fr_application WHERE id_application="+id_application; ///
              Demande.query(requeteDemande,function (err,resultat) {
                if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                callback(null, resultat);
              });
            },
            function (callback) {
              Demande.query(sqlUpdate, function(err,resultat){
                if (err) return res.send(err);
                console.log("  1 "+sqlUpdate);
                console.log("  1 "+sqlUpdateApp);

                if(idDemandeType == 4){
                  Demande.query(sqlUpdateApp, function(err,resultat){
                    if (err) return res.send(err);
                    console.log("  2 "+sqlUpdateApp);
                    callback(null, resultat);
                  });
                }
                else{
                  callback(null, resultat);
                }
              });
            },
          ],function (err, resultsEmail) {
              var applicationNom = " ";
              if(idDemandeType <= 4){
                applicationNom = resultsEmail[0].rows[0].nom_application;
              }

              var pers_demande = resultat[0].rows[0].id_personne_demande;

              //estim
              var sec_num = parseInt(resultat[0].rows[0].estimation_dev, 10); // don't forget the second param
              var hours   = Math.floor(sec_num / 3600);
              var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
              var seconds = sec_num - (hours * 3600) - (minutes * 60);

              if (hours   < 10) {hours   = "0"+hours;}
              if (minutes < 10) {minutes = "0"+minutes;}
              if (seconds < 10) {seconds = "0"+seconds;}
              var res =  hours+":"+minutes+":"+seconds;

              var estimation = res;
              //fin estim


              var deadline = resultat[0].rows[0].delai;
              if(resultat[0].rows[0].delai == null){
                deadline = "-";
              }

              var pers_dev = resultat[0].rows[0].id_personne_dev;

              //console.log('====> ID APP = '+resultat[0].rows[0].id_dossier+'  ID PERS DEMANDE = '+pers_demande+'    ID PERS DEV = '+pers_dev ); //+"     DLL : "+dll

              var idDossier = resultat[0].rows[0].id_dossier;

              async.parallel(
              [
                function (callback) {
                  var requeteDemande="select num_dossier from p_dossier WHERE id_dossier="+idDossier;
                  Demande.query(requeteDemande,function (err,resultat) {
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, resultat);
                  });
                },
                function (callback) {
                  var requetePersDev="select nom, prenom, appelation from r_personnel WHERE id_pers="+pers_dev; //,delai='"+delai+"'
                  Demande.query(requetePersDev,function (err,resultat) {
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, resultat);
                  });
                },
                function (callback){
                  TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention where id_type_intervention = '+idDemandeType+'', function(err, listeDemande){
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, listeDemande);
                  });
                },
                //get sous_tache
                function (callback){
                  var querySousTache = 'select fr_soustache.temps_passe, fr_soustache.avancement, fr_soustache.delai, fr_soustache.estimation, fr_soustache.libelle_soustache, fr_demande.id_demande '+
                                        'from fr_soustache JOIN fr_demande on fr_soustache.id_demande = fr_demande.id_demande '+
                                        'WHERE fr_demande.id_demande = '+id_demande_application;
                  TypeDemande.query(querySousTache, function(err, listeDemande){   // get sous tache
                    if(err) {  console.log(err); res.json(JSON.stringify(err)); }
                    callback(null, listeDemande);
                  });
                }
              ],function (err, resultsEmail) {

                var numDossier = " ";
                if(idDemandeType <= 4){
                  numDossier = resultsEmail[0].rows[0].num_dossier;
                }


                var typeInterv = resultsEmail[2];


                var listeSousTache = resultsEmail[3].rows;
                sails.log(listeSousTache);

                //sails.log("ROWS     ===>" + resultsEmail[2=3]);
                var listeSousTacheMail = " ";
                async.each(resultsEmail[3].rows, function(sousTache, callback){
                  var sec_num = parseInt(sousTache.estimation, 10); // don't forget the second param
                  var hours   = Math.floor(sec_num / 3600);
                  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                  var seconds = sec_num - (hours * 3600) - (minutes * 60);

                  if (hours   < 10) {hours   = "0"+hours;}
                  if (minutes < 10) {minutes = "0"+minutes;}
                  if (seconds < 10) {seconds = "0"+seconds;}
                  var res =  hours+":"+minutes+":"+seconds;

                  var estimationSoustache = res;

                    console.log(" paragraphe sous tache ================>"+ sousTache.libelle_soustache);
                    listeSousTacheMail = listeSousTacheMail + "<p> - "+ sousTache.libelle_soustache+" - Estimation: "+estimationSoustache+"</p>";
                });

                //Send mail New application
                var message = "Votre demande est terminée. Disponible sur : "+cheminApp;
                var objet = "[fiche - recette] - Demande terminée ("+resultsEmail[2].rows[0].libelle+") -"+numDossier+" - "+applicationNom; //objet email

                if( idDemandeType == 4){
                  objet = "[fiche - recette] - Demande terminé - "+numDossier+" - "+applicationNom;
                  message = "Application créée. Disponible sur : "+cheminApp;
                }

                if( idDemandeType >= 4){
                  objet = "[fiche - recette] - Demande terminé - "+resultsEmail[2].rows[0].libelle;
                  message = "Demande: " +resultsEmail[2].rows[0].libelle+ " terminé.";
                }

                //var message = "Estimation: "+ estimation +" - Deadline: "+ deadline + " " + listeSousTacheMail;
                console.log("Message email ===> "+message+"   Objet ===> "+objet);

                      //fonctionEnvoyerMailDemandePris: function(idPersonne, objet, message, next)
                MailService.fonctionEnvoyerMailDemandePris(pers_demande, objet, message, function(err){ // Envoie email
                  if(err) console.log(err);
                  console.log('Here **************************************************************');
                  // fin envoie email

                });
                //Fin send mailcls

              });

           });
            res.redirect('back'); ////
      });
    },

  updateEtatDemande: function (req, res)   //FIN DEMANDE
  {
    if (!req.session.user) return res.redirect('/login');

    var id = req.param('idDemande');
    var id_app = req.param('idApplication');
    var tempsPasse = req.param('tempsPasse');

    var cheminApp = req.param('chemin'); //chemin app
    var idTypeDemande = req.param('idType');

    console.log("Temps passé ==> "+tempsPasse);
    var sqlUpdate = 'update fr_demande set id_etat_demande = 3, date_demande_termine = now(), temps_passe = '+tempsPasse+' where id_demande = '+id+' ';

    //update app (set chemin)
    var sqlUpdateApp = 'update fr_application set chemin = '+cheminApp+' where id_application = '+id_app+' ';

    console.log("  1 "+sqlUpdate);
    console.log("  1 "+sqlUpdateApp);

    async.series([
      function (callback) {
        /*Demande.query(sqlUpdate, function(err,resultat){
          if (err) return res.send(err);
          console.log("  1 "+sqlUpdate);
          console.log("  1 "+sqlUpdateApp);
          if(idTypeDemande = 4){
            Demande.query(sqlUpdateApp, function(err,resultat){
              if (err) return res.send(err);
              console.log("  2 "+sqlUpdateApp);
              callback(null, resultat);
            });
          }
          else{
            callback(null, resultat);
          }
        });*/
        if(idTypeDemande = 4){
          console.log("  2 "+sqlUpdateApp);
        }
        callback(null, 1);
      },
      function (callback) {   //GET Application
        console.log( "ID APP =================> "+ id_app);
        var requeteDemande="select * from fr_application WHERE id_application="+id_app; ///
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      },
      function (callback) {
        var requeteDemande="select * from fr_demande WHERE id_demande="+id;
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      }
    ],function(err,resultat){
        var applicationNom = resultat[1].rows[0].nom_application;
         var applicationChemin = resultat[1].rows[0].chemin;

        var pers_demande = resultat[2].rows[0].id_personne_demande;
        var pers_dev = resultat[2].rows[0].id_personne_dev;
        var dll = resultat[2].rows[0].delai;
        var idDemande = resultat[2].rows[0].id_type_intervention;
        console.log('====> ID APP = '+resultat[1].rows[0].id_dossier+'  ID PERS DEMANDE = '+pers_demande+'     ID PERS DEV = '+pers_dev +"     DLL : "+dll);

        var idDossier = resultat[2].rows[0].id_dossier;

        async.parallel(
        [
          function (callback) {
            var requeteDemande="select num_dossier from p_dossier WHERE id_dossier="+idDossier;
            Demande.query(requeteDemande,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          },
          function (callback) {
            var requetePersDev="select nom, prenom, appelation from r_personnel WHERE id_pers="+pers_dev; //,delai='"+delai+"'
            Demande.query(requetePersDev,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          },
          function (callback){
            TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention where id_type_intervention = '+idDemande+'', function(err, listeDemande){
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, listeDemande);
            });
          }
        ],function (err, resultsEmail) {

          //send mail
          var numDossier = resultsEmail[0].rows[0].num_dossier;
          var typeInterv = resultsEmail[2];

          var objet = "[fiche - recette] - Demande terminée ("+resultsEmail[2].rows[0].libelle+") -"+numDossier+" - "+applicationNom; //objet email
          var message = "Votre demande est terminée. ";
          if(idDemande = 4){
            objet = "[fiche - recette] - Demande terminé - "+numDossier+" - "+applicationNom;
            message = "Application créée. Disponible sur : "+applicationChemin;
          }
          console.log("Message email ===> "+message+"   Objet ===> "+objet);

          /*MailService.fonctionEnvoyerMailDemandePris(pers_demande, objet, message, function(err){ // Envoie email
            if(err) console.log(err);
            console.log('Here **************************************************************');
            // fin envoie email
          });*/
          //fin send mail

          res.redirect('profil');

        });
    });
    /*Demande.update({id_demande: id},{id_etat_demande:3} ,{date_demande_termine:formatted}).exec(function (err, updated){
      if (err) return res.send(err);
      else return res.redirect('profil');
    });*/
  },




  //*************************************************************************************************
  assignerDeveloppeurDemandeNewApplication:function(req,res){

    console.log("ASSIGNER DEVELOPPEUR DEMANDE NEW");

    //var id_pers_dev=req.param('id_pers_dev');
    var id_pers_dev= req.session.user;

    var delai=req.param('delai');

    console.log(" =========================================================>   DELAI  "+delai);

    var id_demande_application=req.param('id_demande');
    //var delai=req.param('delai');

    //var estimation=req.param('estimation');

    var id_application = req.param('id_application');
    var priorite = req.param('priorite');

    var estimation_dev = req.param('estimation');

    console.log("ID PERS DEV ========================>   "+id_pers_dev);

    var requeteApp="UPDATE fr_application SET id_pers_dev="+id_pers_dev+", demande = false WHERE id_application="+id_application; //,delai='"+delai+"'
    var requeteDemande="UPDATE fr_demande SET id_personne_dev="+id_pers_dev+",id_etat_demande=2, estimation_dev = '"+estimation_dev+"' , id_priorite = "+priorite+", delai ='"+delai+"' WHERE id_demande="+id_demande_application; //,delai='"+delai+"' ,estimation_dev = '"+estimation+"'

    async.series([
      function (callback) {
       Demande.query(requeteApp,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          //else { res.json("ASSIGNATION DEVELOPEUR APPLICATION TERMINé"); }
          callback(null, resultat);
        });
      },
      function (callback){
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          ///else { res.json("ASSIGNATION DEVELOPEUR TERMINEé"); }
          callback(null, resultat);
        });
      },
      function (callback) {   //GET Application
        var requeteDemande="select * from fr_application WHERE id_application="+id_application;
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      },
      function (callback) {
        var requeteDemande="select * from fr_demande WHERE id_demande="+id_demande_application;
        Demande.query(requeteDemande,function (err,resultat) {
          if(err) {  console.log(err); res.json(JSON.stringify(err)); }
          callback(null, resultat);
        });
      }
    ],function(err,resultat){
        var applicationNom = resultat[2].rows[0].nom_application;
        var pers_demande = resultat[3].rows[0].id_personne_demande;
        var pers_dev = resultat[3].rows[0].id_personne_dev;
        var dll = resultat[3].rows[0].delai;
        console.log('====> ID APP = '+resultat[2].rows[0].id_dossier+'  ID PERS DEMANDE = '+pers_demande+'     ID PERS DEV = '+pers_dev); // +"     DLL : "+dll

        var idDossier = resultat[2].rows[0].id_dossier;

        async.parallel(
        [
          function (callback) {
            var requeteDemande="select num_dossier from p_dossier WHERE id_dossier="+idDossier;
            Demande.query(requeteDemande,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          },
          function (callback) {
            var requetePersDev="select nom, prenom, appelation from r_personnel WHERE id_pers="+pers_dev; //,delai='"+delai+"'
            Demande.query(requetePersDev,function (err,resultat) {
              if(err) {  console.log(err); res.json(JSON.stringify(err)); }
              callback(null, resultat);
            });
          }
        ],function (err, resultsEmail) {
          var numDossier = resultsEmail[0].rows[0].num_dossier;
          //Send mail New application
          var objet = "[fiche - recette] - Demande d'une nouvelle application - "+numDossier+" - "+applicationNom; //objet email
          //var message = "Demande prise en main par "+resultsEmail[1].rows[0].appelation +" (matricule : "+pers_dev+").  DLL: "+dll+" ."; // message à envoyer
          var message = "Demande prise en main par "+resultsEmail[1].rows[0].appelation +" (matricule : "+pers_dev+")."; //  DLL: "+dll+" .
          console.log("Message email ===> "+message+"   Objet ===> "+objet);

                 //fonctionEnvoyerMailDemandePris: function(idPersonne, objet, message, next)

          MailService.fonctionEnvoyerMailDemandePris(pers_demande, objet, message, function(err){ // Envoie email
            if(err) console.log(err);
            console.log('Here **************************************************************');
            // fin envoie email
          });
          //Fin send mail
          console.log("ID_DEV=====>"+id_pers_dev);
          console.log("iD DEMANDE APPLICATION====>"+id_demande_application);
          res.redirect('ListeDemandeApp');

        });
    });
  },



  //Update etat demande ===> terminer
  // delete application ******************************************************MODIFIER
  updateEtatDemande1: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idDemande');
    var id_app = req.param('idApplication');
    var tempsPasse = req.param('tempsPasse');
    console.log("Temps passé ==> "+tempsPasse);
    var sqlUpdate = 'update fr_demande set id_etat_demande = 3, date_demande_termine = now(), temps_passe = '+tempsPasse+' where id_demande = '+id+' ';

    async.series([
      function (callback) {
        Demande.query(sqlUpdate, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat){
        res.redirect('profil');
      });
  },

  ModifierEtatDemandeEncours: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var idDemande = req.param('idDemande');
   // var idDossier = req.param('idDossier');
    //var idApplication = req.param('idApplication');
    var description_demande = req.param('description_demande');
    var Delai = req.param('Delai');
    //var typeIntervention = req.param('typeIntervention');
    var temps_passe_dev = req.param('temps_passe_dev');
    var temps_estime = req.param('temps_estime');
//    var tempsPasse = req.param('tempsPasse');
    var Avancement = req.param('avancement');
    var Qualite = req.param('qualite'); 

    var demandeur = req.param('demandeur');
    if(!demandeur){
      demandeur = req.session.user;
    }

    console.log("START RONNY TEST");
 //   console.log("Temps passé ==> "+tempsPasse);


    //// reformulation, estimation_abaque, cahier_test, demonstration
    var reformulation = req.param('reformulation');
    var estimation_abaque = req.param('estimation_abaque');
    var cahier_test = req.param('cahier_test');
    var demonstration = req.param('demonstration');

    var sqlUpdate = "update fr_demande set description='"+escape(description_demande)+"',qualite_dev="+Qualite+
      " ,delai='"+Delai+"',temps_passe="+temps_passe_dev+", id_personne_demande ="+demandeur+", estimation_dev="+temps_estime+",avancement_dev="+Avancement+"," +
      " date_demande_termine = null, id_etat_demande = 2, reformulation = "+reformulation+", estimation_abaque = "+estimation_abaque+",cahier_test = "+cahier_test+",demonstration = "+demonstration+" where id_demande = "+idDemande+"";

    if(Avancement == 100){
      sqlUpdate = "update fr_demande set description='"+escape(description_demande)+"',qualite_dev="+Qualite+
      " ,delai='"+Delai+"',temps_passe="+temps_passe_dev+", id_personne_demande ="+demandeur+", estimation_dev="+temps_estime+",avancement_dev="+Avancement+"," +
      " date_demande_termine = null, id_etat_demande = 3, reformulation = "+reformulation+", estimation_abaque = "+estimation_abaque+",cahier_test = "+cahier_test+",demonstration = "+demonstration+" where id_demande = "+idDemande+"";
    }

    console.log(""+sqlUpdate);

    async.series([
      function (callback) {
        Demande.query(sqlUpdate, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat_retour){
       if(err) return res.send(err);
         res.redirect('AfficherListeTachePris');
    });
  },

  ModifierEtatDemandeStandBy: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    var idDemande = req.param('idDemande');
    var standbyEnCours = req.param('standbyEnCours');

    var sqlUpdate = "update fr_demande set id_etat_demande = 2 where id_demande = "+idDemande+"";

    if(standbyEnCours == 4){
      sqlUpdate = "update fr_demande set id_etat_demande = 4 where id_demande = "+idDemande+"";
    }

    if(standbyEnCours == 5){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      } 
      if (mm < 10) {
        mm = '0' + mm;
      } 
      var todayCR = yyyy +'-' + mm + '-' + dd ;
      sqlUpdate = "UPDATE fr_demande set avancement_dev = 100, date_demande_termine = now(), date_fin_cr = '"+todayCR+"', id_etat_demande = 3 WHERE id_demande="+idDemande+ " ";
    }

    console.log(""+sqlUpdate);

    async.series([
      function (callback) {
        Demande.query(sqlUpdate, function(err,resultat
        ){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat_retour){
       if(err) return res.send(err);
         res.redirect('AfficherListeTachePris');
    });
  },



  AfficherListeTachePris: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START * AfficherListeTachePris * ");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){

            Application.sous_tache=resultat_soustache[0].rows;
           RetourRetour.push(Application);

           next();
         });


       },function (err) {
   // console.log("RETOUR RETOUR"+JSON.stringify(RetourRetour));
         retVal['applications'] = RetourRetour;
         //retVal['layout'] = true;
         retVal['layout'] = false;
         res.view( 'demande/listetache', retVal );
     //    res.json("OKOK");
       });
    });
  },

  AfficherEtatGlobal: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
           next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         //retVal['layout'] = true;
         retVal['layout'] = false;
         res.view( 'etat/etatGlobal', retVal );
       });
    });
  },


  export: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         //retVal['layout'] = true;
         retVal['layout'] = false;
         res.view( 'demande/export', retVal );
       });
    });
  },


  reporting: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         //retVal['layout'] = true;
         retVal['layout'] = false;
         res.view( 'demande/reporting', retVal );
       });
    });
  },

  exportDossier: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= []; 
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         //retVal['layout'] = true;
         retVal['layout'] = false;
         res.view( 'demande/exportDossiers', retVal );
       });
    });
  },

  gantt: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        callback(null, null);
      },
      function (callback) {
        TestApplication.query(reqBug, function(err, bug) {
          retVal["bug"] = bug.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/gantt', retVal );
       });
    });
  },


  ganttDossier: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        callback(null, null);
      },
      function (callback) {
        TestApplication.query(reqBug, function(err, bug) {
          retVal["bug"] = bug.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/ganttDossier', retVal );
       });
    });
  },

  ganttApplication: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        callback(null, null);
      },
      function (callback) {
        TestApplication.query(reqBug, function(err, bug) {
          retVal["bug"] = bug.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/ganttApplication', retVal );
       });
    });
  },

  processusDev: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      function (callback) {
        callback(null, null);
      },
      function (callback) {
        TestApplication.query(reqBug, function(err, bug) {
          retVal["bug"] = bug.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/processusDev', retVal );
       });
    });
  },

  crMois: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
       /* Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          callback(null, resultat);
        });*/
        callback(null, null);
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){
            Application.sous_tache=resultat_soustache[0].rows;
            RetourRetour.push(Application);
            next();
         });

       },function (err) {
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/crMois', retVal );
       });
    });
  },
  getListeDevPers: function(req, res)
  {
    async.series([
      function (callback) {
        Demande.getListeDevPers(null,callback);
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));
    })
  },

  getListeDemandeurPers: function(req, res)
  {
    var is_etat = req.param('is_etat',null);
    async.series([
      function (callback) {
        Demande.getListeDemandeurPers(is_etat,callback);
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));
    })
  },

  getListeTypePriorite: function(req, res)
  {
    async.series([
      function (callback) {
        Demande.getListeTypePriorite(null,callback);
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));
    })
  },

  getListeTypeDemande: function(req, res)
  {
    async.series([
      function (callback) {
        Demande.getListeTypeDemande(null,callback);
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));
    })
  },

  getListeEtatDemande: function(req, res)
  {
    async.series([
      function (callback) {
        Demande.getListeEtatDemande(null,callback);
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));
    })
  },

  AfficherListeTachePrisTab: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var options = [];

    console.log("===========> SQL FILTRE  OPTION DEV  11111111111111111111111111111111111111111111111111111111 "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    //DEBUT + FIN DEMANDE
    var debut = "";
    var fin = "";

    // debut fin
    if(req.param('date_debut',null) != null){
      debut = req.param('date_debut',null);
    }
    if(req.param('date_fin',null) != null){
      fin = req.param('date_fin',null);
    }
    //--------------


    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    options.optionEtatDemande = id_etat_demande;
    options.optionDev = id_dev;
    options.optionDossier = id_dossier;
    options.optionApplication = id_application;
    options.optionDeadline = dead_line;
    options.optionTypeIntervention = id_type_intervention;
    options.optionPriorite = id_priorite;

    options.optionUser = req.session.user;


    options.optionDebut = debut;
    options.optionFin = fin;

    options.optionDemandeur = id_demandeur;

    // fin filtre


    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePris(options, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          //console.log("===========> SQL FILTRE  OPTION DEV  22222222222222222222222222222222222222222222222222222 "+ options.optionDev);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){

            Application.sous_tache=resultat_soustache[0].rows;
           RetourRetour.push(Application);

           next();
         });


       },function (err) {
   // console.log("RETOUR RETOUR"+JSON.stringify(RetourRetour));
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;

         sails.log()
         res.view( 'demande/listetacheTab', retVal );
     //    res.json("OKOK");
       });
    });
  },


  AfficherListeTachePrisTabProd: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    console.log("START RONNY TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var options = [];

    console.log("===========> SQL FILTRE  OPTION DEV  11111111111111111111111111111111111111111111111111111111 "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";



    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    options.optionEtatDemande = id_etat_demande;
    options.optionDev = id_dev;
    options.optionDossier = id_dossier;
    options.optionApplication = id_application;
    options.optionDeadline = dead_line;
    options.optionTypeIntervention = id_type_intervention;
    options.optionPriorite = id_priorite;

    options.optionUser = req.session.user;

    // fin filtre


    async.series([
      //Get Liste Applicatrion Pris
      function (callback) {
        Demande.getListeApplicationDemandePrisProd(options, function(err, resultat){
          if (err) {console.log(err);} //return res.send(err);
     //     console.log(resultat);
          //console.log("===========> SQL FILTRE  OPTION DEV  22222222222222222222222222222222222222222222222222222 "+ options.optionDev);
          callback(null, resultat);
        });
      },
      function (callback) {
    //    console.log("Requete Bug ================>"+reqBug);
        TestApplication.query(reqBug, function(err, bug) {
    //      console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
   //       console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {

        TestApplication.query(reqDev, function(err, dev) {
          retVal["dev"] = dev.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          callback(null, 3);
        })
      }

    ],function(err,resultat){
       RetourApplicationValues=resultat[0];
      var RetourRetour=[];

       async.eachSeries(RetourApplicationValues,function (Application,next){
         async.series ([
           //Get Liste Applicatrion Pris
           function (callback) {
             var SqlListeSous_Tache="select * from fr_soustache where id_demande="+Application.id_demande;
             Demande.query(SqlListeSous_Tache, function (err,resultat) {
               if(err)
               {
                 //  res.send(err);
                 console.log(JSON.stringify(err));
               }
               else
               {
                 callback(null, resultat);
               }
             });
           }
         ],function(err,resultat_soustache){

            Application.sous_tache=resultat_soustache[0].rows;
           RetourRetour.push(Application);

           next();
         });


       },function (err) {
   // console.log("RETOUR RETOUR"+JSON.stringify(RetourRetour));
         retVal['applications'] = RetourRetour;
         retVal['layout'] = false;
         res.view( 'demande/listetacheTab', retVal );
     //    res.json("OKOK");
       });
    });
  },


  AfficherListeTachePrisTabGlobale: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

     //option
      //var option = [];
      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeApplicationDemandePrisGloblale(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  AfficherListeTachePrisTabGlobaleEtat: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

     //option
      //var option = [];
      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeApplicationDemandePrisGloblaleEtat(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  ModifierCommentaireDemande: function(req,res){
    var id_demande= req.param('id_commentaire');
    var commentaire = req.param('commentaire');
    
    async.series([
      function(callback){
        Demande.UpdateCommentaireDemande(commentaire,id_demande,callback);
      }
    ],function (err,result) {
      if(err) return res.ok(''+err);
      return res.json('ok Done');
    })
  },

  //verifier l'existences des fichiers abaques et teste

  verifierFiles: function(req, res){
    var id_demande = parseInt(req.param('id_demande') , 10);
    async.series([
      function(callback){
        Demande.getOneDemande(id_demande, callback);
      }
    ],function(err, result){
      if(err) return res.send(err);
      console.log(result);
      var demande = result[0];
      var abaqueFile = demande[0].abaque;
      var cTestfile = demande[0].file_test;
      if(abaqueFile || cTestfile){
        sails.sockets.blast(req.session.user, {abaqueFile, cTestfile});
      }
      else{
        var ev = String(req.session.user)+"ev";
        console.log("eeeeeeeeeeeeeeeeee" + id_demande);
        sails.sockets.blast(ev, {id_demande});       
      }
      
    })

  },
  

  //****************************      AJOUT SOUS TACHE
  AjouterSousTache: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    var idDemande = req.param('idDemande');
    var sous_tache = req.param('sous_tache');
   // var temp_passe = req.param('temp_passe');
    var estimation = req.param('estimation');
   // var delai= req.param('delai');
    console.log("START RONNY TEST FUNCTION -->AjouterSousTache<-- ");
    var sqlInsertSousTache = "insert into fr_soustache(id_demande,libelle_soustache,temps_passe,avancement,status,estimation) " +
      "VALUES " +
      "("+idDemande+",'"+escape(sous_tache)+"','0',0,'En cours','"+estimation+"')";
    console.log(sqlInsertSousTache);
    async.series([
      function (callback) {
        Demande.query(sqlInsertSousTache, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat){
      res.redirect('AfficherListeTachePris');
    });
  },

  //modifier sous tache
  ModifierSousTache: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    //var idDemande = req.param('idDemande');
    var idSousTache = req.param('idSousTache');
    var avancement = req.param('avancement');
    var temps_estimation_soustache = req.param('estimation_soustache');
    var temps_passe_soustache = req.param('tempspasse_soustache');

    var libelle = req.param('libelle_soustache');
    console.log("LIBELLE SOUS TACHE      =================>>>> " + libelle);

    console.log("START RONNY TEST ModifierSousTache_InsertionCR");
    console.log("Sous tache check ===>"+idSousTache);
    var sqlUpdate = "UPDATE fr_soustache SET temps_passe='"+temps_passe_soustache+"',avancement="+avancement+", estimation = "+temps_estimation_soustache+", libelle_soustache='"+escape(libelle)+"' where id_soustache="+idSousTache;
    console.log("SQL UPDATE SOUS TACHE      =================>>>> " + sqlUpdate);
    async.series([
      function (callback) {
        Demande.query(sqlUpdate, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat_retour){
       if(err) return res.json(err);
         res.redirect('AfficherListeTachePris');
    });
  },

  //supprimer sous tache
  SupprimerSousTache: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    
    var idSousTache = req.param('idSousTache');
    
    var sqlDeleteSousTache = "DELETE from fr_soustache where id_soustache = "+idSousTache+" ";
    var sqlDeleteSousTacheCR = "DELETE from fr_cr where id_sous_tache = "+idSousTache+" ";

    async.series([
      function (callback) {
        Demande.query("select * from fr_soustache where id_soustache = "+idSousTache, function(err,sousTacheFound){
          if (err) return res.send(err);
          callback(null, sousTacheFound);
        });
      }
    ],function(err,resultat_retour){
        var id_demande = resultat_retour[0].rows[0].id_demande;
        var description_demande = resultat_retour[0].rows[0].description;
        var desc= resultat_retour[0].rows[0].libelle_soustache + "["+id_demande+"]"+ " : ["+description_demande+"]";

        async.series([
          function (callback) {
            Demande.query("select * from fr_demande where id_demande = "+id_demande, function(err,demandeFound){
              if (err) return res.send(err);
              callback(null, demandeFound);
            });
          }
        ],function(err,resultat_demande){
          var id_pers_demande = resultat_demande[0].rows[0].id_personne_demande;
          async.series([
            function (callback) {
              SupprDemande.create({id_personne : req.session.user, description : desc, id_personne_demande : id_pers_demande}).exec(function(err,result) {
                if (err) console.log(err);
                callback(null, result);
              });
            },
            function (callback) {
              Demande.query(sqlDeleteSousTache, function(err,resultat){
                if (err) return res.send(err);
                callback(null, resultat);
              });
            },
            function (callback) {
              Demande.query(sqlDeleteSousTacheCR, function(err,resultatCR){
                if (err) return res.send(err);
                callback(null, resultatCR);
              });
            }
          ],function(err,resultat){
            res.redirect('AfficherListeTachePris');
          });
        });
    });
  },

  //supprimer demande
  SupprimerDemandeSousTacheCR: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    
    var idDemande = req.param('idDemande');
    
    var sqlDeleteDemande = "DELETE from fr_demande where id_demande = "+idDemande+" ";
    var sqlDeleteDemandeSousTache = "DELETE from fr_soustache where id_demande = "+idDemande+" ";
    var sqlDeleteDemandeCR = "DELETE from fr_cr where id_demande = "+idDemande+" ";

    async.series([
      function (callback) {
        Demande.query("select * from fr_demande where id_demande = "+idDemande, function(err,demandeFound){
          if (err) return res.send(err);
          callback(null, demandeFound);
        });
      }
    ],function(err,resultat_demande){
      var id_pers_demande = resultat_demande[0].rows[0].id_personne_demande;
      var desc = resultat_demande[0].rows[0].description;
      async.series([
        function (callback) {
          SupprDemande.create({id_personne : req.session.user, description : desc, id_personne_demande : id_pers_demande}).exec(function(err,result) {
            if (err) console.log(err);
            callback(null, result);
          });
        },
        function (callback) {
          Demande.query(sqlDeleteDemande, function(err,resultat){
            if (err) return res.send(err);
            callback(null, resultat);
          });
        },
        function (callback) {
          Demande.query(sqlDeleteDemandeSousTache, function(err,resultatCR){
            if (err) return res.send(err);
            callback(null, resultatCR);
          });
        },
        function (callback) {
          Demande.query(sqlDeleteDemandeCR, function(err,resultatCR){
            if (err) return res.send(err);
            callback(null, resultatCR);
          });
        }
      ],function(err,resultat){
        res.redirect('AfficherListeTachePris');
      });
    });
  },


  //supprimer CR
  SupprimerCR: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    
    var idCR = req.param('idCR');
    
    var sqlDeleteDemandeCR = "DELETE from fr_cr where id_cr = "+idCR+" ";

    async.series([
      function (callback) {
        Demande.query(sqlDeleteDemandeCR, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat_demande){
        res.redirect('profil');
    });
  },


  //*****************************    MODIFIER SOUS TACHE ET   INSERTION CR
  ModifierSousTache_InsertionCR: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    var idDemande = req.param('idDemande');
    var idSousTache = req.param('idSousTache');
    var avancement = req.param('avancement');
    var temps_estimation_soustache = req.param('estimation_soustache');
    var tempspasse_soustache = req.param('tempspasse_soustache');

    console.log("START RONNY TEST ModifierSousTache_InsertionCR");
    console.log("Sous tache check ===>"+idSousTache);
    var sqlUpdate = "UPDATE fr_soustache SET temps_passe='"+tempspasse_soustache+"',avancement="+avancement+" where id_demande="+idDemande+" and id_soustache="+idSousTache;
    console.log(sqlUpdate);
    async.series([
      function (callback) {
        Demande.query(sqlUpdate, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat_retour){
      //*********   GET SUM TEMPS PASSE *********//
     async.series([

       function (callback) {
            var sql_GetSumDate="SELECT SUM(temps_passe::decimal) as somme_temps_passe FROM fr_soustache WHERE fr_soustache.id_demande ="+idDemande;
            console.log("SQL_ gET SUM DATE ===>"+sql_GetSumDate);
         Demande.query(sql_GetSumDate,function(err,resultat_getSumSet){
           
           if (err) return res.send(err);
           callback(null, resultat_getSumSet);
         });
       },
       //*********   GET SUM avancement *********//
       function (callback) {
            var sql_GetAvancement="SELECT count(fr_soustache.id_soustache) as count_avancement,SUM(avancement::integer) as somme_avancement FROM fr_soustache WHERE fr_soustache.id_demande ="+idDemande;
            console.log("SQL get AVANCEMENT ===>"+sql_GetAvancement);
         Demande.query(sql_GetAvancement,function(err,resultat_getSumAvanc){
           if (err) return res.send(err);
           callback(null, resultat_getSumAvanc);
         });
       },
       function (callback) {
            var sql_GetEstimation="SELECT estimation_dev from fr_demande where id_demande="+idDemande;
            console.log("SQL GET ESTIMATION --->"+sql_GetEstimation);
         Demande.query(sql_GetEstimation,function(err,resultat_getEstimation){
           if (err) return res.send(err);
           callback(null, resultat_getEstimation);
         });
       }
     ],function(err,resultat_Fonction_Somme){
         var SommeBDate=resultat_Fonction_Somme[0].rows;
         console.log("Result SommeBDate ===>"+JSON.stringify(SommeBDate));
         var Avancement_Value=resultat_Fonction_Somme[1].rows;
         var Estimation=resultat_Fonction_Somme[2].rows;
         var Somme_Temps_Passe= parseInt(SommeBDate[0].somme_temps_passe.toString());
         var Avancement_Update= parseInt(Avancement_Value[0].somme_avancement.toString())/parseInt(Avancement_Value[0].count_avancement.toString());
         var EstimationControl=parseInt(Estimation[0].estimation_dev.toString());
         console.log("SOMME_TEMPS_PASSE ===>"+Somme_Temps_Passe);
         console.log("AVANCEMENT_UPDATE =====>"+Avancement_Update);

       async.series([
         //**********   FONCTION CHECK TERMINER SOUS TACHE  */
        function (callback){
          if(parseInt(avancement)==100)
          {
            var TerminerSousTache="UPDATE fr_soustache set status='Terminer' where id_soustache="+idSousTache;
            console.log("SQL TERMINER SOUS TACHE --->"+TerminerSousTache);
         Demande.query(TerminerSousTache,function(err,resultat_terminer){
           if (err) return res.send(err);
           callback(null, resultat_terminer);
          });
          }
          else
          {
            callback(null,"OK");
          }
        },
         //*********  INSERT CR *********//
         function (callback) {
           var delai=1;
           var qualite=1 ;
           var semaine=req.param('semaine_cr');
           var tempspasse_CR = req.param('tempspasse_CR');
           var date_cr = req.param('date_cr');
           if(Avancement_Update>100)
           {
             if(temps_estimation_soustache<tempspasse_soustache)
             {
                delai=0;
             }
           }
           
          var sqlInsertCR= "INSERT INTO fr_cr(id_demande,heure,avancement,delai,qualite,semaine,id_sous_tache,date_cr) VALUES ("+idDemande+",'"+tempspasse_CR+"',"+avancement+","+delai+","+qualite+","+semaine+","+idSousTache+",'"+date_cr+"')";
           console.log("SQL INSERT CE ====> "+sqlInsertCR);
           Demande.query(sqlInsertCR, function(err,resultat){
             if (err) return res.send(err);
             callback(null, resultat);
           });
         },
         //*****  UPDATE fr_demande ****//
         function (callback) {
          var date_cr = req.param('date_cr');
           var sqlUpdateDemande= "UPDATE fr_demande set temps_passe='"+Somme_Temps_Passe+"',avancement_dev="+Avancement_Update+" WHERE id_demande="+idDemande;

           if(Avancement_Update == 100){
            sqlUpdateDemande= "UPDATE fr_demande set temps_passe='"+Somme_Temps_Passe+"', avancement_dev="+Avancement_Update+" , date_demande_termine = now() , date_fin_cr = '"+date_cr+"', id_etat_demande = 3 WHERE id_demande="+idDemande;
           }

           console.log("SQL INSERT CE ====> "+sqlUpdateDemande)
           ;
           Demande.query(sqlUpdateDemande, function(err,resultat){
             if (err) return res.send(err);
             callback(null, resultat);
           });
         }
       ],function(err_insertcr,insert_cr){
         if(err_insertcr) return res.json(err_insertcr);
         res.redirect('AfficherListeTachePris');
       });
     });
    });
  },
  //************************  AJOUT TACHE CR
  AjoutCRTache: function (req,res) {
    var idDemande=req.param('idDemande');
    var temps_passe=req.param('temps_passe');
    var temps_estime=req.param('temps_estime');
    var semaine=req.param('semaine');
    var avancement=req.param('avancement');
    var heure_cr=req.param('heure_cr');
    var date_cr=req.param('date_cr');
    async.series([
      function(callback){

        var sqlUpdateDemande= "UPDATE fr_demande set temps_passe='"+temps_passe+"',avancement_dev="+avancement+" WHERE id_demande="+idDemande;
        if(avancement == 100){
          //check delai
          sqlUpdateDemande= "UPDATE fr_demande set temps_passe='"+temps_passe+"',avancement_dev="+avancement+", date_demande_termine = now(), date_fin_cr = '"+date_cr+"', id_etat_demande = 3 WHERE id_demande="+idDemande;
         }

        console.log("SQL UPDATE DEMANDE ====> "+sqlUpdateDemande);
        Demande.query(sqlUpdateDemande, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      },
      function(callback){
        var delai=1;
        if(parseInt(temps_passe)>parseInt(temps_estime))
        {
          delai=0
        }
        var sqlCR= "INSERT INTO fr_cr(id_demande,heure,avancement,delai,qualite,semaine,date_cr) VALUES ("+idDemande+",'"+heure_cr+"',"+avancement+","+delai+",1,"+semaine+", '"+date_cr+"')";
        console.log("SQL INSERT sqlCR ====> "+sqlCR);
        Demande.query(sqlCR, function(err,resultat){
          if (err) return res.send(err);
          callback(null, resultat);
        });
      }
    ],function (error,result_2sqlCRTache) {
      if(error) res.badRequest(error);
      res.redirect('AfficherListeTachePris');
    });

  },

  //Delete demande
  deleteDemande: function (req,res) {
    if (!req.session.user) return res.redirect('/login');
    var idDemande = req.param('idDemande');

    var sqlUpdate = "DELETE from fr_demande where id_demande="+idDemande ;
    console.log(sqlUpdate);
    async.series([
      function (callback) {
        Demande.query("select * from fr_demande where id_demande = "+idDemande, function(err,demandeFound){
          if (err) return res.send(err);
          callback(null, demandeFound);
        });
      }
    ],function(err,resultat_retour){
        var desc= resultat_retour[0].rows[0].description;
        var id_pers_demande = resultat_retour[0].rows[0].id_personne_demande;
        async.series([
          function (callback) {
            SupprDemande.create({id_personne : req.session.user, description : desc, id_personne_demande : id_pers_demande}).exec(function(err,result) {
              if (err) console.log(err);
              callback(null, result);
            });
          },
          function (callback) {
            Demande.query(sqlUpdate, function(err,resultat){
              if (err) return res.send(err);
              callback(null, resultat);
            });
          }
        ],function(err,resultat){
              res.redirect('ListeDemandeApp');
        });

    });
  },

  //Afficher data export
  afficherDataExport: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('etat',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";
    var etat_dossier = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }
    if(req.param('etat',null) != null){
      etat_dossier = req.param('etat',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;
    option.optionEtatDossier = etat_dossier;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataExport(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  //Afficher data export
  afficherDataExportReporting: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('etat',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";
    var etat_dossier = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }
    if(req.param('etat',null) != null){
      etat_dossier = req.param('etat',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;
    option.optionEtatDossier = etat_dossier;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataExportReporting(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  //Afficher data export
  afficherDataCRtotal: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataCRtotal(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  afficherDataExportDossier: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('etat',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";
    var etat_dossier = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }
    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }
    if(req.param('etat',null) != null){
      etat_dossier = req.param('etat',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;
    option.optionEtatDossier = etat_dossier;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataExportDossier(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  //Afficher data export
  afficherDataCRtotal: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataCRtotal(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  afficherDataProcessusTotal: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";
    var id_demandeur = "";
    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataProcessusTotal(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  afficherDataGantt: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataGantt(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },
  
  afficherDataGanttDossier: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataGanttDossier(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  afficherDataGanttApplication: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("START TEST");
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    console.log("dev useer ===>"+idPers);
    var retVal = [];
    var RetourApplicationValues= [];
    var option = [];

    console.log("===========> SQL FILTRE  OPTION DEV  JDK ======================================>  "+ req.param('id_dev',null));

    //Filtre
    var id_etat_demande = "";
    var id_dev = "";
    var id_dossier = "";
    var id_application = "";
    var dead_line = "";
    var id_type_intervention = "";
    var id_priorite = "";

    var id_demandeur = "";

    var debut = "";
    var fin = "";

    if(req.param('id_etat_demande',null) != null){
      id_etat_demande = req.param('id_etat_demande',null);
    }
    if(req.param('id_dev',null) != null){
      id_dev = req.param('id_dev',null);
    }
    if(req.param('id_dossier',null) != null){
      id_dossier = req.param('id_dossier',null);
    }
    if(req.param('id_application',null) != null){
      id_application = req.param('id_application',null);
    }
    if(req.param('dead_line',null) != null){
      dead_line = req.param('dead_line',null);
    }
    if(req.param('id_type_intervention',null) != null){  
      id_type_intervention = req.param('id_type_intervention',null);
    }
    if(req.param('id_priorite',null) != null){
      id_priorite = req.param('id_priorite',null);
    }

    if(req.param('id_demandeur',null) != null){
      id_demandeur = req.param('id_demandeur',null);
    }

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }

    option.optionEtatDemande = id_etat_demande;
    option.optionDev = id_dev;
    option.optionDossier = id_dossier;
    option.optionApplication = id_application;
    option.optionDeadline = dead_line;
    option.optionTypeIntervention = id_type_intervention;
    option.optionPriorite = id_priorite;

    option.optionUser = req.session.user;

    option.optionDebut = debut;
    option.optionFin = fin;

    option.optionDemandeur = id_demandeur;

    // fin filtre

      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Demande.getListeDataGanttApplication(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
  },

  getNombreConge: function(req, res) {
    if (!req.session.user) return res.redirect('/login');

    var option = [];
    var debut = "";
    var fin = "";

    // debut fin
    if(req.param('debut',null) != null){
      debut = req.param('debut',null);
    }
    if(req.param('fin',null) != null){
      fin = req.param('fin',null);
    }
    option.optionDebut = debut;
    option.optionFin = fin;
    option.idPers = req.param('idPers',null)
    // fin filtre

    async.series([
      function (callback) {
        Conge.getNombreConge(option,callback); //
      }
    ],function (err,result) {
      if (err) return res.send("Erreur de requete");
      return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
    })
  },

    uploadFileDemande: async function(req, res){
        var id = parseInt( req.param("iddem") ,10);
        var abaqueFile = req.file("abaque");
        var cTestFile = req.file("cTest");

        if(req.file("abaque") || req.file("cTest")){
            async.series([
                function(callback){
                      fichier = req.file("abaque");
                      fileService.uploadFile(fichier, callback);                 
                },
                function(callback){
                      fichier = req.file("cTest");
                      fileService.uploadFile(fichier, callback);
                }
            ], function(err, resultats){
                if(err) return res.send(err);
                var abaque = resultats[0];
                var cTest = resultats[1];

                console.log("abaque111 : " + abaque + " ;  cahier test111 : " + cTest + " *********************************0");
                Demande.uploadOneDemande(id, abaque, cTest);
                return res.redirect('/AfficherEtatGlobal');

            })
        }
    }
}

    /*
    if(abaqueFile || cTestFile){
        async.series([
            function(callback){
                  fichier = abaqueFile;
                  fileService.uploadFile(fichier, callback);                 
            },
            function(callback){
                  fichier = cTestFile;
                  fileService.uploadFile(fichier, callback);
            }
        ], function(err, resultats){
            if(err) return res.send(err);
            abaque = resultats[0];
            cTest = resultats[1];

            console.log("abaque111 : " + abaque + " ;  cahier test111 : " + cTest + " *********************************0");
            Demande.updateOne({id_demande:id},{abaque:abaque, file_test:cTest}, function up(err){
                if(err) return res.send(err);
                console.log("Tafa");
            })

        })
    }
    */


