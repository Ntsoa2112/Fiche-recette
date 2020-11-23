/**
 * TestSpecApp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_test_application', // nom du table qui est associé avec le modele Test
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_test: { //id test
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_test'
    },

    id_application: { //id test
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_application'
    },

    id_resultat_test: { //type test
      type: 'string',
      columnName:'id_resultat'
    },
  }
};

