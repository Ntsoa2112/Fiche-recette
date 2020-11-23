/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

///Modele user, ilaina am authentification s inscription
module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_utilisateur', // nom du table qui est associé avec le modele Test
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,

  attributes: { //attribut user
    id: { //id du personnel
      type: 'integer',
      required: true,
      unique: true,
      primaryKey: true,
      columnName:'id_utilisateur'
    },
    id_pers: { //email
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_pers'
    },
    droit_utilisateur: { //mot de passe
      type: 'string',
      required: true,
      columnName:'droit_utilisateur'
    }
  },
  getListeDev:function(callback){
    var requete="select id_pers from r_personnel where id_departement=12";
    Utilisateur.query(requete, function (err, res) {
      if (err) return callback(err);
      return callback(null, res.rows);
    });
  },
};


