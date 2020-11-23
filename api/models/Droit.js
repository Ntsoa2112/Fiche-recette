/**
 * Droit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_droit_user', // nom du table qui est associé avec le modele Dossier
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_droit_user: { //id du dossier
      type: 'integer',
      unique: true,
      columnName:'id_droit_user'
    },

    id_personnel: { //id personnel
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_personnel'
    },

    droit: { //id personnel
      type: 'integer',
      required: true,
      unique: true,
      columnName:'droit'
    },
  }
};

