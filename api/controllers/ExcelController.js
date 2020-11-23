/**
 * Created by 8032 on 04/07/2016.
 */
module.exports = {
  createExcel: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("FONCTION TO EXCEL ********************************************************************")
      var nodeExcel=require('excel-export');
      var conf={}
      conf.cols=[{
          caption:'TEST',
          type:'string',
          width:150
        },
        {
          caption:'TYPE TEST',
          type:'string',
          width:150
        },
        {
          caption:'TESTEUR',
          type:'string',
          width:150
        },
        {
          caption:'DEBUT',
          type:'string',
          width:150
        },
        {
          caption:'FIN',
          type:'string',
          width:150
        },
        {
          caption:'DUREE',
          type:'string',
          width:150
        },
        {
          caption:'RESULTAT',
          type:'string',
          width:150
        }
      ];

      var id = req.param('idApplication');
      var nomApp = req.param('nomApplication'); // variable pour recuperer le nom d l'application
      console.log("id APPLICATION   ===============================> "+id);
      console.log("nom APPLICATION   ===============================> "+nomApp);

      var queryApp = 'SELECT fr_test.id_test,fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test, fr_resultat.date_debut, fr_resultat.date_fin, fr_resultat.id_personnel, r_personnel.nom, r_personnel.prenom, r_personnel.matricule, fr_type_resultat.libelle_type_resultat '+
        'FROM fr_test JOIN fr_assoc_tst_ap_res ON fr_test.id_test = fr_assoc_tst_ap_res.id_test_application '+
        'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
        'JOIN fr_type_resultat ON fr_resultat.resultat = fr_type_resultat.id_type_resultat '+
        'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
        'JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test '+
        'JOIN r_personnel ON fr_resultat.id_personnel = r_personnel.id_pers '+
        'where fr_test_application.id_application = '+id+' and fr_test.suppr = false';
      console.log("Request   ===============================> "+queryApp);
      Application.query(queryApp, function(error, app){
        if (error) return res.send(error);
        var arr=[];
        for(i=0;i<app.rows.length;i++){
          var debut = new Date(Number(Date.parse(app.rows[i].date_debut)));
          var fin = new Date(Number(Date.parse(app.rows[i].date_fin)));
          var month = new Array();
          month[0] = "Janvier";
          month[1] = "Février";
          month[2] = "Mars";
          month[3] = "Avril";
          month[4] = "Mai";
          month[5] = "Juin";
          month[6] = "Juillet";
          month[7] = "Aout";
          month[8] = "Septembre";
          month[9] = "Octobre";
          month[10] = "Novembre";
          month[11] = "Décembre";
          var nDebut = month[debut.getMonth()];
          var nFin = month[fin.getMonth()];

          var deb = debut.getDate()+" "+nDebut+" "+debut.getFullYear()+" à "+debut.getHours()+":"+debut.getMinutes()+":"+debut.getSeconds();
          var fn = fin.getDate()+" "+nFin+" "+fin.getFullYear()+" à "+fin.getHours()+":"+fin.getMinutes()+":"+fin.getSeconds();
          if(typeof nDebut == "undefined"){
            deb = " - ";
          }
          if(typeof nFin == "undefined"){
            fn = " - ";
          }
          var minutes;
          var hours;
          if (fin.getMinutes() < debut.getMinutes())
          {
            minutes = debut.getMinutes() - fin.getMinutes();
            hours = fin.getHours() - debut.getHours() - 1;
          }else{
            minutes = fin.getMinutes() - debut.getMinutes();
            hours = fin.getHours() - debut.getHours();
          }

          if(isNaN(minutes)){
            minutes = " - ";
          }
          if(isNaN(hours)){
            hours = " - ";
          }

          var duree = hours+" h "+minutes+" min";

          var test=app.rows[i].nom_test;
          var typeTest=app.rows[i].nom_type_test;
          var testeur=app.rows[i].nom+" "+app.rows[i].nom+" "+app.rows[i].matricule;
          var debut=deb;
          var fin=fn;
          var resultat=app.rows[i].libelle_type_resultat;

          var a=[test,typeTest,testeur,debut,fin,duree,resultat];
          arr.push(a);
        }
        conf.rows=arr;
        var result=nodeExcel.execute(conf);
        res.setHeader('Content-Type','application/vnd.openxmlformates');
        res.setHeader("Content-Disposition","attachment;filename="+nomApp+".xlsx");
        res.end(result,'binary');
        console.log("FIN FONCTION TO EXCEL ********************************************************************");
    });
  },


  //CR
  createExcelCR: function (req, res) {
    if (!req.session.user) return res.redirect('/login');
    console.log("FONCTION TO EXCEL CR********************************************************************")
      var nodeExcel=require('excel-export');
      var conf={}
      conf.cols=[{
          caption:'DEV',
          type:'string',
          width:250,
          color:{
                  rgb: 'FFFFFFFF'
                },
        },
        {
          caption:'PROJET',
          type:'string',
          width:250
        },
        {
          caption:'APPLICATION',
          type:'string',
          width:250
        },
        {
          caption:'DEMANDE',
          type:'string',
          width:250
        },
        {
          caption:'HEURES',
          type:'string',
          width:250
        },
        {
          caption:'AVANCEMENT (%)',
          type:'string',
          width:250
        },
        {
          caption:'DEADLINE',
          type:'string',
          width:250
        },
        {
          caption:'TYPE',
          type:'string',
          width:250
        },
        {
          caption:'DELAI',
          type:'string',
          width:250
        },
        {
          caption:'QUALITE',
          type:'string',
          width:250
        }
      ];
       //Debut
      Demande.getListeApplicationDemandePris(req.session.user, function(err, found){
        if (err) {console.log(err);} //return res.send(err);
        console.log(found);
        var arr=[];
        for(i=0;i<found.length;i++){
          var dev = req.session.user+"";
          var projet = found[i].num_dossier+"";
          var application = found[i].nom_application+"";
          var demande = found[i].type_intervention+" : "+found[i].description;

          //temps passé
          var tempsPasse = found[i].temps_passe;
          if(tempsPasse == null){
            tempsPasse = "-";
          }else{
            var sec_num = parseInt(tempsPasse, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}

            tempsPasse = hours+":"+minutes+":"+seconds;
          }
          var heures = tempsPasse;
          //fin temps passé

          var avancement = found[i].etat_demande+"";
          var deadline = found[i].delai+"";
          var type = " ";
          var delai = "1";
          var qualite = "1";

          var a=[dev,projet,application,demande,heures,avancement,deadline,type,delai,qualite];
          arr.push(a);
        }
        conf.rows=arr;
        var result=nodeExcel.execute(conf);
        var nomFichier = "CRFicheRecette"+req.session.user;
        res.setHeader('Content-Type','application/vnd.openxmlformates');
        res.setHeader("Content-Disposition","attachment;filename="+nomFichier+".xlsx");
        res.end(result,'binary');
        console.log("FIN FONCTION TO EXCEL ********************************************************************");
      });
      //Fin
  }
}
