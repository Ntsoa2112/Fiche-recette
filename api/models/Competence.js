/**
 * Competence.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', 
  tableName: 'fr_competence', 
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id_competence: { 
      type: 'integer',
      unique: true,
      columnName:'id_competence'
    },

    libelle: { 
      type: 'string',
      columnName:'libelle'
    },

    id_type_competence: { 
      type: 'integer',
      columnName:'id_type_competence'
    },
  },

  getListeCompetence: function(option,callback){
    var sql = 'select * from fr_competence where id_type_competence = '+option.type;
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },


  getListeCompetenceApp: function(option,callback){
    var sql = 'select * from fr_application where suppr = false and demande = false and id_pers_ajout not in (1) order by nom_application';
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },
  getListeCompetenceDevApp: function(option,callback){
    var sql = 'select * from fr_application join fr_competence_app on fr_application.id_application = fr_competence_app.id_app '+
              'where fr_competence_app.id_pers = '+option.idDev;
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },


  getListeCompetenceDev: function(option,callback){
    var sql = 'select * from fr_competence join fr_competence_dev on fr_competence.id_competence = fr_competence_dev.id_competence '+
              'where fr_competence_dev.id_pers = '+option.idDev+" and fr_competence.id_type_competence = "+option.type;
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },
};

