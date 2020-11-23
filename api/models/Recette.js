/**
 * Recette.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_recette', // nom du table qui est associé avec le modele Recette
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_recette: { //id recette
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_recette'
    },

    titre_recette: { //titre recette
      type: 'string',
      required: true,
      unique: true,
      columnName:'titre_recette'
    },

    etape_recette: { //etape recette
      type: 'string',
      required: true,
      columnName:'etape_recette'
    },

    resultat_attendu: { //resultat attendu
      type: 'string',
      required: true,
      columnName:'resultat_attendu'
    },

    resultat_obtenu: { //resultat obtenu
      type: 'string',
      required: true,
      columnName:'resultat_obtenu'
    },

    status_recette: { //status recette
      type: 'string',
      required: true,
      columnName:'status_recette'
    },
  }
};

