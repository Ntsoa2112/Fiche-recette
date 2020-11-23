/**
 * Created by 8032 on 08/04/2016.
 */
module.exports = {
  //_________________________________________________debut SendDATA
  //fonction qui retourne les data necessaire dans dashboard
  sendData: function (req, res) {
    if (!req.session.user) return res.redirect('/login');

    //req.session.user = 177;
    var retVal = [];
    var idPers = parseInt(req.session.user);
    var idDossier = req.param('idDossier',null);

    var queryValideApp = 'select get_count_resultat(1, '+idPers+')';
    var queryNonValideApp = 'select get_count_resultat(2, '+idPers+')';
    var queryAttenteApp = 'select get_count_resultat(3, '+idPers+')';
    var queryNonTesteApp = 'select get_count_resultat(4, '+idPers+')';

    var queryValideTest = 'select get_count_resultat_sp(1)';
    var queryNonValideTest = 'select get_count_resultat_sp(2)';
    var queryAttenteTest = 'select get_count_resultat_sp(3)';


    async.parallel(
      [
        // pour les applications
        function (callback) {
          TestApplication.query(queryValideApp, function(err, valide) {
            //console.log(rows);
            //if (err) return res.send(err);
            retVal["valide"] = valide.rows[0].get_count_resultat;
            console.log("valide");
            callback(null, 3);
          })
        },
        function (callback) {
          TestApplication.query(queryNonValideApp, function(err, nonValide) {
            console.log("nonValide");
            //if (err) return res.send(err);
            retVal["nonValide"] = nonValide.rows[0].get_count_resultat;
            console.log("nonValide");
            callback(null, 3);
          })
        },
        function (callback) {
          TestApplication.query(queryAttenteApp, function(err, attente) {
            console.log("attente");
            //if (err) return res.send(err);
            retVal["attente"] = attente.rows[0].get_count_resultat;
            console.log("attente");
            callback(null, 3);
          })
        },
        function (callback) {
          TestApplication.query(queryNonTesteApp, function(err, nonTeste) {
            console.log("nonTeste");
            //if (err) return res.send(err);
            retVal["nonTeste"] = nonTeste.rows[0].get_count_resultat;
            console.log("nonTeste");
            callback(null, 3);
          })
        },

        // pour les test
        function (callback) {
          TestApplication.query(queryValideTest, function(err, valideTest) {
            console.log("nonTeste");
            //if (err) return res.send(err);
            retVal["valideTest"] = valideTest.rows[0].get_count_resultat;
            console.log("valideTest");
            callback(null, 3);
          })
        },
        function (callback) {
          TestApplication.query(queryNonValideTest, function(err, nonValideTest) {
            //if (err) return res.send(err);
            retVal["nonValideTest"] = nonValideTest.rows[0].get_count_resultat;
            console.log("nonValideTest");
            callback(null, 3);
          })
        },
        function (callback) {
          TestApplication.query(queryAttenteTest, function(err, attenteTest) {
            console.log(attenteTest);
            if (err) return res.send(err);
            retVal["attenteTest"] = attenteTest.rows[0].get_count_resultat;
            console.log("attenteTest");
            callback(null, 3);
          })
        },
        function (callback) {
          Test.getTestEnAttente(req.session.user, function(err, found){
            //if (err) return res.send(err);
            retVal['tests'] = found.rows;
            console.log("tests");
            callback(null, 3);
          })
        }
      ],
      function (err, results) {
        console.log(results);
        retVal['listNotif'] = req.session.listNotif ;
        retVal['nbNotif'] = req.session.nbNotif;
        res.view('dashboard', retVal);
      }
    );
  },

  //get liste etape par dossier
  getLsEtape: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idDossier = req.param('idDossier',null);
    console.log("id dossier ======>  "+idDossier);
    Etape.getListeEtapeDossier(idDossier, function(eror, test) {
      console.log("Test ======>  "+test);
      var str = '<option value=""></option>';
       if (eror)return res.send('erreur 2018');
       for(var i=0 ; i< test ; i++){
         str += '<option value=' +test.rows[i].id_lien +'>' + test.rows[i].libelle  +'</option>';
       }
      return res.send(str);
    });
  },

  getLsDossier: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idPers = req.session.user;
     Dossier.getListeDossierPersonne(idPers, function(eror, test){
     console.log( "taile ============================> "+test.rows.length );
     var str = '<option value="a"></option>';
     if (eror) return res.send('erreur 2018');
     for(var i=0 ; i< test.rows.length ; i++){
       str += '<option value=' +test.rows[i].id_dossier +'>' + test.rows[i].num_dossier  +'</option>';
     }
     return res.send(str);
   });
    /*async.parallel(
      [
        // pour les applications
        function (callback) {
          Dossier.getListeDossierPersonne(idPers, function(eror, test){
            console.log( "taile ============================> "+test.rows.length );
            if (eror) console.log('erreur 2018');
            callback(null, 0);
          });
        }
      ],
      function (err, results) {
        console.log(results[0]);
        console.log("Length   "+results[0].length);
        var str = '<option value="a"></option>';
        for(var i=0 ; i< results[0].length ; i++){
          str += '<option value=' +results[0].rows[i].id_dossier +'>' + results[0].rows[i].num_dossier  +'</option>';
        }
        return res.send(str);
      }
    );*/
  },

  getLsApplication: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idDossier = req.param('idDossier',null);
    Etape.query('SELECT * from fr_application where id_dossier = '+idDossier+' and suppr = false and demande != true ', function(eror, test) {
      var str = '<option value="a"></option>';
      if (eror) return res.send('erreur 2018');
      for(var i=0 ; i< test.rows.length ; i++){
        str += '<option value=' +test.rows[i].id_application +'>' + test.rows[i].nom_application  +'</option>';
      }
      return res.send(str);
    });
  },

  getLsFonctionnalite: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idApplication = req.param('idApplication',null);
    Etape.query('SELECT * from fr_fonctionnalite where id_application = '+idApplication+'', function(eror, test) {
      var str = '<option value="a"></option>';
      if (eror) return res.send('erreur');
      for(var i=0 ; i< test.rows.length ; i++){
        str += '<option value=' +test.rows[i].id_fonctionnalite +'>' + test.rows[i].libelle  +'</option>';
      }
      return res.send(str);
    });
  },

//tableau liste app
  getLsApplicationTab: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idDossier = req.param('idDossier',null);
    Application.getLsApplicationTabRequete(req.session.user, idDossier, function(eror, requete){
      if (eror) return res.send(eror);
      Etape.query(requete, function(eror, test) {
        var str = '';
        if (eror) return res.send(eror);
        var disable = "";
        if(req.session.droit == 0) {
          disable = "hidden";
        }
        var retVal = [];
        retVal['tests'] = test.rows;
        res.view( 'application/LsApplicationTab', retVal);
      });
    });
  },

  //tableau liste app
  getLsTestTab: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    Test.getLsTestTabRequete(req.session.user, req.param('idDossier',null), function(eror, requete){
      Etape.query(requete, function(eror, test){
        console.log("REQ TEST 2 ===> "+requete);
        var str = '';
        if (eror)return res.send(eror);
        var disable = "";
        if(req.session.droit == 0) {
          disable = "hidden";
        }
        var retVal = [];
        retVal['tests'] = test.rows;
        res.view( 'test/LsTestTab', retVal);
      });
    });
  },

  //tableau liste app
  getStat: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    var idDossier = req.param('idDossier',null);
    var idPers = parseInt(req.session.user);

    var queryValideApp = 'select get_count_resultat(1, '+idPers+')'; //app
    var queryNonValideApp = 'select get_count_resultat(2, '+idPers+')';
    var queryAttenteApp = 'select get_count_resultat(3, '+idPers+')';

    var queryValideAppTest = 'select get_count_resultat_sp(1, '+idPers+')'; //test
    var queryNonValideAppTest = 'select get_count_resultat_sp(2, '+idPers+')';
    var queryAttenteAppTest = 'select get_count_resultat_sp(3, '+idPers+')';

    var numDossierTemp;

    if(idDossier !== "a"){
      queryValideApp = 'select get_count_resultat_dossier(1, '+idPers+', '+idDossier+')'; //app
      queryNonValideApp = 'select get_count_resultat_dossier(2, '+idPers+', '+idDossier+')';
      queryAttenteApp = 'select get_count_resultat_dossier(3, '+idPers+', '+idDossier+')';

      queryValideAppTest = 'select get_count_resultat_sp_dossier(1,'+idPers+', '+idDossier+')'; //test
      queryNonValideAppTest = 'select get_count_resultat_sp_dossier(2,'+idPers+', '+idDossier+')';
      queryAttenteAppTest = 'select get_count_resultat_sp_dossier(3,'+idPers+', '+idDossier+')';

      /*Dossier.findOne({id_dossier: idDossier}).exec(function (err, dossier){
        if (err) return res.negotiate(err);
        console.log("Temp dossier 1 =====> " + dossier.num_dossier);
        numDossierTemp = dossier.num_dossier;
      });*/
    }
    async.parallel(
      [
        // pour les applications
        function (callback) {
          TestApplication.query(queryValideApp, function(err1, valide){
            if (err1) return res.send(err1);
            console.log("valide " + valide.rows[0].get_count_resultat);
            callback(null, valide);
          })
        },
        function (callback) {
          TestApplication.query(queryNonValideApp, function(err2, nonValide){ //application non validé
            if (err2) return res.send(err2);
            console.log("non valide " +nonValide.rows[0].get_count_resultat);
            callback(null, nonValide);
          })
        },
        function (callback) {
          TestApplication.query(queryAttenteApp, function(err3, attente){ //application en attente de validation
            if (err3) return res.send(err3);
            console.log("en attente " + attente.rows[0].get_count_resultat);
            callback(null, attente);
          })
        },
        function (callback) {
          TestApplication.query(queryValideAppTest, function(err1, valideTest){ //Test
            if (err1) return res.send(err1);
            console.log("valide test " +valideTest.rows[0].get_count_resultat_sp);
            callback(null, valideTest);
          })
        },
        function (callback) {
          TestApplication.query(queryNonValideAppTest, function(err2, nonValideTest){ //application non validé
            if (err2) return res.send(err2);
            console.log("non valide test "+nonValideTest.rows[0].get_count_resultat_sp);
            callback(null, nonValideTest);
          })
        },
        function (callback) {
          TestApplication.query(queryAttenteAppTest, function(err3, attenteTest){ //application en attente de validation
            if (err3) return res.send(err3);
            console.log("en attente test "+attenteTest.rows[0].get_count_resultat_sp);
            callback(null, attenteTest);
          })
        },
      ],
      function (err, results) {
        console.log(" TEST +===============================> "+results[0].rows[0].get_count_resultat);
        console.log(" TEST +===============================> "+results[1].rows[0].get_count_resultat);
        console.log(" TEST +===============================> "+results[2].rows[0].get_count_resultat);
        console.log(" TEST +===============================> "+results[3].rows[0].get_count_resultat_sp);
        console.log(" TEST +===============================> "+results[4].rows[0].get_count_resultat_sp);
        console.log(" TEST +===============================> "+results[5].rows[0].get_count_resultat_sp);
        
        var valide = results[0]; //Application
        var nonValide = results[1];
        var attente = results[2];
        
        var valideTest = results[3]; //Test
        var nonValideTest = results[4];
        var attenteTest = results[5];
        
        var str = '';
        var valideS = valide.rows[0].get_count_resultat;
        var nonValideS = nonValide.rows[0].get_count_resultat;
        var attenteS = attente.rows[0].get_count_resultat;

        var valideT = valideTest.rows[0].get_count_resultat_sp;
        var nonValideT = nonValideTest.rows[0].get_count_resultat_sp;
        var attenteT = attenteTest.rows[0].get_count_resultat_sp;

        var numeroDossier = "Tableau de bord";
        if(idDossier !== "a"){
          Dossier.findOne({id_dossier: idDossier}).exec(function (err, dossier){
            if (err) return res.negotiate(err);
            console.log("Temp dossier 1 =====> " + dossier.num_dossier);
            numeroDossier = dossier.num_dossier;
            /*console.log(" Différent de 'a' ==============> TEMP "+numDossierTemp);
            numeroDossier = numDossierTemp;*/
            valideS = valide.rows[0].get_count_resultat_dossier;
            nonValideS = nonValide.rows[0].get_count_resultat_dossier;
            attenteS = attente.rows[0].get_count_resultat_dossier;

            valideT = valideTest.rows[0].get_count_resultat_sp_dossier;
            nonValideT = nonValideTest.rows[0].get_count_resultat_sp_dossier;
            attenteT = attenteTest.rows[0].get_count_resultat_sp_dossier;
          });
          
        }
         
        console.log("Temp dossier 2 =====> " + numeroDossier);
         
        var retVal = [];
        retVal['valideApp'] = valideS; //appli
        retVal['nonValideApp'] = nonValideS;
        retVal['attenteApp'] = attenteS;

        retVal['valideTest'] = valideT; //test
        retVal['nonValideTest'] = nonValideT;
        retVal['attenteTest'] = attenteT;

        retVal['numeroDossier'] = numeroDossier;

        str += '<form><input id="valideStat" name="valideStat" value = '+ valideS +'>'; // type="hidden"
        str += '<input id="nonValideStat" name="nonValideStat" value = '+ nonValideS +'>';
        str += '<input id="attenteStat" name="attenteStat" value = '+ attenteS +'></form>';
        res.view( 'DashboardStat', retVal);
      }
    );
     
    /*TestApplication.query(queryValideApp, function(err1, valide){
      if (err1) return res.send(err1);

      TestApplication.query(queryNonValideApp, function(err2, nonValide){ //application non validé
        if (err2) return res.send(err2);

        TestApplication.query(queryAttenteApp, function(err3, attente){ //application en attente de validation
          if (err3) return res.send(err3);

            TestApplication.query(queryValideAppTest, function(err1, valideTest){ //Test
              if (err1) return res.send(err1);

              TestApplication.query(queryNonValideAppTest, function(err2, nonValideTest){ //application non validé
                if (err2) return res.send(err2);

                TestApplication.query(queryAttenteAppTest, function(err3, attenteTest){ //application en attente de validation
                  if (err3) return res.send(err3);

                  var str = '';
                  var valideS = valide.rows[0].get_count_resultat;
                  var nonValideS = nonValide.rows[0].get_count_resultat;
                  var attenteS = attente.rows[0].get_count_resultat;

                  var valideT = valideTest.rows[0].get_count_resultat_sp;
                  var nonValideT = nonValideTest.rows[0].get_count_resultat_sp;
                  var attenteT = attenteTest.rows[0].get_count_resultat_sp;

                  var numeroDossier = "Tableau de bord";
                  if(idDossier !== "a"){
                    console.log(" Différent de 'a' ==============> TEMP "+numDossierTemp);
                    numeroDossier = numDossierTemp;
                    valideS = valide.rows[0].get_count_resultat_dossier;
                    nonValideS = nonValide.rows[0].get_count_resultat_dossier;
                    attenteS = attente.rows[0].get_count_resultat_dossier;

                    valideT = valideTest.rows[0].get_count_resultat_sp_dossier;
                    nonValideT = nonValideTest.rows[0].get_count_resultat_sp_dossier;
                    attenteT = attenteTest.rows[0].get_count_resultat_sp_dossier;
                  }

                  var retVal = [];
                  retVal['valideApp'] = valideS; //appli
                  retVal['nonValideApp'] = nonValideS;
                  retVal['attenteApp'] = attenteS;

                  retVal['valideTest'] = valideT; //test
                  retVal['nonValideTest'] = nonValideT;
                  retVal['attenteTest'] = attenteT;

                  retVal['numeroDossier'] = numeroDossier;

                  str += '<form><input id="valideStat" name="valideStat" value = '+ valideS +'>'; // type="hidden"
                  str += '<input id="nonValideStat" name="nonValideStat" value = '+ nonValideS +'>';
                  str += '<input id="attenteStat" name="attenteStat" value = '+ attenteS +'></form>';
                  res.view( 'DashboardStat', retVal);
             });
            });
          });
        });
      });
    });*/
  },

  //tableau liste test en attente
  getLsTestTabAttente: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    async.parallel(
      [
        function (callback) {
          Test.getLsTestAttenteTabRequete(req.session.user, req.param('idDossier',null), function(eror, requete){
            if (eror) console.log(eror);
            callback(null, requete);
          })
        }
      ],
      function (err, results) {
        Etape.query(results[0], function(eror, test){
          var str = '';
          if (eror)return res.send(eror);
            var retVal = [];
            retVal['tests'] = test.rows;
            res.view( 'test/LsTestTabAttente', retVal);
        });
      }
    );
    /*Test.getLsTestAttenteTabRequete(req.session.user, req.param('idDossier',null), function(eror, requete){
      Etape.query(requete, function(eror, test){
        var str = '';
        if (eror)return res.send(eror);
          var retVal = [];
          retVal['tests'] = test.rows;
          res.view( 'test/LsTestTabAttente', retVal);
      });
    });*/
  },
}

// récupération nombre de test par application
/*var nombreTestTableau = [];
 for(var i = 0; i < test.rows.length; i++){
 console.log("id application ==> "+test.rows[i].id_application);
 Application.query('SELECT get_count_test_application('+test.rows[i].id_application+')', function(err, nombreTest){
 if(err){
 console.log(err);
 }
 nombreTestTableau.push(nombreTest.rows[0].get_count_test_application);
 //console.log("nombre test Tableau ==> "+nombreTestTableau[5]);

 //console.log('Taille nombreTestTableau ==>  '+nombreTestTableau.length);
 });
 }*/
//fin récupération
