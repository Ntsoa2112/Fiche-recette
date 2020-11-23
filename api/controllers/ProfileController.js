/**
 * Created by 8032 on 04/03/2016.ss
 */

module.exports = {
  getApplication: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');

    //Application.getApplicationByUser(req.session.user, function(err, found){
    Application.getCRByUser(req.session.user, function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['applications'] = found.rows;
      retVal['layout'] = false;
      res.view( 'user/profile', retVal );
    });
  },


  //get CR ALL
   getCRAll : function (req,res){
     if (!req.session.user) return res.redirect('/login');

     //option
      var option = [];
      option.user = req.session.user;
      option.num_semaine = req.param("num_semaine");
      option.annee = req.param("annee");

      async.series([
        function (callback) {
          Application.getCRByUser(option,callback); //
        },
        function (callback) {   //get avancement
          Application.getAvancementDemandeAll(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
    },

    //get CR ALL
   getAvancementAll : function (req,res){
     if (!req.session.user) return res.redirect('/login');

     //option
      var option = [];
      option.user = req.session.user;

      async.series([
        function (callback) {   //get avancement
          Application.getAvancementDemandeByUser(option,callback); //
        }
      ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));//retun des categorie du en JSON
      })
    },

  getApplicationPris: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var idPers = parseInt(req.session.user);
    var reqBug = 'select get_count_intervention(1, '+idPers+');';
    var reqDev = 'select get_count_intervention(2, '+idPers+');';
    var reqAss = 'select get_count_intervention(3, '+idPers+');';
    var reqNewApp = 'select get_count_intervention(4, '+idPers+');';

    var retVal = [];

    async.series([
      function (callback) {
        Demande.getListeApplicationDemandePris(req.session.user, function(err, resultat){
           if (err) {console.log(err);} //return res.send(err);
           console.log(resultat);
           callback(null, resultat);
        });
      },
      function (callback) {
        TestApplication.query(reqBug, function(err, bug) {
          console.log("bug");
          //if (err) return res.send(err);
          retVal["bug"] = bug.rows[0].get_count_intervention;
          console.log("bug");
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqDev, function(err, dev) {
          console.log("dev");
          //if (err) return res.send(err);
          retVal["dev"] = dev.rows[0].get_count_intervention;
          console.log("dev");
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqAss, function(err, ass) {
          console.log("ass");
          //if (err) return res.send(err);
          retVal["assistance"] = ass.rows[0].get_count_intervention;
          console.log("ass");
          callback(null, 3);
        })
      },
      function (callback) {
        TestApplication.query(reqNewApp, function(err, newApp) {
          console.log("newApp");
          //if (err) return res.send(err);
          retVal["newApp"] = newApp.rows[0].get_count_intervention;
          console.log("newApp");
          callback(null, 3);
        })
      }
    ],function(err,resultat){
      console.log("Application Pris");
      retVal['applications'] = resultat[0];
      retVal['layout'] = false;
      res.view( 'user/profile', retVal );
    });
  },

};

