/**
 * Created by 01019 on 12/10/2016.
 */
module.exports = {

  //fonction envoyer email apres test application
  fonctionEnvoyerMail: function(userMail, lstPersonne, objet, message, nomApplication, next) {
    console.log("============================================== SEND EMAIL WITH NODE MAILER SMTP");
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    var lstIdPersonne =[];
    var lstMailPersonne =[];

      //______Transporter____
    console.log(" ******************************** creation transporter");
    var transporter = nodemailer.createTransport(smtpTransport({
      host: '10.128.1.3',  //smtp.office365.com
      port: '25',
      auth: { user: 'erica@et.in', pass: 'erica' },
      secureConnection: false
    }));
    console.log(" fin creation transporter **********************************");

    async.each(lstPersonne.rows, function(personne, callback){
      lstIdPersonne.push(personne.id_pers);
      var queryGetMailPersonne = "select email from r_personnel where id_pers = "+personne.id_pers;
      console.log(" ===================== ===> " +queryGetMailPersonne);
      User.query(queryGetMailPersonne, function(err, mailPersonne){
        if (err) return res.send(err);
          //console.log("mail personne ===> "+mailPersonne.rows[0].email);
          if(mailPersonne.rows[0].email != null){
            lstMailPersonne.push(mailPersonne.rows[0].email);
          }
          callback(null);
      });
    },function(err){
      for(var j = 0; j < lstMailPersonne.length; j++){ //lstMailPersonne.length
        console.log(" Mail personne ===> " +lstMailPersonne[j]);

        //Envoyer mail
        transporter.sendMail({ // envoie de l'email
          from: userMail, //sender
          to: lstMailPersonne[j], //receiver
          /*from: "mirah@et.in", //sender
          to: 'erica@et.in',*/
          subject: objet+'.',  //l'application [nom_app] du dossier [nom_dossier] a été [validé/rejeté]
          //html: '<p>Bonjour, </p></br></br>'+message+'</p></br></br><p>Cordialement.</p>',

          html: '<p>Bonjour, </p></br></br> '+message+ '</p></br></br><p>Cordialement.</p>',

          text: message,
          attachments: [
            {   // filename and content type is derived from path!!
              filename: nomApplication+".pdf",
              path: 'assets/PDF/' + nomApplication+'.pdf',
              contentType: 'application/pdf'
            }
          ]
        },function(error, response) {
          if (error) console.log(error);
          console.log('Message envoyé');
          return next(null);
      });
      //FIN ENVOIE EMAIL
      }
    });
  },

  //fonction envoyer email apres ajout nouvelle application
  fonctionEnvoyerMailDemande: function(idPersonne, lstPersonne, objet, message, nomApplication, next) {
    console.log("============================================== SEND EMAIL WITH NODE MAILER SMTP");
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    var lstIdPersonne =[];
    var lstMailPersonne =[];

    //______Transporter____
    console.log(" ******************************** creation transporter");
    var transporter = nodemailer.createTransport(smtpTransport({
      host: '10.128.1.3',  
      port: '25',
      auth: { user: 'erica@et.in', pass: 'erica' },
      secureConnection: false
    }));
    console.log(" fin creation transporter **********************************");

    var queryGetMailPersonne = "select email from r_personnel where id_pers = "+idPersonne;

    async.series([
      function (callback) {
        Demande.query(queryGetMailPersonne, function(err,result){
          if (err) console.log(err); //return res.send(err); 
          callback(null, result);
        });
      } 
    ],function(err,resultat){   //.rows[0].email
       console.log("E-mail ===============> "+resultat[0].email);
       console.log("E-mail ===============> "+resultat[0].rows[0].email);
      
      //Envoyer mail
        transporter.sendMail({ // envoie de l'email
          from: resultat[0].rows[0].email, //sender
          to: "dev@et.in", //receiver
          //from: "Mirah@et.in", //sender
          //to: 'erica@et.in',
          subject: objet+'.',
          html: '<p>Bonjour, </p></br></br> '+message+ '</p></br></br><p>Cordialement.</p>',
          text: message

        },function(error, response) {
          if (error) console.log(err); //return res.send(error);/
          console.log('Message envoyé');
          return next(null);
        });
        //FIN ENVOIE EMAIL
     });
  },

  //Mail demande prise en main
  fonctionEnvoyerMailDemandePris: function(idPersonne, objet, message, next) {
    console.log("============================================== SEND EMAIL WITH NODE MAILER SMTP");
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    //______Transporter____
    console.log(" ******************************** creation transporter");
    var transporter = nodemailer.createTransport(smtpTransport({
      host: '10.128.1.3',  
      port: '25',
      auth: { user: 'erica@et.in', pass: 'erica' },
      secureConnection: false
    }));
    console.log(" fin creation transporter **********************************");

    var queryGetMailPersonne = "select email from r_personnel where id_pers = "+idPersonne;

    async.series([
      function (callback) {
        Demande.query(queryGetMailPersonne, function(err,resultat){
          if (err) console.log(err);//return res.send(err);
          callback(null, resultat);
        });
      } 
    ],function(err,resultat){   //.rows[0].email
       console.log("E-mail ===============> "+resultat[0].rows[0].email);
      
      //Envoyer mail
        transporter.sendMail({ // envoie de l'email
          /*from: "dev@et.in", //sender
           to: 'erica@et.in',  //resultat.rows[0].email*/
           from: "dev@et.in", //sender
           to: resultat[0].rows[0].email,//resultat[0].rows[0].email,  //resultat.rows[0].email
          subject: objet+'.',
          html: '<p>Bonjour, </p></br></br> '+message+ '</p></br></br><p>Cordialement.</p>',
          text: message

        },function(error, response) {
          if (error) console.log(err);//return res.send(error);
          console.log('Message envoyé');
          return next(null);
        });
        //FIN ENVOIE EMAIL
    });
  }
}
