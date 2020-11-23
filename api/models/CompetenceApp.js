/**
 * CompetenceApp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', 
  tableName: 'fr_competence_app', 
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id_competence_dossier: { 
      type: 'integer',
      unique: true,
      columnName:'id_competence_dossier'
    },

    id_pers: { 
      type: 'integer',
      columnName:'id_pers'
    },

    id_app: { 
      type: 'integer',
      columnName:'id_app'
    },

    nb_etoile: { 
      type: 'integer',
      columnName:'nb_etoile'
    }
  }

};

