/**
 * Etape.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
    tableName: 'fr_suppr_demande', // nom du table qui est associé avec le modele Test
    autoCreatedAt: false,
    autoUpdatedAt: false,

    //attributs
    attributes: {
    id_suppr_demande: { //id
        type: 'integer',
        unique: true,
        columnName:'id_suppr_demande'
      },

      id_personne: { 
        type: 'integer',
        required: true,
        columnName:'id_personne'
      },

      description: { 
        type: 'string',
        required: true,
        columnName:'description'
      },

      date_suppr: { 
        type: 'timestamp',
        columnName:'date_suppr'
      },

      id_personne_demande: { 
        type: 'integer',
        required: true,
        columnName:'id_personne_demande'
      },
    },
};

