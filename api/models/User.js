/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcryptjs'); //include bcryptjs

///Modele user, ilaina am authentification s inscription
module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'r_personnel', // nom du table qui est associé avec le modele Test
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,

  attributes: { //attribut user
    id: { //id du personnel
      type: 'integer',
      required: true,
      unique: true,
      primaryKey: true,
      columnName:'id_pers'
    },
    email: { //matricule
      type: 'string',
      required: true,
      unique: true,
      columnName:'matricule'
    },
    password: { //mot de passe
      type: 'string',
      required: true  ,
      columnName:'mdp'
    },
    nom: { //nom du personnel
      type: 'string',
      required: true,
      columnName:'nom'
    },
    prenom: { //prenom du personnel
      type: 'string',
      required: true,
      columnName:'prenom'
    },
    appelation: { //prenom du personnel
      type: 'string',
      required: true,
      columnName:'appelation'
    },
    adresse: { //prenom du personnel
      type: 'string',
      required: true,
      columnName:'adresse'
    },
    id_droit: { //prenom du personnel
      type: 'integer',
      required: true,
      columnName:'id_droit'
    },

    email_user: { // email user
      type: 'string',
      required: true,
      columnName:'email'
    },

    toJSON: function() { // User avadika Json
      var obj = this.toObject(); //avadika o object lou le User
      //delete obj.password;// fafana n password-any fa ts tokony aseho refa any am affichage
      return obj; // retour obj
    }
  },

  //Fonction get details user
  getDetailUser: function(idUser, next) {
    var requete = "select nom,prenom,matricule,email from r_personnel where id_pers = "+idUser;
    Application.query(requete, function(err, user){
      if(err) next(err);
      next(null, user);
    });
  },

};


