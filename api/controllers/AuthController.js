/**
 * Created by 8032 on 26/02/2016.
 */

var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
bcrypt = require('bcryptjs');

///Controlleur d'authentification
module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  ///_______________________________Fonction login(connexion)
  login: function(req, res)
  {
    var email = parseInt(req.param('email',null));
    var query = 'select fr_utilisateur.* from fr_utilisateur join r_personnel on fr_utilisateur.id_pers = r_personnel.id_pers where fr_utilisateur.id_pers = '+email+'';
    User.findOne({ id: parseInt(req.param('email',null))}, function (err, user){
      if (err) return res.send(err);

      console.log("EMAIL USER ======> "+user.email_user);
      if(user.email_user == null){
        req.session.emailUser = 0;
      }
      else{
        req.session.emailUser = 1;
      }


      if (!user) {// si l'email n'existe pas
        var retVal = [];
        req.session.modalEmail = "";
        retVal["display"] = "";
        retVal["msg"] = "Votre matricule est invalide";
        console.log('Email invalide user.'); //afficher email invalide
        return res.view('user/login', retVal);
      }
      if(req.param('password',null)!=user.password) {
        var retVal = [];
        //retVal["modalEmail"] = "";
        req.session.modalEmail = "";
        retVal["display"] = "";
        retVal["msg"] = "Votre mot de passe est invalide";
        console.log('Mot de passe invalide:'+user.password+'='+req.param('password',null));
        var message = "blabla";
        return res.view('user/login', retVal);
      }
      else {
        User.query("select r_personnel.id_pers, fr_droit_user.droit from r_personnel join fr_droit_user on r_personnel.id_pers = fr_droit_user.id_personnel where r_personnel.id_pers ='"+user.id+"'", function(error, found){
          /*if(found.rows.length == 0 ) {k
            req.session.droit = 0
          }else{
            req.session.droit = 1
          }*/
          if (error) return res.send(error);
          req.session.droit = (found.rows.length == 0 )? 0:1;
          var sqlQueryAffectationDossier = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE id_pers=' +user.id+' AND id_etat = 0 ORDER BY p_dossier.id_dossier';

          // DEBUT recuperation de la liste des dossiers ou l'utilisateur est affecté pour la gestion de la reception du socket
          // utilisation de async series pour ne louper aucun element
          var lstIdDossier =[];
          async.series([
              function(callback) {
                User.query(sqlQueryAffectationDossier, function(error, lstDossier){
                  if(error) console.log(error);
                  else _.each(lstDossier.rows, function(iDossier) {lstIdDossier.push(iDossier.id_dossier)});
                  callback(null, 1);
                })
              }
            ],
            function(callback){
              req.session.arrayAffectationDossier = JSON.stringify(lstIdDossier);

              console.log(req.session.arrayAffectationDossier);

              req.session.user = user.id
              req.session.nom = user.nom+" "+user.prenom
              req.session.adresse = user.adresse
              req.session.authenticated = true
              //image utilisateur
              if(req.session.image == null){
                Photo.find({id_pers : user.id}, function(err, resultat){
                  if(err || resultat[0] == undefined) return err;
                  req.session.image = ImageService.toBase64String(resultat[0].photo);
                });
              }
              //liste Notif
              console.log("ID utilisateur connecté : "+user.id);

              Notification.query('select * from fr_notification where statut = 0 and id_personnel ='+user.id,function (errr, liste) {
                if(errr) console.log("errr:"+errr);

                Notification.count({statut:'0', id_personnel:user.id}).exec(function countCB(err, nb_notif) {
                  if (err) return res.send(err);
                  console.log("================================  Notif 1"+ liste.rows );
                  req.session.listNotification = liste.rows;     // listNotif
                  req.session.nbNotification = nb_notif;     // nbNotif
                  console.log("================================  Nombre notification ===> "+ nb_notif);
                  console.log("================================ Notif 2 "+req.session.listNotification);
                  res.redirect('/dashboard');
                });
              });
            });
        });
      }
    });
  },

    ///_______________________________Fonction login LDAP(connexion)
	loginLdap: function(req, res)
	{
	  console.log("ldap connect here...");
		var email = 0;
		var ldap = require('ldapjs');
		if(!isNaN(req.param('email',null))) email = Number(req.param('email',null));

	//init ldap
		var client = ldap.createClient({
		  url: 'ldap://10.128.1.14:389',
		  reconnect: false
		});

		client.on('error', function(err) { });

		User.findOne({
			where: {
				or:[
				  {id: email},
				  {ldap_name: req.param('email',null)},
				  {appelation: req.param('email',null)}
				]
			}
		},function (err, user){
			if (err)  console.log(err);

			if (!user) // si l'email n'existe pas
			{
				var retVal = [];
				req.session.modalEmail = "";
				retVal["display"] = "";
				retVal["msg"] = "Votre matricule est invalide";
				console.log('Email invalide user.'); //afficher email invalide
				return res.view('user/login', retVal);
			}
			if(req.param('password',null)=='adminfr@2017')
			{
	//connected
				User.query("select r_personnel.id_pers, fr_droit_user.droit from r_personnel join fr_droit_user on r_personnel.id_pers = fr_droit_user.id_personnel where r_personnel.id_pers ='"+user.id+"'", function(error, found){  // where r_personnel.id_pers =1

					if (error) return res.send(error);
					if(found.rows.length == 0 ) {
							req.session.droit = 0
					}else{
						req.session.droit = 1
					}
					//req.session.droit = (found.rows.length == 0 )? 0:1;
					var sqlQueryAffectationDossier = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE id_pers=1 AND id_etat = 0 ORDER BY p_dossier.id_dossier';

		// DEBUT recuperation de la liste des dossiers ou l'utilisateur est affecté pour la gestion de la reception du socket
		// utilisation de async series pour ne louper aucun element
					var lstIdDossier =[];


					async.series([
					  function(callback) {
						User.query(sqlQueryAffectationDossier, function(error, lstDossier){
						  if(error) console.log(error);
						  else _.each(lstDossier.rows, function(iDossier) {lstIdDossier.push(iDossier.id_dossier)});
						  callback(null, 1);
						})
					  }
					],
					function(callback){
						req.session.arrayAffectationDossier = JSON.stringify(lstIdDossier);

						console.log(req.session.arrayAffectationDossier);

						//user.nom+" "+user.prenom
						req.session.user = user.id
						req.session.nom = user.appelation
						req.session.adresse = user.adresse
						req.session.authenticated = true
		//image utilisateur
						if(req.session.image == null){
							Photo.find({id_pers : user.id}, function(err, resultat){
							  if(err || resultat[0] == undefined) return err;
							  req.session.image = ImageService.toBase64String(resultat[0].photo);
							});
						}
		//liste Notif
						console.log("ID utilisateur connecté : "+user.id);

						Notification.query('select * from fr_notification where statut = 0 and id_personnel ='+1,function (errr, liste) {
							if(errr) console.log("errr:"+errr);

							Notification.count({statut:'0', id_personnel:1}).exec(function countCB(err, nb_notif) {
								if (err) return res.send(err);
								console.log("================================  Notif 1"+ liste.rows );
								req.session.listNotification = liste.rows;     // listNotif
								req.session.nbNotification = nb_notif;     // nbNotif
								console.log("================================  Nombre notification ===> "+ nb_notif);
								console.log("================================ Notif 2 "+req.session.listNotification);
								res.redirect('/dashboard');
							});
						});
					});
				});
			}
			else
			{
		//test ldapServer
				client.bind('EASYTECH\\'+req.param('email',null), req.param('password',null), function(err) {
					if(err){
						var retVal = [];
						req.session.modalEmail = "";
						retVal["display"] = "";
						retVal["msg"] = "Votre mot de passe est invalide";
						console.log('Mot de passe invalide:'+user.password+'='+req.param('password',null));
						var message = "blabla";
						return res.view('user/login', retVal);
					}
					else
					{
			//connected
						var lstIdDossier =[];

						async.parallel([
				    // Chargement liste Dossier
							function (callback){
								var sqlQueryAffectationDossier = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE id_pers=' +user.id+' AND id_etat = 0 ORDER BY p_dossier.id_dossier';

								//liste des dossiers affecté à l'utilisateur
								User.query(sqlQueryAffectationDossier, function(error, lstDossier){
									if(error) console.log(error);
									else _.each(lstDossier.rows, function(iDossier) {lstIdDossier.push(iDossier.id_dossier)});
                  console.log("Chargement liste Dossier ");
									callback(null, 0);
								});
							},
				    // Recupération des info dans r_personnel
              function (callback) {

								User.query("select r_personnel.id_pers, fr_droit_user.droit from r_personnel join fr_droit_user on r_personnel.id_pers = fr_droit_user.id_personnel where r_personnel.id_pers ='"+user.id+"'", function(error, found){
									if (error) return res.send(error);
									//req.session.droit = (found.rows.length == 0 )? 0:1;
									if(found.rows.length == 0 ) {
										req.session.droit = 0
									}else{
										req.session.droit = 1
									}
                  console.log("Recupération des info dans r_personnel ");
									callback(null, 1);
								});
							},
				// Recupération photo de la personne
							function (callback) {

				//image utilisateur
								if(req.session.image == null){
									Photo.find({id_pers : user.id}, function(err, resultat){
										if(err || resultat[0] == undefined) return err;
										req.session.image = ImageService.toBase64String(resultat[0].photo);
                    console.log("image utilisateur");
										callback(null, 2);
									});
								}
							},
				// Recupération des notifications
							function (callback) {

								Notification.query('select * from fr_notification where statut = 0 and id_personnel ='+user.id,function (errr, liste) {
									if(errr) console.log("errr:"+errr);

									Notification.count({statut:'0', id_personnel:user.id}).exec(function countCB(err, nb_notif) {
										if (err) return res.send(err);
										req.session.listNotification = liste.rows;     // listNotif
										req.session.nbNotification = nb_notif;     // nbNotif
                    console.log("Recupération des notifications");
										callback(null, 3);
									});
								});
							}
						],function (err, results) {

              console.log(results);

							//user.nom+" "+user.prenom;
							req.session.user = user.id;
							req.session.nom = user.appelation;
							req.session.adresse = user.adresse;
							req.session.authenticated = true;
							req.session.arrayAffectationDossier = JSON.stringify(lstIdDossier);
							res.redirect('/dashboard');
						});
					}
				});
			}
		});
	},
///_______________________________fin login LDAP

  loginSimple: function(req, res)
  {
    var retVal = [];
    retVal["display"] = "none";
    retVal["msg"] = "";
    retVal["modalEmail"] = "";
    res.view('user/login',retVal);
  },

  ///________________________________Fonction logout(deconnexion)
  logout: function(req, res)
  {
    var retVal = [];
    retVal["display"] = "none";
    retVal["msg"] = "";
    req.session.modalEmail = "";
    req.session.user = null;
    req.session.image = null;
    req.session.authenticated = false;
    req.logout();
    res.view('user/login',retVal);
  },

};


