/**
 * Etape.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
    tableName: 'p_etape', // nom du table qui est associé avec le modele Test
    autoCreatedAt: false,
    autoUpdatedAt: false,

    //attributs
    attributes: {
      id_etape: { //id etape
        type: 'integer',
        required: true,
        unique: true,
        primaryKey: true,
        columnName:'id_etape'
      },

      libelle: { //libelle etape
        type: 'string',
        required: true,
        columnName:'libelle'
      },

      parent_etape: { //parent etape
        type: 'string',
        required: true,
        columnName:'parent_etape'
      },
    },

  //Fonction get liste etape par dossier
  getListeEtapeDossier: function(idDossier, next) {
    var requete = 'select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape WHERE id_dossier = '+idDossier+' order by id_lien';
    if(idDossier = 'a'){
      requete = 'select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape order by id_lien';
    }
    Etape.query(requete, function(err, test){
     if(err) next(err);
      next(null, test);
    });
  },
};

