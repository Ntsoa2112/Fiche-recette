/**
 * Created by 01019 on 11/10/2016.
 */
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./views/application/pdfTest.ejs', 'utf8');
var options = { format: 'Letter', border: 'top:2in,right:2in,bottom:2in,left:2in' };

module.exports = {
  //fonction pour generer un PDF
  fonctionGenererPdf: function(req, res, idApplication, next) {
    var requetteApplication = 'select fr_application.nom_application, fr_application.id_dossier, fr_application.date_ajout, fr_application.id_pers_ajout, fr_application.chemin, p_dossier.num_dossier, r_personnel.nom, r_personnel.prenom, r_personnel.matricule '+
      'from fr_application join p_dossier on fr_application.id_dossier = p_dossier.id_dossier join r_personnel on fr_application.id_pers_ajout = r_personnel.id_pers where id_application = '+idApplication;
    Application.query(requetteApplication, function(eror, application){
      if (eror) return res.send(eror);
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

      var fin = new Date(Number(Date.parse(application.rows[0].date_ajout)));
      var nFin = month[fin.getMonth()];

      var dateAjout = fin.getDate()+" "+nFin+" "+fin.getFullYear();
      var nom = application.rows[0].nom_application; // variable pour recuperer le nom d l'application
      var dossier = application.rows[0].num_dossier; // variable pour recuperer le dossier d l'application
      var persAjout = application.rows[0].nom +" "+application.rows[0].prenom+" (matricule: "+application.rows[0].matricule+")"; // variable pour recuperer la description d l'application
      var chemin =application.rows[0].chemin; // variable pour recuperer la description d l'application

      var request = 'SELECT fr_test.id_test,fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test, fr_resultat.date_debut, fr_resultat.date_fin, fr_resultat.id_personnel, r_personnel.nom, r_personnel.prenom, r_personnel.matricule, fr_type_resultat.libelle_type_resultat '+
        'FROM fr_test JOIN fr_assoc_tst_ap_res ON fr_test.id_test = fr_assoc_tst_ap_res.id_test_application '+
        'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
        'JOIN fr_type_resultat ON fr_resultat.resultat = fr_type_resultat.id_type_resultat '+
        'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
        'JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test '+
        'JOIN r_personnel ON fr_resultat.id_personnel = r_personnel.id_pers '+
        'where fr_test_application.id_application = '+idApplication+' and fr_test.suppr = false';

      Test.query(request, function(eror, tests){
        if (eror){
          return console.log(eror);
        }
        sails.log('Found "%s"', tests);

        var testAffiche = tests.rows; //variable tests à afficher

        var html2 = "<head><style>table, td, th {border: 1px solid #d3e2ec;text-align: left;}table {border-collapse: collapse;width: 100%;}th, td {padding: 15px;} h4{color:#0085AE;}</style>"+"</head>"
          +"<body>"
          +"<img src='././images/bg.png' style='height:40px; padding-top:10px;'/></br><hr>"

          +"<h4>RECETTE APPLICATION | "+dossier+" | "+nom+" :</h4><hr>"
          +"<p><strong> Date d'ajout : </strong>"+dateAjout+"</p>"
          +"<p><strong> Ajouté par : </strong>"+persAjout+"</p>"
          +"<p><strong> Chemin : </strong>"+chemin+"</p>"

          +"<p><h4>Details:</h4></p>"
          +"<table width='100%' style='font-size:10px;font-style:wf_segoe-ui_normal,arial'>"
          +"<thead style='font-color:#6a9dc1'>"
          +"<tr style='color:#6a9dc1'>"
          +"<th>Titre</th>"
          +"<th>Type</th>"
          +"<th>Testeur</th>"
          +"<th>Date debut</th>"
          +"<th>Date fin</th>"
          +"<th>Durée</th>"
          +"<th>Resultat</th>"
          +"</tr>"
          +"</thead>"
          +"<tbody>";
        for(var i = 0; i < testAffiche.length;i++){

          var debut = new Date(Number(Date.parse(testAffiche[i].date_debut)));
          var fin = new Date(Number(Date.parse(testAffiche[i].date_fin)));

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

          /*var deb = debut.getDate()+" "+nDebut+" "+debut.getFullYear()+" à "+debut.getHours()+":"+debut.getMinutes()+":"+debut.getSeconds();
          var fn = fin.getDate()+" "+nFin+" "+fin.getFullYear()+" à "+fin.getHours()+":"+fin.getMinutes()+":"+fin.getSeconds();*/
          var deb = DateService.changeFormatTimestamp(testAffiche[i].date_debut);
          var fn = DateService.changeFormatTimestamp(testAffiche[i].date_fin);

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
          }else
          {
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
          var resultat = testAffiche[i].libelle_type_resultat;
          if(testAffiche[i].libelle_type_resultat == "non testé"){
            resultat = "-";
          }
          html2=html2+"<tr>"
            +"<td>"+testAffiche[i].nom_test+"</td>"
            +"<td>"+testAffiche[i].nom_type_test+"</td>"
            +"<td>"+testAffiche[i].nom+" " +testAffiche[i].prenom+" " +testAffiche[i].matricule+"</td>"
            +"<td>"+deb+"</td>"
            +"<td>"+fn+"</td>"
            +"<td>"+duree+"</td>"
            +"<td>"+resultat+"</td>"
            +"</tr>";
        }
        html2=html2+"</tbody>"
          +"</table>"
          +"<body>"; //variable qui contient le code htmltffvf
        //console.log('______________________________________________________________________***********'+nom);

        pdf.create(html2, options).toFile('./assets/PDF/'+nom+'.pdf', function (err, resp) {  //creation du pdf
          if (err) return res.send(err);
          console.log("PDF Généré ======================>      (y)");
          next(null);
        });
      });
    });
  }
}
