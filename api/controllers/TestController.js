/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllerssd
 */

module.exports = {
  //____________________________________________debut fonctionn get liste tes
  findTest: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Test.getTestByUser(req.session.user, function(err, found){
      if(err)return res.send(err);
      var retVal = [];
      retVal['tests'] = found.rows;
      console.log(found.rows);
      res.view( 'test/listeTest', retVal );
    });
  },
  
  
    //____________________________________________debut fonctionn get liste test
  ajoutTests: function(req, res) //multi
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    var retVal = [];
    async.parallel(
    [
      function (callback) {
        Application.findOne(id).exec(function (err, application){
          if (err) return res.negotiate(err);
          callback(null, application);
        });
      },
      function (callback) {
        TypeTest.query('select * from fr_type_test where suppr = false', function(eror, type){
            if (eror) return res.send('erreur 2018');
            callback(null, type);
        });
      },
    ],function (err, results) {
        retVal['applications'] = results[0];
        retVal['types'] = results[1].rows;
        res.view( 'test/ajoutMultiTest', retVal);
    });
    
    /*Test.getTestByUser(req.session.user, function(err, found){
      if(err)return res.send(err);
      var retVal = [];
      retVal['tests'] = found.rows;
      console.log(found.rows);
      res.view( 'test/listeTest', retVal );
    });*/
  },

  //____________________________________________debut fonctionn FIND test dpecifique
  findTestSpecifique: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    Test.query('select fr_test.*, fr_type_test.nom_type_test from fr_test join fr_type_test on fr_test.id_type_test = fr_type_test.id_type_test where fr_type_test.id_type_test = 4 and fr_test.suppr = false', function(err, found){
      if(err) if(err)return res.send(err);
      var retVal = [];
      retVal['users'] = user;
      retVal['tests'] = found.rows;
      res.view( 'test/listeTestSpecifique', retVal );
    });
  },

  //____________________________________________debut fonctionn FIND BY ID
  //fonction qui recherche un test par son id et qui retourne un test
  findTestById: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    Test.findOne(id).exec(function (err, finn) {
      if (err) return res.negotiate(err);
      if (!id) return res.notFound('Could not find sorry.');
      TypeTest.query('select * from fr_type_test', function(eror, type) {
        if (eror) return res.send('erreur 2018'+ eror);
        var retVal = [];
        retVal['tests'] = finn;
        retVal['types'] = type.rows;
        res.view( 'test/modifierTest', retVal );
     });
    });
  },

  //____________________________________________debut fonctionn FIND BY ID (Test specifique)
  //fonction qui recherche un test par son id et qui retourne un test
  findTestSpecById: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    Test.findOne(id).exec(function (err, finn) {
      if (err)return res.negotiate(err);l
      if (!id)return res.notFound('Could not find sorry.');
      var retVal = [];
      retVal['users'] = user;
      retVal['tests'] = finn;
      res.view( 'test/modifierTestSpecifique', retVal );
    });
  },

  //____________________________________________debut fonctionn CREATE test
  createTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var idPers = req.session.user;
    Test.create({nom_test:req.param('nomTest'),id_type_test:req.param('typeTest'),suppr:false}).exec(function(err,model) {
      if (err) return res.send(err);

      Test.findOne({id_test: model.id_test, nom_test: req.param('nomTest'), id_type_test:req.param('typeTest')}).exec(function(err, testFound) {
        if (err) return res.send(err);

        Resultat.create({id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err,result) {
          if (err) return res.send(err);

          Resultat.findOne({id_resultat:result.id_resultat, id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err, resultatFound) {
            if (err) return res.send(err);

            //test application

            console.log("ID Foncationnalité = "+req.param('idFonctionnalite'));
            var idFonction = req.param('idFonctionnalite');
            if(req.param('idFonctionnalite') == 'a'){
              idFonction = 0;
            }

              TestApplication.create({id_test:testFound.id_test, id_application:req.param('idApplication'), id_resultat : resultatFound.id_resultat, id_recette: 1, id_fonctionnalite : idFonction}).exec(function(err,model) {
                if (err) return res.send(err);

                TestApplication.findOne({id_test:testFound.id_test, id_application:req.param('idApplication'), id_resultat : resultatFound.id_resultat, id_recette: 1}).exec(function(err, testAppFound) {
                  if (err) return res.send(err);

                  AssocTestApp.create({id_test_application:testAppFound.id_test_app, id_resultat: resultatFound.id_resultat}).exec(function(err,assocTestApp) {
                    if (err) return res.send(err);

                    res.redirect('/listeTest');
                });
              });
            });
          });
        });
      });
    });
  },


  //____________________________________________debut fonctionn CREATE test application
  createTestApp: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var idPers = req.session.user;
    Test.create({nom_test:req.param('nomTest'),id_type_test:req.param('typeTest'),suppr:false}).exec(function(err,model) {
      if (err) return res.send(err);

      Test.findOne({id_test: model.id_test, nom_test: req.param('nomTest'), id_type_test:req.param('typeTest')}).exec(function(err, testFound) {
        if (err) return res.send(err);

        //resultat
        Resultat.create({id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err,result) {
          if (err) return res.send(err);

          Resultat.findOne({id_resultat:result.id_resultat, id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err, resultatFound) {
            if (err) return res.send(err);

            //test application
            TestApplication.create({id_test:testFound.id_test, id_application:req.param('idApplication'), id_resultat : resultatFound.id_resultat, id_recette: 1}).exec(function(err,model) {
              if (err) return res.send(err);

              TestApplication.findOne({id_test:testFound.id_test, id_application:req.param('idApplication'), id_resultat : resultatFound.id_resultat, id_recette: 1}).exec(function(err, testAppFound) {
                if (err) return res.send(err);

                AssocTestApp.create({id_test_application:testAppFound.id_test_app, id_resultat: resultatFound.id_resultat}).exec(function(err,assocTestApp) {
                  if (err) return res.send(err);

                  res.redirect('/appById?id='+req.param('idApplication'));
                });
              });
            });
          });
        });
      });
    });
  },
  
   //____________________________________________debut fonctionn CREATE test application
  createTestAppMulti: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var idPers = req.session.user;
    var nb_test = req.param('nb_test');
    console.log("Nombre fonctionnalité ================> "+nb_test);
    async.parallel(     ///ASYNC 1
    [
      function (callback) {
        //get tableau num TEST
        Test.getTabTest(nb_test, function(err, tab){
          if (err) return res.send(err);
          callback(null, tab);
        });
      },
    ],function (err, results) {
        console.log("RASULTAT TABLEAU ===> "+results[0]);
        var tabFonct = results[0];
        console.log("entree =========================");
        async = require("async");
        async.each(tabFonct, function(i, callback){    ///foreach
              async.parallel(    ///ASYNC 3
              [
                function (callback) {
                  Test.create({nom_test:req.param('nomTest-'+i),id_type_test:req.param('typeTest-'+i),suppr:false}).exec(function(err,model) {
                    if (err) return res.send(err);
                    console.log("CREATE TEST ========================="+i);
                    callback(null, model);
                  }); 
                },
              ],function (err, results1) {
                  async.parallel(     ///ASYNC 4
                  [
                    function (callback) { //Find one test
                      Test.findOne({id_test: results1[0].id_test, nom_test: req.param('nomTest-'+i), id_type_test:req.param('typeTest-'+i)}).exec(function(err, testFound) {
                        if (err) return res.send(err);
                        console.log("FIND ONE");
                        callback(null, testFound);
                      });
                    },
                    function (callback) {         //resultat
                      Resultat.create({id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err,result) {
                        if (err) return res.send(err);
                          console.log("CREATE RESULTAT");
                          callback(null, result);
                        });
                      },
                  ],function (err, results2) {
                    async.parallel(   ///ASYNC 5
                    [
                      function (callback) {
                        Resultat.findOne({id_resultat:results2[1].id_resultat, id_personnel:idPers, resultat: 4,date_debut: null, date_fin: null, commentaire: " "}).exec(function(err, resultatFound) {
                          if (err) return res.send(err);
                           console.log("FIND ONE RESULTAT");
                          callback(null, resultatFound);
                        });
                      },
                    ],function (err, results3) {
                      async.parallel(  ///ASYNC 5
                      [
                        function (callback) {
                          //test application
                          TestApplication.create({id_test:results2[0].id_test, id_application:req.param('idApplication'), id_resultat : results3[0].id_resultat, id_recette: 1}).exec(function(err,model) {
                            if (err) return res.send(err);
                             console.log("CREATE TEST APP");
                            callback(null, 1);
                          });
                        },
                        function (callback) {
                          TestApplication.findOne({id_test:results2[0].id_test, id_application:req.param('idApplication'), id_resultat : results3[0].id_resultat, id_recette: 1}).exec(function(err, testAppFound) {
                            if (err) return res.send(err);
                             console.log("FIND ONE TEST APP");
                            callback(null, 1);
                          });
                        },
                      ],function (err, results4) {
                        AssocTestApp.create({id_test_application:results4[1].id_test_app, id_resultat: results3[0].id_resultat}).exec(function(err,assocTestApp) {
                          if (err) return res.send(err);
                          callback();
                          //console.log("END");
                          //res.redirect('/appById?id='+req.param('idApplication'));
                        });
                      });
                    });
                  });
              });
          },
          function(err){
            //res.redirect('/appById?id='+req.param('idApplication'));
          }
        );      
    });   
  },

  //____________________________________________debut fonctionn ajout test ====> vers page ajout test commun
  ajoutTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var retVal = [];
    Etape.query('select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape order by id_lien', function(eror, etape) {
      if (eror) return res.send(eror);

      TypeTest.query('select * from fr_type_test where suppr = false', function(eror, type) {
        if (eror) return res.send(eror);
        var retVal = [];
        retVal['types'] = type.rows;
        retVal['etapes'] = etape.rows;
        res.view( 'test/ajoutTestCommun', retVal);
      });
    });
  },


  //____________________________________________debut fonctionn CREATE SPECIFIQUE
  //fonction pour ajouter un test spÃ©cifique Ã  une application
  createTestSpec: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var nomTest = req.param('nomTest');
    var typeTest = req.param('typeTest');
    Test.create({nom_test:nomTest,id_type_test:typeTest,id_etape:req.param('etapeTest')}).exec(function(err,model) {
      if (err) return res.send(err);

        Test.findOne({nom_test: nomTest, id_type_test:typeTest}).exec(function(err, found) {
          if (err) return res.send(err);
          var resultat = null;
          TestApp.create({id_test:found.id_test, id_application:req.param('idApplication'), id_resultat:resultat}).exec(function(err,model) {
            if (err) return res.send(err);
            res.redirect('/appById?id='+req.param('idApplication'));
          });
        });
    });
  },


  //____________________________________________debut fonctionn UPDATE
  updateTest: function (req, res)
  {
    console.log('Fonction update test ****************************** ');
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();
    var id = params.id_test;
    Test.update({id_test: id}, params).exec(function (err, model) {
      if (err) return res.send(err);
      return res.redirect('listeTest');
    });
  },

  //____________________________________________debut fonctionn UPDATE test specifique
  updateTestSpec: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();
    var id = params.id_test;
    Test.update({id_test: id}, params).exec(function (err, model) {
      if (err) res.send("Error:".err);
      else return res.redirect('listeTestSpecifique');
    });
  },

  deleteTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idTest');
    Test.update({id_test: id},{suppr:true}).exec(function (err, updated){
      if (err) return res.send(err);
      return res.redirect('listeTest');
    });
  },

  assignerTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var retVal = [];
    Etape.query('select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape order by id_lien', function(eror, etape) {
      if (eror) return res.send(eror);

      TypeTest.query('select * from fr_type_test', function(eror, type) {
        if (err) return res.send(eror);
        var retVal = [];
        retVal['types'] = type.rows;
        retVal['etapes'] = etape.rows;
        res.view( 'test/assignerTest', retVal);
      });
    });
  },

};

