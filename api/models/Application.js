/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_application', // nom du table qui est associé avec le modele Application
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_application: { //id application
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_application'
    },

    nom_application: { //nom application
      type: 'string',
      required: true,
      columnName:'nom_application'
    },

    id_dossier: { //id dossier, le dossier de l'appli
      type: 'integer',
      required: true,
      columnName:'id_dossier'
    },

    description_application: { //description de l'application
      type: 'string',
      required: true,
      columnName:'description_application'
    },

    chemin: { //chemin vers l'application
      type: 'string',
      required: true,
      columnName:'chemin'
    },

    date_ajout: { //chemin vers l'application
      type: 'timestamp',
      columnName:'date_ajout'
    },

    id_pers_ajout: { //chemin vers l'application
      type: 'integer',
      required: true,
      columnName:'id_pers_ajout'
    },

    suppr: { //supprimé ou non
      type: 'boolean',
      columnName:'suppr'
    },

    demande: { //demande ou non
      type: 'boolean',
      columnName:'demande'
    },
  },

  //Fonction find application by id
  findApplicationById: function(idApplication, next) {
    Application.findOne({id_application:idApplication}).exec(function (err, app) {
      if(err) next(err);
      next(null, app);
    });
  },

  //Fonction get liste application par utilisteur connecté
  getApplicationByUser: function(idUser, next) {
    var requeteApplicationUser = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.* FROM p_affectation ' +
      'LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier ' +
      'JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier ' +
      'WHERE id_pers='+idUser+' AND id_etat = 0 AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande != true ' +   //
      'ORDER BY fr_application.id_application desc'; // order by fr_application.date_ajout desc
    Application.query(requeteApplicationUser, function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication);
    });
  },

   getCRByUser: function(option, next) {

    var sqlNum = "";
    var sqlAnnee = "";

    var sqlLastWeek = "";
    var sqlLastWeek2 = "";

    if(option.num_semaine != ""){
      sqlNum = " and fr_cr.semaine = '"+ option.num_semaine + "' ";
    }else{
      sqlLastWeek = ", (select max(semaine) from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande where fr_demande.id_personne_dev = '"+option.user+"' and fr_cr.date_cr::text like '"+ option.annee + "%' )  as last_week ";
      sqlLastWeek2 = "AND fr_cr.semaine = (select max(semaine) from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande where fr_demande.id_personne_dev = '"+option.user+"' and fr_cr.date_cr::text like '"+ option.annee + "%' ) AND r_personnel.id_pers  = '"+option.user+"' ";
    }

    if(option.annee != ""){
      sqlAnnee = " and fr_cr.date_cr::text like '"+ option.annee + "%' ";
    }

    console.log("OPTION ====> "+ option.num_semaine + "  " + option.annee);
    var sqlFiltre = sqlNum + sqlAnnee;
    var sqlId_personneDemande= "";
    console.log("FILTRE    ===> " + sqlFiltre);
    if(option.user!=177)
    {
      sqlId_personneDemande=' AND fr_demande.id_personne_dev = '+option.user+' ';
    }

    ////'(select max(semaine) from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande where fr_demande.id_personne_dev = '+option.user+' )  as last_week, '+

    //AND fr_cr.semaine = (select max(semaine) from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande where fr_demande.id_personne_dev = '+option.user+' ) AND r_personnel.id_pers  = '+option.user+'


    var requeteCR = 'select fr_demande.id_demande, fr_cr.id_cr, fr_cr.delai as delai_cr, fr_cr.date_cr, fr_cr.qualite,fr_demande.description, fr_cr.heure, fr_cr.avancement as avancement_dev, fr_demande.qualite_dev, '+
    'r_personnel.appelation, p_dossier.num_dossier, fr_application.nom_application, fr_demande.delai as delai_dem, '+
    'fr_soustache.avancement, fr_soustache.delai, fr_soustache.libelle_soustache, fr_type_intervention.libelle as type_intervention, '+
    
    '(select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur , '+
    'fr_demande.date_demande, fr_demande.estimation_dev, fr_priorite.libelle_priorite, fr_etat_demande.libelle '+
     
    sqlLastWeek+' '+

    'from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande '+
    'JOIN fr_type_intervention ON fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention '+
    'JOIN r_personnel on fr_demande.id_personne_dev = r_personnel.id_pers '+
    'LEFT JOIN p_dossier on fr_demande.id_dossier = p_dossier.id_dossier '+
    //'LEFT JOIN fr_soustache on fr_demande.id_demande = fr_soustache.id_demande '+
    'LEFT JOIN fr_soustache on fr_soustache.id_soustache = fr_cr.id_sous_tache '+
    'LEFT JOIN fr_application on fr_demande.id_application = fr_application.id_application '+

    'LEFT JOIN fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite '+
    'LEFT JOIN fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande '+

    'WHERE 1=1 '+sqlLastWeek2+' '+sqlId_personneDemande+'  '+ sqlFiltre +
    ' GROUP BY fr_demande.id_demande, fr_cr.id_cr, fr_cr.delai, fr_cr.qualite,fr_cr.date_cr, fr_demande.temps_passe, fr_demande.avancement_dev, fr_demande.delai, fr_demande.qualite_dev, '+
    'r_personnel.appelation, p_dossier.num_dossier, fr_application.nom_application, fr_soustache.temps_passe, '+
    'fr_soustache.avancement, fr_soustache.delai, fr_soustache.libelle_soustache, fr_demande.description, fr_type_intervention.libelle, '+
    'fr_demande.id_personne_demande, fr_demande.date_demande,fr_demande.estimation_dev,fr_priorite.libelle_priorite,fr_etat_demande.libelle ORDER BY fr_cr.date_cr';

    /*var requeteCR = 'select fr_cr.id_cr, fr_cr.delai as delai_cr, fr_cr.qualite,fr_demande.description, fr_demande.temps_passe as temps_passe_dem, fr_cr.avancement as avancement_dev, fr_demande.qualite_dev, '+
    'r_personnel.appelation, p_dossier.num_dossier, fr_application.nom_application, fr_demande.delai as delai_dem, '+
    'fr_soustache.temps_passe, fr_soustache.avancement, fr_soustache.delai, fr_soustache.libelle_soustache, fr_type_intervention.libelle as type_intervention '+
    'from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande '+
    'JOIN fr_type_intervention ON fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention '+
    'JOIN r_personnel on fr_demande.id_personne_dev = r_personnel.id_pers '+
    'LEFT JOIN p_dossier on fr_demande.id_dossier = p_dossier.id_dossier '+
    'LEFT JOIN fr_soustache on fr_demande.id_demande = fr_soustache.id_demande '+
    'LEFT JOIN fr_application on fr_demande.id_application = fr_application.id_application '+
    'WHERE 1=1  '+sqlId_personneDemande+'  '+ sqlFiltre +
    'GROUP BY fr_cr.id_cr, fr_cr.delai, fr_cr.qualite, fr_demande.temps_passe, fr_demande.avancement_dev, fr_demande.delai, fr_demande.qualite_dev, '+
    'r_personnel.appelation, p_dossier.num_dossier, fr_application.nom_application, fr_soustache.temps_passe, '+
    'fr_soustache.avancement, fr_soustache.delai, fr_soustache.libelle_soustache, fr_demande.description, fr_type_intervention.libelle ';*/
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ===> "+requeteCR);
    Application.query(requeteCR, function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication.rows);
    });
  },


  getAvancementDemandeAll: function(option, next) {

    var requeteCR = 'SELECT p_dossier.num_dossier,p_dossier.id_dossier,fr_demande.* ,fr_application.nom_application, r_personnel.appelation, fr_priorite.libelle_priorite, fr_priorite.id_priorite '+
    'FROM fr_demande JOIN p_dossier on fr_demande.id_dossier = p_dossier.id_dossier '+
    'JOIN fr_application ON fr_demande.id_application = fr_application.id_application '+
    'JOIN r_personnel ON fr_demande.id_personne_dev = r_personnel.id_pers '+
    'LEFT JOIN fr_priorite ON fr_demande.id_priorite = fr_priorite.id_priorite '+
    'WHERE fr_demande.id_dossier = p_dossier.id_dossier '+
    'ORDER BY fr_demande.id_priorite asc, fr_demande.date_demande desc';
    console.log(requeteCR);
    Application.query(requeteCR, function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication.rows);
    });
  },

  getAvancementDemandeByUser: function(option, next) {

    var requeteCR = 'SELECT p_dossier.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_demande.* ,fr_application.nom_application, r_personnel.appelation, fr_priorite.libelle_priorite, fr_priorite.id_priorite, fr_etat_demande.libelle as etat_demande FROM '+
    'p_dossier '+
    'JOIN fr_demande ON fr_demande.id_dossier = p_dossier.id_dossier '+
    'JOIN fr_application ON fr_demande.id_application = fr_application.id_application '+
    'JOIN r_personnel ON fr_demande.id_personne_dev = r_personnel.id_pers '+
    'JOIN  fr_etat_demande ON fr_demande.id_etat_demande =  fr_etat_demande.id_etat_demande '+
    'LEFT JOIN fr_priorite ON fr_demande.id_priorite = fr_priorite.id_priorite '+
    'WHERE fr_demande.id_dossier = p_dossier.id_dossier '+
    'ORDER BY fr_demande.id_priorite asc, fr_demande.delai desc';
    console.log(requeteCR);
    Application.query(requeteCR, function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication.rows);
    });
  },

  //Fonction get liste application non testé par utilisteur connecté
  getApplicationNotTestedByUser: function(idUser, next) {
    Application.query('SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.* FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier WHERE id_pers='+idUser+' AND id_etat = 0 AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande != true ORDER BY  fr_application.id_application ASC', function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication);
    });
  },

  //Fonction get liste application testé par utilisteur connecté
  getApplicationTestedByUser: function(idUser, next) {
    Application.query('SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.* FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier WHERE id_pers='+idUser+' AND id_etat = 0 AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande != true ORDER BY  fr_application.id_application ASC', function(err, listeApplication){
      if(err) next(err);
      next(null, listeApplication);
    });
  },

  //Fonction find application PDF
  findApplicationForPDF: function(next) {
    Application.query('select fr_application.nom_application,fr_application.id_application, p_dossier.num_dossier from fr_application join p_dossier on fr_application.id_dossier = p_dossier.id_dossier where fr_application.suppr = false AND fr_application.demande != true', function(err, application){
      if(err) next(err);
      next(null, application);
    });
  },

  //Fonction get detail application
  getDetailApplication: function(idApplication, next) {
    var queryResult = 'SELECT fr_test.id_test,fr_test.nom_test,fr_type_test.nom_type_test, fr_test_application.id_test, fr_resultat.date_debut, fr_resultat.date_fin, fr_resultat.commentaire, fr_resultat.id_personnel, r_personnel.nom, r_personnel.prenom, r_personnel.matricule, r_personnel.id_departement, fr_type_resultat.libelle_type_resultat '+
      'FROM fr_test JOIN fr_assoc_tst_ap_res ON fr_test.id_test = fr_assoc_tst_ap_res.id_test_application '+
      'JOIN fr_resultat ON fr_assoc_tst_ap_res.id_resultat = fr_resultat.id_resultat '+
      'JOIN fr_type_resultat ON fr_resultat.resultat = fr_type_resultat.id_type_resultat '+
      'JOIN fr_type_test ON fr_test.id_type_test = fr_type_test.id_type_test '+
      'JOIN fr_test_application ON fr_test_application.id_test = fr_test.id_test '+
      'JOIN r_personnel ON fr_resultat.id_personnel = r_personnel.id_pers '+
      'where fr_test_application.id_application = '+idApplication+' and fr_test.suppr = false ORDER BY fr_test.id_test desc, fr_resultat.date_fin desc NULLS LAST';
    Application.query(queryResult, function(err, test){
      if(err) next(err);
      next(null, test);
    });
  },

  //Fonction qui retourne un requete (liste application tab)
  getLsApplicationTabRequete: function(idUser,idDossier, next) {
    var queryApp = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, get_count_test_application(fr_application.id_application), get_date_last_test_application(fr_application.id_application) FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier WHERE id_pers='+idUser+' AND id_etat = 0 AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande != true ORDER BY  get_date_last_test_application DESC NULLS LAST'; // fr_application.date_ajout
    console.log(idDossier !== "a");
    if(idDossier !== "a"){
      queryApp = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*, get_count_test_application(fr_application.id_application), get_date_last_test_application(fr_application.id_application) FROM p_affectation LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier WHERE id_pers='+idUser+' AND id_etat = 0 AND p_dossier.id_dossier = '+idDossier+' AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande != true ORDER BY  fr_application.date_ajout DESC';
    }
    next(null, queryApp);
  },

  //Fonction retournant un tableau contenant les numéros des fonctionnalités
    getTabFonctionnalite: function(nb,next) {
      var res = [];
      for(var i = 1; i <= nb; i++) {
        res.push(i);
      }
      next(null, res);
    },
 

  //Fonction Affichage Liste Demande application
  getListeOfDemande: function(id_dossier,personne_demande,callback) {
    var requete="select id_demande,demande.id_type_intervention,fr_type_intervention.libelle as nom_type_intervention,demande.id_priorite as id_priorite,fr_priorite.libelle_priorite as priorite,num_dossier,nom_application,id_etat_demande,id_personne_demande," +
      "appelation,to_char(date_demande,'DD/MM/YYYY'),description,demande.delai,demande.id_application as index_application from fr_demande demande" +
      " left join fr_type_intervention on fr_type_intervention.id_type_intervention=demande.id_type_intervention"+
      " left join p_dossier dossier on dossier.id_dossier=demande.id_dossier " +
      " left join fr_application app on app.id_application=demande.id_application " +
      " left join r_personnel on r_personnel.id_pers=demande.id_personne_demande " +
      " left join fr_priorite on fr_priorite.id_priorite=demande.id_priorite " +
      " WHERE demande.id_etat_demande = 1" ;
      if(id_dossier!="")
      {
        requete+= " AND demande.id_dossier="+id_dossier;
      }
      if(personne_demande!="")
      {
        requete+= " AND demande.id_personne_demande="+personne_demande;
      }
     requete+= "  ORDER BY demande.id_priorite ASC, to_char desc ";
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  },

  getListeDossier_FiltreListeDemande: function(callback) {
    var requete="select DISTINCT fr_demande.id_dossier,num_dossier from fr_demande left join p_dossier on fr_demande.id_dossier=p_dossier.id_dossier where id_etat_demande = 1";
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  },
  
  getListePersonneDemande_FiltreListeDemande: function(callback) {
    var requete="select DISTINCT fr_demande.id_personne_demande,appelation from fr_demande left join r_personnel on fr_demande.id_personne_demande=r_personnel.id_pers where id_etat_demande = 1";
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  },

  getListeOfDemandeUser: function(idUser, callback) {
    var requete="select id_demande,demande.id_type_intervention,fr_type_intervention.libelle as nom_type_intervention,num_dossier,nom_application,id_etat_demande,id_personne_demande," +
      "appelation,to_char(date_demande,'DD/MM/YYYY'),description,demande.delai,demande.id_application as index_application from fr_demande demande" +
      " left join fr_type_intervention on fr_type_intervention.id_type_intervention=demande.id_type_intervention"+
      " left join p_dossier dossier on dossier.id_dossier=demande.id_dossier " +
      " left join fr_application app on app.id_application=demande.id_application " +
      " left join r_personnel on r_personnel.id_pers=demande.id_personne_demande " +
      " WHERE demande.id_etat_demande = 1 AND id_personne_demande ="+idUser+"  ORDER BY to_char desc";
    // console.log(requete);
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  },


  getListeOfDemandeNewApp: function(idUser, callback) {
    var requete = 'SELECT p_affectation.id_dossier,p_dossier.num_dossier,p_dossier.id_dossier,fr_application.*,r_personnel.appelation, r_personnel.nom, r_personnel.prenom FROM p_affectation ' +
      'LEFT JOIN p_dossier ON p_affectation.id_dossier = p_dossier.id_dossier ' +
      'JOIN fr_application ON fr_application.id_dossier = p_dossier.id_dossier ' +
      'JOIN r_personnel on fr_application.id_pers_ajout = r_personnel.id_pers '+
      'WHERE p_affectation.id_pers='+idUser+' AND id_etat = 0 AND fr_application.id_dossier = p_dossier.id_dossier AND fr_application.suppr = false AND fr_application.demande = true ' +   //
      'ORDER BY fr_application.id_application desc';
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  },

  /*getListeApplicationDemandePris: function(idUser, callback) {
    var requete = 'select fr_demande.id_demande, fr_demande.id_type_intervention, fr_demande.date_demande, fr_demande.description, fr_demande.delai, fr_demande.id_personne_dev,'+
                  'fr_demande.date_demande_termine, fr_demande.temps_passe, fr_application.nom_application, fr_application.id_application, fr_application.chemin,'+
                  'fr_type_intervention.libelle as type_intervention,'+
                  'fr_etat_demande.libelle as etat_demande,'+
                  'p_dossier.num_dossier '+
                  'from fr_demande join fr_application on fr_demande.id_application = fr_application.id_application '+
                  'join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention '+
                  'join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande '+
                  'join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier '+
                  'where fr_demande.id_personne_dev = '+idUser+'';
    Application.query(requete, function(err,res){
      if(err) return(err);
      return callback(null, res.rows);
    });
  }*/

};

