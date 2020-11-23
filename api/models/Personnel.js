/**
 * Personnel.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'r_personnel', // nom du table qui est associé avec le modele Personnel
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_personnel: { //id du personnel
      type: 'integer',
      required: true,
      unique: true,
      primaryKey: true,
      columnName:'id_pers'
    },

    mdp: { //mot de passe du personnel
      type: 'string',
      required: true,
      columnName:'mdp'
    },

    matricule: { //numero matricule du personnel
      type: 'string',
      required: true,
      unique: true,
      columnName:'matricule'
    }
  }
};


