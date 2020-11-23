/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_test_application', // nom du table qui est associé avec le modele Resultat
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_test_app: { //id test
      type: 'integer',
      columnName:'id_test',
      primaryKey: true
    },
    id_test: { //id test
      type: 'integer',
      columnName:'id_test'
    },

    id_application: { //id application
      type: 'integer',
      columnName:'id_application'
    },

    id_resultat: { //id resultat
      type: 'integer',
      columnName:'id_resultat'
    },

    id_recette: { //id recette
      type: 'integer',
      columnName:'id_recette'
    },

    id_etape: { //id recette
      type: 'integer',
      columnName:'id_etape'
    },

    id_fonctionnalite: { //id fonctionnalite
      type: 'integer',
      columnName:'id_fonctionnalite'
    },
    id_demande: {
      type: 'integer',
      columnName:'id_demande'
    }
  },

  //Fonction find test application by id
  findTestApplicationById: function(idTest, idApplication, next) {
    TestApplication.findOne({id_test:idTest, id_application: idApplication}).exec(function (err, test) {
      if(err) next(err);
      next(null, test);
    });
  }

};

