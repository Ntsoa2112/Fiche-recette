/**
 * Fonctionnalite.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_fonctionnalite', // nom du table qui est associé avec le modele Application
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_fonctionnalite: { //id fonctionnalite
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_fonctionnalite'
    },

    libelle: { //libelle
      type: 'string',
      required: true,
      columnName:'libelle'
    },

    entree: { //entree
      type: 'string',
      required: true,
      columnName:'entree'
    },

    sortie: { //sortie
      type: 'string',
      required: true,
      columnName:'sortie'
    },

    delai: { //entree
      type: 'string',
      columnName:'delai'
    },

    id_application: { //entree
      type: 'integer',
      required: true,
      columnName:'id_application'
    },

    supp: { //supprimé
      type: 'integer',
      required: true,
      columnName:'supp'
    },
  },

  //Fonction pour avoit la liste des fonctionnalités d'une application
  getFonctionnaliteByApplication: function(idApplication, next) {
    var requeteFonctionnaliteApplication = 'SELECT * FROM fr_fonctionnalite where id_application = '+idApplication+' and supp = 0';
    Application.query(requeteFonctionnaliteApplication, function(err, listeFonctionnalite){
      if(err) next(err);
      next(null, listeFonctionnalite);
    });
  },
};

