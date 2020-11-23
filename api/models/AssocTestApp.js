/**
 * AssocTestApp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
    tableName: 'fr_assoc_tst_ap_res', // nom du table qui est associé avec le modele Resultat
    autoCreatedAt: false,
    autoUpdatedAt: false,

    //attributs
    attributes: {
      id_assoc: { //id association
        type: 'integer',
        unique: true,
        primaryKey: true,
        columnName:'id_assoc'
      },

      id_resultat: { //id resultat
        type: 'integer',
        columnName:'id_resultat'
      },

      id_test_application: { //id test_application
        type: 'integer',
        columnName:'id_test_application'
      },
    }
};

