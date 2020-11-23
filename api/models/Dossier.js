/**
 * Dossier.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'p_dossier', // nom du table qui est associé avec le modele Dossier
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_dossier: { //id du dossier
      type: 'integer',
      required: true,
      unique: true,
      primaryKey: true,
      columnName:'id_dossier'
    },

    num_dossier: { //numero du dossier
      type: 'string',
      required: true,
      unique: true,
      columnName:'num_dossier'
    },
  },

  //Fonction pour recuperer la liste des personnes affecté dans un dossier
  getPersonneAffectationDossier: function(idDossier, next) {
    var sqlQueryAffectationDossier = 'SELECT p_affectation.id_dossier, p_affectation.id_pers, p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE p_affectation.id_dossier= '+idDossier+' AND id_etat = 0 ORDER BY p_dossier.id_dossier';
    User.query(sqlQueryAffectationDossier, function(err, lstPersonne) {
      if(err) next(err);
      next(null, lstPersonne);
    });
  },

  //Fonction get numero dossier
  getNumDossier: function(idDossier, next) {
    Dossier.query('select fr_application.id_dossier, p_dossier.num_dossier from fr_application join p_dossier on p_dossier.id_dossier = '+idDossier+' where fr_application.suppr = false', function(err, numDossier){
      if(err) next(err);
      next(null, numDossier);
    });
  },

  //Fonction get application par num_dossier
  getApplicationDossier: function(numDossier, next) {
    var requete = "SELECT fr_application.nom_application,fr_application.id_application, p_dossier.id_dossier FROM fr_application JOIN p_dossier ON fr_application.id_dossier = p_dossier.id_dossier where p_dossier.num_dossier ='"+numDossier+"' and where fr_application.suppr = false";
    Dossier.query(requete, function(err, found){
      if(err) next(err);
      next(null, found);
    });
  },

  //Fonction get liste dossier par utilisateur connecté
  getListeDossierPersonne: function(idUser, next) {
    var requete = "SELECT p_affectation.id_dossier,p_dossier.num_dossier FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier WHERE id_pers= "+idUser+" AND id_etat = 0 ORDER BY num_dossier ASC";
    Dossier.query(requete, function(err, found){
      if(err) next(err);
      next(null, found);
    });
  },
};
