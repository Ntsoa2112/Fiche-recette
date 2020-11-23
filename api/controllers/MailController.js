/**
 * Created by 8032 on 18/07/2016.
 */

module.exports = {
  sendEmailNode: function(req, res) {
    var destinataire = 'ericaraheliarisoa@outlook.fr'; // Destinataire test
    var objet = "Resultat test"; //objet email
    var message = "notific"; // message à envoyer

    console.log("============================================== SEND EMAIL WITH NODE MAILER SMTP");
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    //______Gmail exemple test____
    //console.log(" ******************************** creation transporter");
    /*var transporter = nodemailer.createTransport(smtpTransport({
     service: 'gmail',
     auth: {
     user: 'ericastrn@gmail.com', // email sender
     pass: '*123'
     }
     }));*/

    //outlook test
    /* var transporterOutlook = nodemailer.createTransport(smtpTransport({
     service: 'hotmail',
     auth: {
     user: 'stg.dev.erica@et.in', // email sender //ericaraheliarisoa@outlook.fr    raheliarisoa1
     pass: 'erica'
     }
     })); */
    var transporterOutlook = nodemailer.createTransport(smtpTransport({
      host: '10.128.1.3',  //smtp.office365.com
      port: '25',
      auth: { user: 'erica@et.in', pass: 'erica' },
      secureConnection: false
    }));

/*    async.parallel([function(callback) {
        console.log(" fin creation transporter **********************************");
        var idApp = "56";
        ImageService.fonctionGenererPdf(req, res, idApp);
        callback(null);
      }
    }, function(callback) {
      console.log("/////////////////////////////////////// ENVOIE EMAIL  /////////////////////////////////////////");

      transporterOutlook.sendMail({ // envoie de l'email
        from: "mirah@et.in", //sender
        to: 'erica@et.in', //receiver 'ericaraheliarisoa@outlook.fr'
        subject: objet, // Objet 'hello'
        html: '<b>'+message+'</b>', //hello world!
        text: message,//'hello world!'

        attachments: [
          {   // filename and content type is derived from path
            filename: "Application test email Erica.pdf",
            path: 'assets/PDF/' + 'Application test email Erica.pdf',
            contentType: 'application/pdf'
          }
        ]

      },function(error, response) {
        if (error) {
          console.log("/////////////////////////////////////// ERREUR /////////////////////////////////////////");
          console.log(error);
          console.log("/////////////////////////////////////// FIN /////////////////////////////////////////");
        } else {
          console.log('Message envoyé');
          res.redirect("/appByIdTest?id="+req.param('id',null));
        }
      });
      //console.log(" fin envoi email **********************************");
    });
*/

    async.parallel([
      function(callback) {
        console.log(" fin creation transporter **********************************");
        var idApp = "56";
        ImageService.fonctionGenererPdf(req, res, idApp);
        callback(null);
      }
    ],function(err, resulats){
      console.log("/////////////////////////////////////// ENVOIE EMAIL  /////////////////////////////////////////");

      transporterOutlook.sendMail({ // envoie de l'email
        from: "mirah@et.in", //sender
        to: 'erica@et.in', //receiver 'ericaraheliarisoa@outlook.fr'
        subject: objet, // Objet 'hello'
        html: '<b>'+message+'</b>', //hello world!
        text: message,//'hello world!'
        attachments: [
          {   // filename and content type is derived from path
            filename: "Application test email Erica.pdf",
            path: 'assets/PDF/' + 'Application test email Erica.pdf',
            contentType: 'application/pdf'
          }
        ]
      },function(error, response) {
        if (error) {
          console.log("/////////////////////////////////////// ERREUR /////////////////////////////////////////");
          console.log(error);
          console.log("/////////////////////////////////////// FIN /////////////////////////////////////////");
        } else {
          console.log('Message envoyé');
          res.redirect("/appByIdTest?id="+req.param('id',null));
        }
      });
      //console.log(" fin envoi email **********************************");
    });


    /*var sqlQueryAffectationDossier = 'SELECT p_affectation.id_dossier, p_affectation.id_pers, p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE p_affectation.id_dossier= 3 AND id_etat = 0 ORDER BY p_dossier.id_dossier';
    var lstIdPersonne =[];
    var lstMailPersonne =[];
    User.query(sqlQueryAffectationDossier, function(error, lstPersonne) {
      if(error) console.log(error);
      else{
        async.each(lstPersonne.rows, function(personne, callback){
          lstIdPersonne.push(personne.id_pers);
          var queryGetMailPersonne = "select email from r_personnel where id_pers = "+personne.id_pers;
          console.log(" ===================== ===> " +queryGetMailPersonne);
          User.query(queryGetMailPersonne, function(err, mailPersonne){
            if(err){
              console.log(err);
            }else{
              //console.log("mail personne ===> "+mailPersonne.rows[0].email);
              if(mailPersonne.rows[0].email != null){
                lstMailPersonne.push(mailPersonne.rows[0].email);
              }
              //console.log(" Affectation dossier length ===> " +lstIdPersonne.length);
              console.log(" Mail personne length ===> " +lstMailPersonne.length);
              callback(null);
            }
          });
        },function(err){
          for(var j = 0; j < lstMailPersonne.length; j++){
            console.log(" Mail personne ===> " +lstMailPersonne[j]);
          }
          res.redirect("/accueil");
        });
      }
    });*/

    //console.log(" ******************************** Envoi email");


  }
};

