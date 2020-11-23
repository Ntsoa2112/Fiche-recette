/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_resultat', // nom du table qui est associé avec le modele Resultat
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_resultat: { //id resultat
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_resultat'
    },

    id_personnel: { //id personnel
      type: 'integer',
      columnName:'id_personnel'
    },

    date_debut: { //date debut
      type: 'timestamp',
      columnName:'date_debut'
    },

    date_fin: { //date fin
      type: 'timestamp',
      columnName:'date_fin'
    },

    resultat: { //resultat
      type: 'integer',
      columnName:'resultat'
    },

    commentaire: { //commentaire
      type: 'string',
      columnName:'commentaire'
    },
  }
};

