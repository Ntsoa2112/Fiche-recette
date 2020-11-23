/**
 * TypeTest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_type_test', // nom du table qui est associé avec le modele Recette
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_type_test: { //id recette
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_type_test'
    },

    nom_type_test: { //titre recette
      type: 'string',
      required: true,
      unique: true,
      columnName:'nom_type_test'
    },

    suppr: { //supprimé ou non
      type: 'boolean',
      columnName:'suppr'
    },
  }
};

