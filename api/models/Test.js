/**
 * Test.js
 *
 * @description :: Test: tests des applications
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = ({
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_test', // nom du table qui est associé avec le modele Test
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_test: { //id test test
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_test'
    },

    nom_test: { //id test
      type: 'string',
      required: true,
      unique: true,
      columnName:'nom_test'
    },

    id_type_test: { //type test
      type: 'integer',
      required: true,
      columnName:'id_type_test'
    },

    suppr: { //supprimé ou non
      type: 'boolean',
      columnName:'suppr'
    },
  },

  //inserer test
  //____________________________________________debut fonctionn CREATE test application
  createTestAppDemande: function (option, next)
  {
    var idPers = option.idUser;

    var nomTest = option.nomTest;
    var idTypeTest = 4;
    var idApplication = option.idApplication;

    async.parallel(
      [
        //INSERT NEW TEST
        function (callback) {
          Test.create({nom_test:nomTest,id_type_test:idTypeTest,suppr:false}).exec(function(err,model) {
            if (err) console.log(err);
            console.log("Create TEST");
            callback(null, model);
          })
        }
      ],function (err, results) {
        console.log("RESTULTAT ============> "+results[0]);
        var idTest = results[0].id_test;

        async.parallel(
          [
            //FIND TEST
            function (callback) {
              Test.findOne({id_test : idTest, nom_test: nomTest, id_type_test : idTypeTest}).exec(function(err, testFound) {
                  if(err) console.log(err);
                  callback(null, testFound);
              });
            }
          ],function (err, resultsApp) {

            async.parallel(
              [
                //CREATE RESULTAT
                function (callback) {
                  Resultat.create({id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err,result) {
                      if(err) console.log(err);
                      callback(null, result);
                  });
                }
              ],function (err, resultResultat) {
                var idResultat = resultResultat[0].id_resultat;
                async.parallel(
                  [
                    //FIND RESULTAT
                    function (callback) {
                      Resultat.findOne({id_resultat : idResultat, id_personnel : idPers, resultat : 4, date_debut : null, date_fin: null, commentaire: " "}).exec(function(err, resultatFound) {
                          if(err) console.log(err);
                          callback(null, resultatFound);
                      });
                    }
                  ],function (err, resultatFound) {
                    
                    async.parallel(
                      [
                        //CREATE TEST APPLICATION
                        function (callback) {
                          TestApplication.create({id_test : idTest, id_application : idApplication, id_resultat : idResultat , id_recette: 1}).exec(function(err,model) {
                              if(err) console.log(err);
                              callback(null, model);
                          });
                        }
                      ],function (err, resultatFound) {
            
                        async.parallel(
                          [
                            //FIND TEST APPLICATION
                            function (callback) {
                              TestApplication.findOne({id_test : idTest, id_application : idApplication, id_resultat : idResultat , id_recette: 1}).exec(function(err, testAppFound) {
                                  if(err) console.log(err);
                                  callback(null, testAppFound);
                              });
                            }
                          ],function (err,testApplicationFound) {
                
                            var idTestApp = testApplicationFound[0].id_test_app;
                            async.parallel(
                              [
                                //ASSOCIATION TEST APPLICATION
                                function (callback) {
                                  AssocTestApp.create({id_test_application : idTestApp, id_resultat: idResultat}).exec(function(err,assocTestApp) {
                                      if(err) console.log(err);
                                      callback(null, assocTestApp);
                                  });
                                }
                              ],function (err,assocTestApplicationFound) {
                                next(null, assocTestApplicationFound);
                              }
                            ); 
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );        
  },

  //Fonction get liste test par application
  getTestByApplication: function(idApplication, next) {
    var request = 'SELECT fr_test.id_test,fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test, fr_resultat.date_debut, fr_resultat.date_fin, fr_resultat.id_personnel, r_personnel.nom, r_personnel.prenom, r_personnel.matricule, fr_type_resultat.libelle_type_resultat '+
      'FROM fr_test JOIN fr_assoc_tst_ap_res ON fr_test.id_test = fr_assoc_tst_ap_res.id_test_application '+
      'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
      'JOIN fr_type_resultat ON fr_resultat.resultat = fr_type_resultat.id_type_resultat '+
      'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
      'JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test '+
      'JOIN r_personnel ON fr_resultat.id_personnel = r_personnel.id_pers '+
      'where fr_test_application.id_application = '+idApplication+' and fr_test.suppr = false';
    Test.query(request, function(err, listeTest){
      if(err) next(err);
      next(null, listeTest);
    });
  },
  
  //Fonction get liste test par application sans les résultats des tests
  getTestByApplicationSimple: function(idApplication, next) {
    var request = 'SELECT fr_test.id_test,fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test '+
        'FROM fr_test '+
        'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
        'JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test '+
        'where fr_test_application.id_application = '+idApplication+' and fr_test.suppr = false group by fr_test.id_test,fr_type_test.nom_type_test,fr_test_application.id_test';
    Test.query(request, function(err, listeTest){
      if(err) next(err);
      next(null, listeTest);
    });
  },

  //Fonction get liste test par utilisteur connecté
  getTestByUser: function(idUser, next) {
    var request = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test'+
      ' FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier'+
      ' JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier'+
      ' JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application'+
      ' JOIN fr_test ON fr_test_application.id_test = fr_test.id_test'+
      ' JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test'+
      ' WHERE id_pers='+idUser+' AND id_etat = 0'+
      ' AND fr_application.id_dossier = p_dossier.id_dossier'+
      ' AND fr_application.suppr = false'+
      ' AND fr_application.demande != true'+
      ' AND fr_test.suppr = false order by fr_application.date_ajout desc';
    Test.query(request, function(err, listeTest){
      if(err) next(err);
      next(null, listeTest);
    });
  },

  //Fonction get liste test en attente par utilisateur connecté
  getTestEnAttente: function(idUser, next) {
    var listTestEnAttente = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test, fr_assoc_tst_ap_res.id_test_application, fr_resultat.resultat '+
      'FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier '+
      'JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier '+
      'JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application '+
      'JOIN fr_test ON fr_test_application.id_test = fr_test.id_test '+
      'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
      'JOIN fr_assoc_tst_ap_res ON fr_test_application.id_test = fr_assoc_tst_ap_res.id_test_application '+
      'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
      'WHERE id_pers='+idUser+' AND id_etat = 0 '+
      'AND fr_application.id_dossier = p_dossier.id_dossier '+
      'AND fr_application.suppr = false '+
      'AND fr_application.demande != true '+
      'AND fr_test.suppr = false '+
      'AND fr_resultat.resultat = 4 '+
      'AND fr_test.suppr = false order by fr_test.id_test asc';
    Test.query(listTestEnAttente, function(err, found){
      if(err) next(err);
      next(null, found);
    });
  },

  //Fonction qui retourne un requete (liste test tab)
  getLsTestTabRequete: function(idUser,idDossier, next) {
    var request = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test, get_date_last_test(fr_test.id_test), get_count_test(fr_test.id_test)'+
      ' FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier'+
      ' JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier'+
      ' JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application'+
      ' JOIN fr_test ON fr_test_application.id_test = fr_test.id_test'+
      ' JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test'+
      ' WHERE id_pers='+idUser+' AND id_etat = 0'+
      ' AND fr_application.id_dossier = p_dossier.id_dossier'+
      ' AND fr_application.suppr = false'+
      ' AND fr_application.demande != true'+
      ' AND fr_test.suppr = false order by get_date_last_test(fr_test.id_test) desc NULLS LAST LIMIT 20';
    if(idDossier !== "a"){
      request = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test, get_date_last_test(fr_test.id_test), get_count_test(fr_test.id_test)'+
        ' FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier'+
        ' JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier'+
        ' JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application'+
        ' JOIN fr_test ON fr_test_application.id_test = fr_test.id_test'+
        ' JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test'+
        ' WHERE id_pers='+idUser+' AND id_etat = 0 AND p_dossier.id_dossier = '+idDossier+''+
        ' AND fr_application.id_dossier = p_dossier.id_dossier'+
        ' AND fr_application.suppr = false'+
        ' AND fr_application.demande != true'+
        ' AND fr_test.suppr = false order by get_date_last_test(fr_test.id_test) desc NULLS LAST';
    }
    console.log("REQ TEST 1===> "+request);
    next(null, request);
  },

  //Fonction qui retourne un requete (liste test en attente tab)
  getLsTestAttenteTabRequete: function(idUser,idDossier, next) {
    var listTestEnAttente = 'SELECT distinct p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test, fr_assoc_tst_ap_res.id_test_application, fr_resultat.resultat '+
      'FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier '+
      'JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier '+
      'JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application '+
      'JOIN fr_test ON fr_test_application.id_test = fr_test.id_test '+
      'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
      'JOIN fr_assoc_tst_ap_res ON fr_test_application.id_test = fr_assoc_tst_ap_res.id_test_application '+
      'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
      'WHERE id_pers='+idUser+' AND id_etat = 0 '+
      'AND fr_application.id_dossier = p_dossier.id_dossier '+
      'AND fr_application.suppr = false '+
      'AND fr_application.demande != true '+
      'AND fr_test.suppr = false '+
      'AND fr_resultat.resultat = 4 '+
      'AND fr_test.suppr = false limit 20'; // order by fr_test.id_test asc

    console.log(idDossier !== "a");
    if(idDossier !== "a"){
      listTestEnAttente = 'SELECT distinct p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, fr_test_application.id_test, fr_test.nom_test, fr_type_test.nom_type_test, fr_assoc_tst_ap_res.id_test_application, fr_resultat.resultat '+
        'FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier '+
        'JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier '+
        'JOIN fr_test_application ON fr_application.id_application = fr_test_application.id_application '+
        'JOIN fr_test ON fr_test_application.id_test = fr_test.id_test '+
        'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
        'JOIN fr_assoc_tst_ap_res ON fr_test_application.id_test = fr_assoc_tst_ap_res.id_test_application '+
        'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
        'WHERE id_pers='+idUser+' AND id_etat = 0 '+
        'AND fr_application.id_dossier = p_dossier.id_dossier '+
        'AND fr_application.suppr = false '+
        'AND fr_application.demande != true '+
        'AND fr_test.suppr = false '+
        'AND fr_resultat.resultat = 4 '+
        'AND p_dossier.id_dossier = '+idDossier+' '+
        'AND fr_test.suppr = false';
    }
    next(null, listTestEnAttente);
  },
  
  
  //Fonction retournant un tableau contenant les numéros des fonctionnalités
    getTabTest: function(nb,next) {
      var res = [];
      for(var i = 1; i <= nb; i++) {
        res.push(i);
      }
      next(null, res);
    },
  
});

