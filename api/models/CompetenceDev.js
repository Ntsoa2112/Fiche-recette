/**
 * CompetenceDev.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', 
  tableName: 'fr_competence_dev', 
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id_competence_dev: { 
      type: 'integer',
      unique: true,
      columnName:'id_competence_dev'
    },

    id_pers: { 
      type: 'integer',
      columnName:'id_pers'
    },

    id_competence: { 
      type: 'integer',
      columnName:'id_competence'
    },

    nb_etoile: { 
      type: 'integer',
      columnName:'nb_etoile'
    }
  }

 
};
