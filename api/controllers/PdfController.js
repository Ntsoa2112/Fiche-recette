/**
 * Created by 8032 on 21/03/2016.
 */
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./views/application/pdfTest.ejs', 'utf8');
var options = { format: 'Letter', border: 'top:2in,right:2in,bottom:2in,left:2in' };

module.exports = {
  //fonction apercu PDFdf
  apercuPdf: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    var id = parseInt(req.param('idApplication'));
    var retVal = [];
    Application.findOne(id).exec(function (err, application) {
      if (err) return res.negotiate(err);
      if (!id) return res.notFound('Could not find sorry.');

      Test.getTestByApplication(id, function(eror, test) {
        if (eror) return res.negotiate(eror);
        //Application.query('select fr_application.id_dossier, p_dossier.num_dossier from fr_application join p_dossier on p_dossier.id_dossier = '+application.id_dossier+'', function(err, numDossier){
        Dossier.getNumDossier(application.id_dossier, function(err, numDossier){
          if (err) return res.send(err);
          //Application.query('select nom,prenom,matricule from r_personnel where id_pers = '+application.id_pers_ajout+'', function(er, persAjout){
          User.getDetailUser(application.id_pers_ajout, function(er, persAjout){
            if (er) return res.send(er);
            var retVal = [];
            retVal['applications'] = application;
            retVal['list_tests'] = test.rows;
            retVal['numeroDossier'] = numDossier.rows;
            retVal['persAjout'] = persAjout.rows;
            res.view( 'application/apercuPdf', retVal );
          });
        });
      });
    });
  },

  //fonction pour generer le pdf
  generatePdf: function(req, res) {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idApplication');
    PdfService.fonctionGenererPdf(req, res, id, function(err){
      if (err) return res.send(err);
      console.log(res);
      var hostname = req.headers.host;
      console.log("HOSTNAME  "+hostname);
      Application.findApplicationById(id, function(err, appli){
        res.redirect('http://'+hostname+'/PDF/'+appli.nom_application+'.pdf'); //rediriger vers la vue pdfOk.ejs //localhost:1337
      });
    });
  }
}
