/**
 * TypeDemande.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_type_intervention', //
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_type_intervention: {
      type: 'integer',
      unique: true,
      columnName:'id_type_intervention'
    },

    libelle: {
      type: 'string',
      required: true,
      columnName:'libelle'
    },
  },

  findTypeDemande: function(next) {
    TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention', function(err, listeDemande){
      if(err) next(err);
      next(null, listeDemande);
    });
  },



  findTypeDemandeById: function(id,next) {
    TypeDemande.query('select id_type_intervention, libelle from fr_type_intervention where id_type_intervention = '+id+'', function(err, listeDemande){
      if(err) next(err);
      next(null, listeDemande);
    });
  },
};

