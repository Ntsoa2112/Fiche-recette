/**
 * Demande.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_demande', // nom du table qui est associé avec le modele Dossier
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_demande: {
      type: 'integer',
      unique: true,
      columnName:'id_demande'
    },

    id_type_intervention: {
      type: 'integer',
      required: true,
      columnName:'id_type_intervention'
    },

    id_etat_demande: {
      type: 'integer',
      required: true,
      columnName:'id_etat_demande'
    },

    id_personne_demande: {
      type: 'integer',
      required: true,
      columnName:'id_personne_demande'
    },

    id_personne_dev: {
      type: 'integer',
      //required: true,
      columnName:'id_personne_dev'
    },

    date_demande: {
      type: 'timestamp',
      columnName:'date_demande'
    },

    description: {
      type: 'string',
      required: true,
      columnName:'description'
    },

    id_dossier: {
      type: 'integer',
      //required: true,
      columnName:'id_dossier'
    },

    id_application: {
      type: 'integer',
      //required: true,
      columnName:'id_application'
    },

    delai: {
      type: 'string',
      columnName:'delai'
    },

    date_demande_termine: {
      type: 'timestamp',
      columnName:'date_demande_termine'
    },

    temps_passe: {
      type: 'string',
      columnName:'temps_passe'
    },

    estimation_dev: {
      type: 'string',
      columnName:'estimation_dev'
    },

    avancement_dev: {
      type: 'integer',
      columnName:'avancement_dev'
    },

    qualite_dev: {
      type: 'integer',
      columnName:'qualite_dev'
    },
    id_priorite: {
      type: 'integer',
      columnName:'id_priorite'
    },
    delai_prod: {
      type: 'string',
      columnName:'delai_prod'
    },
    abaque: { //filename abaque
      type: 'string',
      required: false,
      columnName:'abaque'
    },

    file_test: { //filename cahier test
      type: 'string',
      required: false,
      columnName:'file_test'
    },
  },



  //****************************      AJOUT SOUS TACHE DEMANDE ( LIAISON  )
  AjouterSousTacheDemande: function (option,next) {

    var idDemande = option.idDemande;
    var sous_tache = option.sousTache;
    var estimation = 0;


    var sqlInsertSousTache = "insert into fr_soustache(id_demande,libelle_soustache,temps_passe,avancement,status,estimation) " +
      "VALUES " +
      "("+idDemande+",'"+sous_tache+"','0',0,'En cours','"+estimation+"')";

    console.log(sqlInsertSousTache);

    async.series([
      function (callback) {
        Demande.query(sqlInsertSousTache, function(err,resultat){
          if (err) console.log(err);
          callback(null, resultat);
        });
      }
    ],function(err,resultat){
      next(null, resultat);
    });
  },

  //**********
  findPriorite: function(next) {
    Demande.query('select id_priorite, libelle_priorite from fr_priorite', function(err, listePriorite){
      if(err) next(err);
      next(null, listePriorite);
    });
  },

  getDemandeurs: function(next) {
    Photo.query('select get_demandeurs_fr() ', function(err, listeDemandeur){
      if(err) next(err);
      next(null, listeDemandeur);
    });
  },

  getListeDemandeur: function(option,callback){
    Photo.query('select get_demandeurs_fr() ', function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeDevPers: function(option,callback){
    var sql = 'select r_personnel.id_pers, r_personnel.nom, r_personnel.appelation, r_departement.libelle as departement from r_personnel join r_departement on r_departement.id = r_personnel.id_departement where r_personnel.actif = true AND NOT r_personnel.id_pers = 1 and r_personnel.id_departement = 12 order by r_personnel.id_pers';
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },

  getListeDemandeurPers: function(is_etat,callback){
    var sql = 'select DISTINCT fr_demande.id_personne_demande,appelation '+
              'from fr_demande left join r_personnel on fr_demande.id_personne_demande=r_personnel.id_pers '+
              'where id_etat_demande != 1';
    if(is_etat == 1){
      sql = 'select DISTINCT fr_demande.id_personne_demande,appelation '+
              'from fr_demande left join r_personnel on fr_demande.id_personne_demande=r_personnel.id_pers '+
              'where id_etat_demande in (2,4)';
    }
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },

  getListeTypePriorite: function(option,callback){
    var sql = 'select * from fr_priorite';
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },

  getListeTypeDemande: function(option,callback){
    var sql = 'select * from fr_type_intervention';
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },

  getListeEtatDemande: function(option,callback){
    var sql = 'select * from fr_etat_demande';
    Demande.query(sql, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);//
    });
  },

  getListeApplicationDemandePris: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  33333333333333333333333333333333333333333 "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dev = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";

    var sql_debut_fin = "";
    var sql_debut_fin2 ="";

    var sql_id_demandeur = "";

    var sql = "";

    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionApplication);

    if(option.optionEtatDemande){
      sql_id_etat_demande = " and fr_demande.id_etat_demande = '"+ option.optionEtatDemande + "' ";
    }
    if(option.optionDev) { // !== undefined && option.optionDev !== null
      sql_id_dev = " and fr_demande.id_personne_dev = "+ option.optionDev + " ";
    }
    if(option.optionDossier && option.optionDossier !== "a" && option.optionDossier != null){
      sql_id_dossier = " and fr_demande.id_dossier = '"+ option.optionDossier + "' ";
    }
    if(option.optionApplication && option.optionApplication !== "a" && option.optionApplication != null){
      sql_id_application =  " and fr_demande.id_application = '"+ option.optionApplication + "' ";
    }
    if(option.optionDeadline){
      sql_dead_line = " and fr_demande.delai = '"+ option.optionDeadline + "' ";
    }
    if(option.optionTypeIntervention){
      sql_id_type_intervention = " and fr_demande.id_type_intervention= '"+ option.optionTypeIntervention + "' ";
    }
    if(option.optionPriorite){
      sql_id_priorite = " and fr_demande.id_priorite = '"+ option.optionPriorite + "' ";
    }

    if(option.optionDemandeur) {
      sql_id_demandeur = " and fr_demande.id_personne_demande = "+ option.optionDemandeur + " ";
    }


    //sql debut fin
    /*if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " and to_char(fr_demande.date_demande, 'yyyy-mm-dd') like '"+ option.optionDebut + "%' ";
      console.log("=============================================> DATE 1 "+sql_debut_fin);
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " and to_char(fr_demande.date_demande, 'yyyy-mm-dd') like'"+ option.optionFin + "%' ";
      console.log("=============================================> DATE 2 "+sql_debut_fin);
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      sql_debut_fin = " and (fr_demande.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      console.log("=============================================> DATE BETWEEN "+sql_debut_fin);
    }*/
    //sql debut fin
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " and to_char(fr_demande.date_demande, 'yyyy-mm-dd') like '"+ option.optionDebut + "%' ";
      //sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionDebut + " ','YYYY-MM-DD'))) ";
      console.log("=============================================> DATE 1 "+sql_debut_fin);
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " and to_char(fr_demande.date_demaande, 'yyyy-mm-dd') like'"+ option.optionFin + "%' ";
      //sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionFin + " ','YYYY-MM-DD'))) ";
      console.log("=============================================> DATE 2 "+sql_debut_fin);
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      //sql_debut_fin = " AND fr_cr.semaine >= (select extract('week' from to_date('" + option.optionDebut + " ','YYYY-MM-DD'))) AND fr_cr.semaine <= (select extract('week' from to_date('" + option.optionFin + " ','YYYY-MM-DD'))) ";
      sql_debut_fin = " and (fr_demande.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      sql_debut_fin2 = " and to_date(fr_cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD')"
      console.log("=============================================> DATE BETWEEN "+sql_debut_fin);
    }


    //modif

    console.log("===========> SELECTED DEADLINE =====================================>>>>>>>>>>>>>>>>>>>>>>>>> "+option.optionDeadline);

    var sqlFiltre = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin + sql_id_demandeur;
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var sqlFiltre2 = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin2 + sql_id_demandeur;

    var requete = "";
    if(sqlFiltre != "" ){
      requete = "select distinct fr_demande.id_demande , fr_demande.date_fin_cr, " +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande," +
        "p_dossier.num_dossier, p_dossier.id_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.id_personne_demande," +
        "      fr_demande.date_demande_termine," +
        "      fr_demande.temps_passe," +
        "      fr_application.chemin," +
        "      fr_demande.reformulation, fr_demande.estimation_abaque, fr_demande.cahier_test, fr_demande.demonstration, " +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        "WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1) as bug, "+

        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+

        "    from fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +

        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "     left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "     left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "     left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +
        "    where 1=1 "+ sqlFiltre + "OR 1=1" + sqlFiltre2;
    }else{
      requete = "select distinct fr_demande.id_demande, fr_demande.date_fin_cr, " +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande," +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.id_personne_demande," +
        "      fr_demande.date_demande_termine," +
        "      fr_demande.temps_passe," +
        "      fr_application.chemin," +
        "      fr_demande.reformulation, fr_demande.estimation_abaque, fr_demande.cahier_test, fr_demande.demonstration, " +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        "WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1) as bug, "+

        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+

        "    from fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +

        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "     left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "     left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "     left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +
        "    where 1=1 AND fr_demande.id_etat_demande = 2 AND fr_demande.id_personne_dev = "+ option.optionUser + " "; // AND date_trunc('week', now()) <= fr_demande.date_demande AND "+
        //" fr_demande.date_demande < date_trunc('week', now()) + '1 week'::interval ";
    }

    console.log("ID USER ===> "+option.optionUser);
    /*if(option.optionUser!=177 && option.optionUser!=487)
    {
      requete+=" AND fr_demande.id_personne_dev = "+option.optionUser+"";
    }*/
    requete+=" ORDER BY fr_demande.id_priorite ASC";

    console.log("Requete GET Liste Tache Pris TAB =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeApplicationDemandePrisProd: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV prod 33333333333333333333333333333333333333333 "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dev = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";

    var sql = "";

    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionApplication);

    if(option.optionEtatDemande){
      sql_id_etat_demande = " and fr_demande.id_etat_demande = '"+ option.optionEtatDemande + "' ";
    }
    /*if(option.optionDev) { // !== undefined && option.optionDev !== null
      sql_id_dev = " and fr_demande.id_personne_dev = "+ option.optionDev + " ";
    }*/
    if(option.optionDossier && option.optionDossier !== "a" && option.optionDossier != null){
      sql_id_dossier = " and fr_demande.id_dossier = '"+ option.optionDossier + "' ";
    }
    if(option.optionApplication && option.optionApplication !== "a" && option.optionApplication != null){
      sql_id_application =  " and fr_demande.id_application = '"+ option.optionApplication + "' ";
    }
    if(option.optionDeadline){
      sql_dead_line = " and fr_demande.delai = '"+ option.optionDeadline + "' ";
    }
    if(option.optionTypeIntervention){
      sql_id_type_intervention = " and fr_demande.id_type_intervention= '"+ option.optionTypeIntervention + "' ";
    }
    if(option.optionPriorite){
      sql_id_priorite = " and fr_demande.id_priorite = '"+ option.optionPriorite + "' ";
    }
    //modif

    console.log("===========> SELECTED DEADLINE =====================================>>>>>>>>>>>>>>>>>>>>>>>>> "+option.optionDeadline);

    var sqlFiltre = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite;
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var requete = "";
    if(sqlFiltre != "" ){
      requete = "select fr_demande.id_demande," +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande," +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_demande.temps_passe," +
        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from fr_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "     left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "     left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "     left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +
        "    where 1=1 "+ sqlFiltre;
    }else{
      requete = "select fr_demande.id_demande," +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, fr_demande.date_demande," +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_demande.temps_passe," +
        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from fr_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "     left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "     left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "     left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +
        "    where 1=1 ";
    }

    console.log("ID USER ===> "+option.optionUser);
    /*if(option.optionUser!=177)
    {
      requete+=" AND fr_demande.id_personne_dev = "+option.optionUser+"";
    }*/
    requete+=" ORDER BY fr_demande.id_priorite ASC";

    console.log("Requete GET Liste Tache Pris =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeApplicationDemandePrisGloblale: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  KDJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dev = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";

    var sql_debut_fin = "";
    var sql_debut_fin2 = "";
    var sql_debut_fin3 = "";

    var sql_id_demandeur = "";

    var sql = "";


    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionApplication);

    var sql_nb_bug = "";

    if(option.optionEtatDemande){
      sql_id_etat_demande = " and fr_demande.id_etat_demande = '"+ option.optionEtatDemande + "' ";
    }
    if(option.optionDev){ // !== undefined && option.optionDev !== null
      sql_id_dev = " and fr_demande.id_personne_dev = "+ option.optionDev + " ";
    }
    /*if(typeof option.optionDev == 'undefined' || option.optionDev == null) { // !== undefined && option.optionDev !== null
      sql_id_dev = " ";
    }*/
    if(option.optionDossier && option.optionDossier !== "a" && option.optionDossier != null){
      sql_id_dossier = " and fr_demande.id_dossier = '"+ option.optionDossier + "' ";
    }
    if(option.optionApplication && option.optionApplication !== "a" && option.optionApplication != null){
      sql_id_application =  " and fr_demande.id_application = '"+ option.optionApplication + "' ";
    }
    if(option.optionDeadline){
      sql_dead_line = " and fr_demande.delai = '"+ option.optionDeadline + "' ";
    }
    if(option.optionTypeIntervention){
      sql_id_type_intervention = " and fr_demande.id_type_intervention= '"+ option.optionTypeIntervention + "' ";
    }
    if(option.optionPriorite){
      sql_id_priorite = " and fr_demande.id_priorite = '"+ option.optionPriorite + "' ";
    }

    if(option.optionDemandeur){
      sql_id_demandeur = " and fr_demande.id_personne_demande = "+ option.optionDemandeur + " ";
    }

    //sql debut fin
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      //sql_debut_fin = " and to_char(fr_demande.date_demande, 'yyyy-mm-dd') like '"+ option.optionDebut + "%' ";
      sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionDebut + " ','YYYY-MM-DD'))) ";

      //and to_char(fr_demande.date_demande, 'yyyy-mm-dd') like '2018-03-05%'
      console.log("=============================================> DATE 1 "+sql_debut_fin);
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      //sql_debut_fin = " and to_char(fr_demande.date_demaande, 'yyyy-mm-dd') like'"+ option.optionFin + "%' ";
      sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionFin + " ','YYYY-MM-DD'))) ";
      console.log("=============================================> DATE 2 "+sql_debut_fin);
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      sql_debut_fin = "AND to_date(fr_cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD')";
      
      sql_debut_fin2 = "AND (fr_demande.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      sql_debut_fin3 = "AND to_date(fr_demande.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD')";

      //sql_debut_fin = " AND fr_cr.semaine >= (select extract('week' from to_date('" + option.optionDebut + " ','YYYY-MM-DD'))) AND fr_cr.semaine <= (select extract('week' from to_date('" + option.optionFin + " ','YYYY-MM-DD'))) ";
      //sql_debut_fin = " and (fr_demande.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      console.log("=============================================> DATE BETWEEN "+sql_debut_fin);

      sql_nb_bug = "AND to_date(dem.date_fin_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
    }

    //modif

    console.log("===========> SELECTED DEADLINE =====================================>>>>>>>>>>>>>>>>>>>>>>>>> "+option.optionDeadline);

    var sqlFiltre = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin + sql_id_demandeur;
    console.log("===========> SQL FILTRE getListeApplicationDemandePrisGloblale: "+sqlFiltre);

    var sqlFiltre2 = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin2 + sql_id_demandeur;
    var sqlFiltre3 = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin3 + sql_id_demandeur;
    console.log("===========> SQL FILTRE 2 getListeApplicationDemandePrisGloblale: "+sqlFiltre2);

    var requete = "";
    if(sqlFiltre != "" ){
      requete = "select  fr_cr.id_demande, fr_cr.date_cr, fr_demande.id_demande, fr_demande.date_fin_cr, " +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation , (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande, " +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_cr.heure as temps_passe," +

        "      fr_soustache.avancement ,fr_soustache.id_soustache , fr_soustache.estimation, fr_soustache.temps_passe as temps_passe_soustache, fr_soustache.delai as delai_soustache, fr_soustache.libelle_soustache,"+   //   <======== new

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        " WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1 "+sql_nb_bug+ ") as bug, " +

        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from  fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "    left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "    left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "    left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +

        "    LEFT JOIN fr_soustache on fr_soustache.id_soustache = fr_cr.id_sous_tache  "+  //   <======== new

        "    where 1=1 "+ sqlFiltre + " OR 1=1 "+ sqlFiltre2 ; //+ " OR 1=1 "+ sqlFiltre3;
    }else{
      requete = "select  fr_cr.id_demande, fr_cr.date_cr, fr_demande.id_demande, fr_demande.date_fin_cr," +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande, " +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_cr.heure as temps_passe," +

        "      fr_soustache.avancement , fr_soustache.id_soustache, fr_soustache.estimation, fr_soustache.temps_passe as temps_passe_soustache, fr_soustache.delai as delai_soustache, fr_soustache.libelle_soustache,"+   //   <======== new

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        " WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1) as bug, " +

        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from  fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "    left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "    left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "    left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +

        "    LEFT JOIN fr_soustache on fr_soustache.id_soustache = fr_cr.id_sous_tache  "+  //   <======== new

        "    where 1=1 AND date_trunc('week', now()) <= fr_demande.date_demande AND "+
        " fr_demande.date_demande < date_trunc('week', now()) + '1 week'::interval "; //AND fr_cr.semaine = (select max(semaine) from fr_cr JOIN fr_demande on fr_cr.id_demande = fr_demande.id_demande )
    } // AND fr_demande.id_personne_dev = "+ option.optionUser + "

    console.log("ID USER ===> "+option.optionUser);
    /*if(option.optionUser!=177 && option.optionUser!=487)
    {
      requete+=" AND fr_demande.id_personne_dev = "+option.optionUser+"";
    }*/
    requete+=" ORDER BY fr_demande.id_personne_dev ASC, fr_demande.id_demande ASC, fr_soustache.id_soustache ASC";

    console.log("Requete GET Liste Tache Pris ATOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeApplicationDemandePrisGloblaleEtat: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dev = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";
    var sql_debut_fin = "";
    var sql_debut_fin2 = "";
    var sql_debut_fin3 = "";
    var sql_id_demandeur = "";
    var sql = "";

    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionApplication);

    var sql_nb_bug = "";
    /*if(option.optionEtatDemande){
      sql_id_etat_demande = " and fr_demande.id_etat_demande = '"+ option.optionEtatDemande + "' ";
    }*/
    if(option.optionDev){
      sql_id_dev = " and fr_demande.id_personne_dev = "+ option.optionDev + " ";
    }
    if(option.optionDossier && option.optionDossier !== "a" && option.optionDossier != null){
      sql_id_dossier = " and fr_demande.id_dossier = '"+ option.optionDossier + "' ";
    }
    if(option.optionApplication && option.optionApplication !== "a" && option.optionApplication != null){
      sql_id_application =  " and fr_demande.id_application = '"+ option.optionApplication + "' ";
    }
    if(option.optionDeadline){
      sql_dead_line = " and fr_demande.delai = '"+ option.optionDeadline + "' ";
    }
    if(option.optionTypeIntervention){
      sql_id_type_intervention = " and fr_demande.id_type_intervention= '"+ option.optionTypeIntervention + "' ";
    }
    if(option.optionPriorite){
      sql_id_priorite = " and fr_demande.id_priorite = '"+ option.optionPriorite + "' ";
    }
    if(option.optionDemandeur){
      sql_id_demandeur = " and fr_demande.id_personne_demande = "+ option.optionDemandeur + " ";
    }

    //sql debut fin
    /*if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionDebut + " ','YYYY-MM-DD'))) ";
      console.log("=============================================> DATE 1 "+sql_debut_fin);
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = "AND fr_cr.semaine = (select extract('week' from to_date('" + option.optionFin + " ','YYYY-MM-DD'))) ";
      console.log("=============================================> DATE 2 "+sql_debut_fin);
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      sql_debut_fin = "AND to_date(fr_cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD')";
      sql_debut_fin2 = "AND (fr_demande.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      sql_debut_fin3 = "AND to_date(fr_demande.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD')";
      console.log("=============================================> DATE BETWEEN "+sql_debut_fin);
      sql_nb_bug = "AND to_date(dem.date_fin_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
    }*/

    //modif
    console.log("===========> SELECTED DEADLINE =====================================>>>>>>>>>>>>>>>>>>>>>>>>> "+option.optionDeadline);

    var sqlFiltre = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_id_demandeur;// + sql_debut_fin
    console.log("===========> SQL FILTRE getListeApplicationDemandePrisGloblale: "+sqlFiltre);

    var sqlFiltre2 = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_id_demandeur;// + sql_debut_fin2
    console.log("===========> SQL FILTRE 2 getListeApplicationDemandePrisGloblale: "+sqlFiltre2);

    var requete = "";
    if(sqlFiltre != "" ){
      requete = "select  fr_cr.id_demande, fr_cr.date_cr, fr_demande.id_demande, fr_demande.date_fin_cr, fr_demande.commentaire, " +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation , (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande, " +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_cr.heure as temps_passe," +

        "      fr_soustache.avancement ,fr_soustache.id_soustache , fr_soustache.estimation, fr_soustache.temps_passe as temps_passe_soustache, fr_soustache.delai as delai_soustache, fr_soustache.libelle_soustache,"+   //   <======== new

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        " WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1 "+sql_nb_bug+ ") as bug, " +

        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from  fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "    left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "    left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "    left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +

        "    LEFT JOIN fr_soustache on fr_soustache.id_soustache = fr_cr.id_sous_tache  "+  //   <======== new

        "    where 1=1  AND fr_demande.id_etat_demande in (2,4) "+ sqlFiltre + " OR 1=1  AND fr_demande.id_etat_demande in (2,4) "+ sqlFiltre2 ; 
    }else{
      requete = "select  fr_cr.id_demande, fr_cr.date_cr, fr_demande.id_demande, fr_demande.date_fin_cr, fr_demande.commentaire, " +
        "concat(r_personnel.nom ::text,' ',r_personnel.prenom ::text) AS dev, r_personnel.appelation, (select r_personnel.appelation from r_personnel where fr_demande.id_personne_demande = r_personnel.id_pers) as demandeur, fr_demande.date_demande, " +
        "p_dossier.num_dossier, fr_application.nom_application," +
        "      fr_demande.id_type_intervention," +
        "      regexp_replace(regexp_replace(fr_demande.description, E'[\\n\\r]+', ' ', 'g' ), '\\''+', '&rsquo;', 'g') as description ," +
        "      fr_demande.estimation_dev," +
        "      fr_demande.avancement_dev," +
        "      fr_demande.delai," +
        "      fr_demande.id_etat_demande," +
        "      fr_demande.id_personne_dev," +
        "      fr_demande.date_demande_termine," +
        "      fr_cr.heure as temps_passe," +

        "      fr_soustache.avancement , fr_soustache.id_soustache, fr_soustache.estimation, fr_soustache.temps_passe as temps_passe_soustache, fr_soustache.delai as delai_soustache, fr_soustache.libelle_soustache,"+   //   <======== new

        " (SELECT COUNT(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
        " WHERE app.id_application =  fr_demande.id_application AND dem.id_type_intervention = 1) as bug, " +

        "      fr_application.chemin," +
        "    fr_type_intervention.libelle as type_intervention," +
        "      fr_demande.qualite_dev," +
        "    fr_etat_demande.libelle as etat_demande, fr_priorite.libelle_priorite, " +
        "    fr_demande.id_priorite as id_priorite "+
        "    from  fr_demande left join fr_cr on fr_cr.id_demande = fr_demande.id_demande " +
        "    left join fr_application on fr_demande.id_application = fr_application.id_application" +
        "    left join fr_type_intervention on fr_demande.id_type_intervention = fr_type_intervention.id_type_intervention" +
        "    left join fr_etat_demande on fr_demande.id_etat_demande = fr_etat_demande.id_etat_demande" +
        "    left join p_dossier on fr_demande.id_dossier = p_dossier.id_dossier" +
        "    left join fr_priorite on fr_demande.id_priorite = fr_priorite.id_priorite" +
        "    left join r_personnel on fr_demande.id_personne_dev=r_personnel.id_pers" +

        "    LEFT JOIN fr_soustache on fr_soustache.id_soustache = fr_cr.id_sous_tache  "+  //   <======== new

        "    where 1=1 AND fr_demande.id_etat_demande in (2,4) ";
        //"    AND date_trunc('week', now()) <= fr_demande.date_demande AND fr_demande.date_demande < date_trunc('week', now()) + '1 week'::interval "; 
    }

    console.log("ID USER ===> "+option.optionUser);
    /*if(option.optionUser!=177 && option.optionUser!=487)
    {
      requete+=" AND fr_demande.id_personne_dev = "+option.optionUser+"";
    }*/
    requete+=" ORDER BY  fr_demande.id_priorite ASC, fr_demande.id_personne_dev ASC " //fr_demande.id_personne_dev ASC, fr_demande.id_demande ASC, fr_soustache.id_soustache ASC";

    console.log("Requete GET Liste Tache Pris ATOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeDataExport: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  ======================================> "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";
    var sql_debut_fin = "";
    var sql_id_demandeur = "";
    var sql = "";

    var sql_debut_fin2 = "";
    var sql_debut_fin3 = "";
    var sql_etat_dossier = "";
    var sql_id_dev = "";
    var sql_id_dev2 = "";
    var sql_delai_ok = "";
    var sql_delai_nok = "";
    var sql_delai_ok_nok = "";
    var sql_debut_fin_demande = "";
    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionEtatDossier);

    if(option.optionDev != "" && option.optionDev != null){
      sql_id_dev = " AND ( SELECT dem.id_personne_dev FROM fr_demande dem WHERE dem.id_application = app.id_application AND dem.id_personne_dev = "+option.optionDev+" ORDER BY dem.id_demande DESC Limit 1 ) =  " + option.optionDev;
      sql_id_dev2 = " AND  dem.id_personne_dev = "+ option.optionDev;
    }
    //sql debut fin
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD') )) ";
      //sql_debut_fin = " AND dem.date_fin_cr = '" + option.optionDebut + "'  ";
      // (select extract('week' from to_date(dem.delai,'YYYY-MM-DD') ))
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD') )) ";
      //sql_debut_fin = " AND dem.date_fin_cr = '" + option.optionFin + "'  ";
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      //sql_debut_fin = " AND cr.semaine >= (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD'))) AND cr.semaine <= (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD'))) ";
      sql_debut_fin2 = " AND  (dem.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp "+ sql_id_dev2 +"  " ;
      sql_debut_fin3 = " AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') "+ sql_id_dev2 +"  ";
      sql_debut_fin = " AND to_date(cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') "+ sql_id_dev2 +"  ";
    
      sql_debut_fin_demande = sql_debut_fin2 + " OR dem.id_application = app.id_application AND  dem.id_type_intervention = 1 " + sql_debut_fin3;

      sql_delai_ok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') "+ sql_id_dev2 +" " ;
      sql_delai_nok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') "+ sql_id_dev2 +" ";
      sql_delai_ok_nok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') "+ sql_id_dev2 +" ";
    }

    if(option.optionEtatDossier == 2){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
        "WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) = 2 ";
    }
    else if(option.optionEtatDossier == 3){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
        "WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) is null ";
    }

    var sqlFiltreDate = sql_debut_fin;

    var sqlFiltre = sql_id_etat_demande  + sql_debut_fin + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre2 = sql_id_etat_demande  + sql_debut_fin2 + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre3 = sql_id_etat_demande + sql_id_priorite + sql_debut_fin3 + sql_id_demandeur; //+ sql_id_dev
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var requete = "";
    var requete2 = "";

    if(sqlFiltre != "" ){
      requete = "select doss.num_dossier as dossier,app.nom_application as application ,   "+
      "(SELECT libelle_priorite FROM fr_demande dem JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite WHERE dem.id_application = app.id_application limit 1) as priorite, "+
      "(SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as estimation,  "+ //AND cr.id_sous_tache IS NULL     JOIN fr_cr cr ON dem.id_demande = cr.id_demande 
      
      "(SELECT MAX(to_date(dem.delai,'YYYY-MM-DD')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as delai_demande,  "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande   "+
      "WHERE dem.id_application = app.id_application AND dem.id_type_intervention IN (2,4,11,10) " + sqlFiltre + " " + sql_id_dev2  +" OR dem.id_application = app.id_application  AND dem.id_type_intervention  IN (2,4,11,10) " + sql_id_dev2  +" " + sql_debut_fin2 + ") as temps_passe_dev,    "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande   "+
      "WHERE dem.id_application = app.id_application AND dem.id_type_intervention = 1 " + sqlFiltre + " " + sql_id_dev2  +" OR dem.id_application = app.id_application  AND dem.id_type_intervention = 1 " + sql_id_dev2  +" " + sql_debut_fin2 + ") as temps_passe_bug,  "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application  "+
      " " + sqlFiltre + " " + sql_id_dev2  +" OR dem.id_application = app.id_application " + sql_id_dev2  +" " + sql_debut_fin2 + ") as temps_passe,  "+
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application) as temps_passe_total,  "+
      
      "(SELECT COUNT(dem.id_demande) FROM  fr_demande dem WHERE dem.id_application = app.id_application "+
      "AND dem.id_type_intervention = 1  " + sql_debut_fin_demande + " ) as bug,  "+
      
      "(SELECT et.libelle FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 "+
      "ORDER BY dem.id_demande DESC Limit 1 ) as etat,  "+

      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application   "+
      " " + sql_debut_fin2 + "  "+ sql_delai_nok + ") as delaiNok, "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' "+
      "AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null  AND dem.id_application = app.id_application  " + sql_debut_fin2 + "  "+ sql_delai_ok + ") as delaiOk,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' AND dem.id_application = app.id_application AND dem.date_fin_cr is not null AND dem.delai != '' "+
      " " + sql_debut_fin2 + "  "+ sql_delai_ok_nok + ") as nbDemande  "+
      
      "from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier WHERE  "+
      
      "(SELECT et.libelle FROM fr_demande dem LEFT JOIN fr_cr cr on cr.id_demande = dem.id_demande JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application  "+ 
      " " + sqlFiltre + " OR dem.id_application = app.id_application "+ sqlFiltre2 + " OR dem.id_application = app.id_application "+sqlFiltre3+  "  ORDER BY dem.id_demande DESC Limit 1 ) is not null  " + sql_etat_dossier + " " + sql_id_dev +
      
      "GROUP BY dossier,application ,app.id_application ORDER BY dossier,application";
      //fr_cr cr JOIN ON cr.id_demande = dem.id_demande 
    }else{


      requete = "select doss.num_dossier as dossier,app.nom_application as application ,   "+
      "(SELECT libelle_priorite FROM fr_demande dem  JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite WHERE dem.id_application = app.id_application limit 1) as priorite, "+
      "(SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as estimation,  "+ //AND cr.id_sous_tache IS NULL     JOIN fr_cr cr ON dem.id_demande = cr.id_demande 
      
      "(SELECT MAX(to_date(dem.delai,'YYYY-MM-DD')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as delai_demande,  "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande   "+
      "WHERE dem.id_application = app.id_application AND dem.id_type_intervention IN (2,4,11,10)) as temps_passe_dev,    "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande   "+
      "WHERE dem.id_application = app.id_application AND dem.id_type_intervention = 1) as temps_passe_bug,  "+

      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application) as temps_passe,  "+
      
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application) as temps_passe_total,  "+
      
      "(SELECT COUNT(dem.id_demande) FROM fr_demande dem WHERE dem.id_application = app.id_application "+
      "AND dem.id_type_intervention = 1) as bug,  "+
      
      "(SELECT et.libelle FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 "+
      "ORDER BY dem.id_demande DESC Limit 1 ) as etat,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.delai != '' AND dem.id_application = app.id_application ) as delaiNok, "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null  "+
      "AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null AND dem.delai != '' AND dem.id_application = app.id_application) as delaiOk,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem  WHERE dem.delai is not null AND dem.id_application = app.id_application AND dem.date_fin_cr is not null AND dem.delai != '') as nbDemande  "+
      
      "from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier WHERE  "+
      
      "(SELECT et.libelle FROM  fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2  "+
       "ORDER BY dem.id_demande DESC Limit 1 ) is not null  "+
      
      "GROUP BY dossier,application ,app.id_application ORDER BY dossier,application";
      //fr_cr cr JOIN ON cr.id_demande = dem.id_demande 
    }
    console.log("Requete GET Liste Tache Pris =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  UpdateCommentaireDemande: function(commentaire,id_demande,callback){
    var query = "UPDATE fr_demande SET commentaire = '"+commentaire+"' WHERE id_demande = "+id_demande+" ";
    Application.query(query, function(err,res){
      if(err) {console.log(err); return callback(err);}
      return callback(null, res.rows);
    });
  },

  getListeDataExportReporting: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  ======================================> "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";
    var sql_debut_fin = "";
    var sql_id_demandeur = "";
    var sql = "";

    var sql_debut_fin2 = "";
    var sql_debut_fin3 = "";
    var sql_etat_dossier = "";
    var sql_id_dev = "";
    var sql_id_dev2 = "";
    var sql_delai_ok = "";
    var sql_delai_nok = "";
    var sql_delai_ok_nok = "";
    var sql_debut_fin_demande = "";
    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionEtatDossier);

    if(option.optionDev != "" && option.optionDev != null){
      sql_id_dev = " AND ( SELECT dem.id_personne_dev FROM fr_demande dem WHERE dem.id_application = app.id_application AND dem.id_personne_dev = "+option.optionDev+" ORDER BY dem.id_demande DESC Limit 1 ) =  " + option.optionDev;
      sql_id_dev2 = " AND  dem.id_personne_dev = "+ option.optionDev;
    }
    //sql debut fin
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD') )) ";
      //sql_debut_fin = " AND dem.date_fin_cr = '" + option.optionDebut + "'  ";
      // (select extract('week' from to_date(dem.delai,'YYYY-MM-DD') ))
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD') )) ";
      //sql_debut_fin = " AND dem.date_fin_cr = '" + option.optionFin + "'  ";
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      //sql_debut_fin = " AND cr.semaine >= (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD'))) AND cr.semaine <= (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD'))) ";
      sql_debut_fin2 = " AND  (dem.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp "+ sql_id_dev2 +"  AND  dem.id_personne_dev = demande.id_personne_dev " ;
      sql_debut_fin3 = " AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') AND  dem.id_personne_dev = demande.id_personne_dev  "+ sql_id_dev2 +"  ";
      sql_debut_fin = " AND to_date(cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') AND  dem.id_personne_dev = demande.id_personne_dev   "+ sql_id_dev2 +"  ";
    
      sql_debut_fin_demande = sql_debut_fin2 + " OR dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev AND  dem.id_type_intervention = 1 AND  dem.id_personne_dev = demande.id_personne_dev   " + sql_debut_fin3;

      sql_delai_ok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') AND  dem.id_personne_dev = demande.id_personne_dev "+ sql_id_dev2 +" " ;
      sql_delai_nok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') AND  dem.id_personne_dev = demande.id_personne_dev "+ sql_id_dev2 +" ";
      sql_delai_ok_nok = " OR dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr is not null AND dem.id_application = app.id_application  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') AND  dem.id_personne_dev = demande.id_personne_dev "+ sql_id_dev2 +" ";
    }

    if(option.optionEtatDossier == 2){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
        "WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) = 2 ";
    }
    else if(option.optionEtatDossier == 3){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
        "WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) is null ";
    }

    var sqlFiltreDate = sql_debut_fin;

    var sqlFiltre = sql_id_etat_demande  + sql_debut_fin + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre2 = sql_id_etat_demande  + sql_debut_fin2 + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre3 = sql_id_etat_demande + sql_id_priorite + sql_debut_fin3 + sql_id_demandeur; //+ sql_id_dev
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var requete = "";
    var requete2 = "";

    if(sqlFiltre != "" ){
      requete = "select doss.num_dossier as dossier,app.nom_application as application , demande.id_personne_dev, pers.appelation,  "+

      "(SELECT libelle_priorite FROM fr_demande dem JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite WHERE dem.id_application = app.id_application limit 1) as priorite, "+
      "(SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as estimation,  "+ //AND cr.id_sous_tache IS NULL     JOIN fr_cr cr ON dem.id_demande = cr.id_demande 
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev  "+
      " " + sqlFiltre + " " + sql_id_dev2  +" OR dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev " + sql_id_dev2  +" " + sql_debut_fin2 + ") as temps_passe,  "+
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application) as temps_passe_total,  "+
      
      "(SELECT COUNT(dem.id_demande) FROM  fr_demande dem WHERE dem.id_application = app.id_application "+
      "AND dem.id_type_intervention = 1  " + sql_debut_fin_demande + " ) as bug,  "+
      
      "(SELECT et.libelle FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 "+
      "ORDER BY dem.id_demande DESC Limit 1 ) as etat,  "+

      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.id_application = app.id_application   "+
      " " + sql_debut_fin2 + "  "+ sql_delai_nok + ") as delaiNok, "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' "+
      "AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null  AND dem.id_application = app.id_application  " + sql_debut_fin2 + "  "+ sql_delai_ok + ") as delaiOk,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND dem.delai != '' AND dem.id_application = app.id_application AND dem.date_fin_cr is not null AND dem.delai != '' "+
      " " + sql_debut_fin2 + "  "+ sql_delai_ok_nok + ") as nbDemande,  "+
      
      "demande.reformulation, demande.estimation_abaque, demande.cahier_test, demande.demonstration "+

      "from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier "+
      "join fr_demande demande on demande.id_application = app.id_application "+
      "join r_personnel pers on demande.id_personne_dev = pers.id_pers WHERE  "+
      
      "(SELECT et.libelle FROM fr_demande dem LEFT JOIN fr_cr cr on cr.id_demande = dem.id_demande JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application  "+ 
      " " + sqlFiltre + " OR dem.id_application = app.id_application "+ sqlFiltre2 + " OR dem.id_application = app.id_application "+sqlFiltre3+  "  ORDER BY dem.id_demande DESC Limit 1 ) is not null  " + sql_etat_dossier + " " + sql_id_dev +
      
      "GROUP BY dossier,application ,app.id_application, demande.id_personne_dev, pers.appelation, demande.reformulation, demande.estimation_abaque, demande.cahier_test, demande.demonstration ORDER BY dossier,application";
      //fr_cr cr JOIN ON cr.id_demande = dem.id_demande 
    }else{


      requete = "select doss.num_dossier as dossier,app.nom_application as application , demande.id_personne_dev, pers.appelation,  "+
      "(SELECT libelle_priorite FROM fr_demande dem  JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite WHERE dem.id_application = app.id_application limit 1) as priorite, "+
      "(SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem WHERE dem.id_application = app.id_application ) as estimation,  "+ //AND cr.id_sous_tache IS NULL     JOIN fr_cr cr ON dem.id_demande = cr.id_demande 
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev) as temps_passe,  "+
      
      
      "(SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande WHERE dem.id_application = app.id_application) as temps_passe_total,  "+
      
      "(SELECT COUNT(dem.id_demande) FROM fr_demande dem WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev "+
      "AND dem.id_type_intervention = 1) as bug,  "+
      
      "(SELECT et.libelle FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 "+
      "ORDER BY dem.id_demande DESC Limit 1 ) as etat,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null AND  dem.id_personne_dev = demande.id_personne_dev AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND dem.delai != '' AND dem.id_application = app.id_application ) as delaiNok, "+
      
      "(select count(dem.id_demande) FROM fr_demande dem WHERE dem.delai is not null  "+
      "AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null AND  dem.id_personne_dev = demande.id_personne_dev AND dem.delai != '' AND dem.id_application = app.id_application) as delaiOk,  "+
      
      "(select count(dem.id_demande) FROM fr_demande dem  WHERE dem.delai is not null AND  dem.id_personne_dev = demande.id_personne_dev AND dem.id_application = app.id_application AND dem.date_fin_cr is not null AND dem.delai != '') as nbDemande , "+
      
      "demande.reformulation, demande.estimation_abaque, demande.cahier_test, demande.demonstration "+

      "from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier "+
      "join fr_demande demande on demande.id_application = app.id_application "+
      "join r_personnel pers on demande.id_personne_dev = pers.id_pers WHERE  "+
      
      "(SELECT et.libelle FROM  fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande WHERE dem.id_application = app.id_application AND  dem.id_personne_dev = demande.id_personne_dev  AND et.id_etat_demande = 2  "+
       "ORDER BY dem.id_demande DESC Limit 1 ) is not null  "+
      
      "GROUP BY dossier,application ,app.id_application , demande.id_personne_dev, pers.appelation,  demande.reformulation, demande.estimation_abaque, demande.cahier_test, demande.demonstration ORDER BY dossier,application";
      //fr_cr cr JOIN ON cr.id_demande = dem.id_demande 
    }
    console.log("Requete GET Liste Tache Pris =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },


  getListeDataExportDossier: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  ======================================> "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";
    var sql_debut_fin = "";
    var sql_id_demandeur = "";
    var sql = "";

    var sql_debut_fin2 = "";
    var sql_debut_fin3 = "";
    var sql_etat_dossier = "";
    var sql_id_dev = "";
    var sql_id_dev2 = "";
    var sql_delai_ok = "";
    var sql_delai_nok = "";
    var sql_delai_ok_nok = "";
    var sql_debut_fin_demande = "";
    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionEtatDossier);

    if(option.optionDev != "" && option.optionDev != null){
      sql_id_dev = " AND ( SELECT dem.id_personne_dev FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application WHERE app.id_dossier = doss.id_dossier ORDER BY dem.id_demande DESC Limit 1 ) =  " + option.optionDev;
      sql_id_dev2 = " AND  dem.id_personne_dev = "+ option.optionDev;
    }
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD') )) ";
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD') )) ";
    }
    if(option.optionDebut != "" && option.optionFin != ""){
       sql_debut_fin2 = " AND  (dem.date_demande)::timestamp BETWEEN ('" + option.optionDebut + " ')::timestamp and('" + option.optionFin + " ')::timestamp ";
      sql_debut_fin3 = " AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
      sql_debut_fin = " AND to_date(cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
    
      sql_debut_fin_demande = sql_debut_fin2 + " OR app.id_dossier = doss.id_dossier AND dem.id_type_intervention = 1 " + sql_debut_fin3;


      sql_delai_ok = " OR dem.delai is not null AND dem.date_fin_cr::date <= dem.delai::date AND dem.date_fin_cr is not null AND app.id_dossier = doss.id_dossier  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
      sql_delai_nok = " OR dem.delai is not null AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null AND app.id_dossier = doss.id_dossier  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
      sql_delai_ok_nok = " OR dem.delai is not null AND dem.date_fin_cr is not null AND app.id_dossier = doss.id_dossier  AND to_date(dem.delai,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
    }

    if(option.optionEtatDossier == 2){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
        " JOIN fr_application app on dem.id_application = app.id_application "+
        " WHERE app.id_dossier = doss.id_dossier AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) = 2 ";
    }
    else if(option.optionEtatDossier == 3){
      sql_etat_dossier = "  AND ( SELECT et.id_etat_demande FROM fr_demande dem JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande "+
      " JOIN fr_application app on dem.id_application = app.id_application "+  
      " WHERE app.id_dossier = doss.id_dossier AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) is null ";
    }

    var sqlFiltreDate = sql_debut_fin;

    var sqlFiltre = sql_id_etat_demande  + sql_debut_fin + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre2 = sql_id_etat_demande  + sql_debut_fin2 + sql_id_demandeur; //+ sql_id_dev
    var sqlFiltre3 = sql_id_etat_demande + sql_id_priorite + sql_debut_fin3 + sql_id_demandeur; //+ sql_id_dev
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var requete = "";
    var requete2 = "";

    if(sqlFiltre != "" ){
      requete = "select doss.num_dossier as dossier, "+
 
      " (SELECT libelle_priorite FROM fr_demande dem JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier limit 1) as priorite,  "+
      
      " (SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier ) as estimation,   "+
      
      " (SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier     "+ sqlFiltre  + " " + sql_id_dev2 + " "+
      " OR app.id_dossier = doss.id_dossier     " + sql_id_dev2  + " " + sql_debut_fin2 + ") as temps_passe,  "+
      
      " (SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr  "+
      " JOIN fr_demande dem ON cr.id_demande = dem.id_demande JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier) as temps_passe_total,   "+
      
      " (SELECT COUNT(dem.id_demande) FROM   "+
      " fr_demande dem "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.id_type_intervention = 1  " + sql_debut_fin_demande + " ) as bug,  "+ 
      
      " (SELECT et.libelle FROM fr_demande dem  "+
      " JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) as etat,   "+
      
      " (select count(dem.id_demande) FROM fr_demande dem "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null AND dem.date_fin_cr::date > dem.delai::date AND dem.date_fin_cr is not null "+ 
        sql_debut_fin2 + "  "+ sql_delai_nok + ") as delaiNok,  "+
      
      " (select count(dem.id_demande) FROM fr_demande dem "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null  AND dem.date_fin_cr::date <= dem.delai::date  AND dem.date_fin_cr is not null  "+ 
        sql_debut_fin2 + "  "+ sql_delai_ok + ") as delaiOk, "+  
        
      " (select count(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null AND dem.date_fin_cr is not null  "+ 
        sql_debut_fin2 + "  "+ sql_delai_ok_nok + ") as nbDemande "+
      
      " from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier  "+
      
      " WHERE   "+
      " (SELECT et.libelle FROM fr_demande dem  "+
      " LEFT JOIN fr_cr cr on cr.id_demande = dem.id_demande  "+
      " JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande  "+
      " WHERE dem.id_application = app.id_application     "+ sqlFiltre +
      " OR dem.id_application = app.id_application   "+ sqlFiltre2 + 
      " OR dem.id_application = app.id_application   "+ sqlFiltre3 +
      " ORDER BY dem.id_demande DESC Limit 1 ) is not null  "+ sql_etat_dossier + " " + sql_id_dev  +
      
      " GROUP BY dossier,doss.id_dossier ORDER BY dossier";
    }else{
      requete = "select doss.num_dossier as dossier, "+
 
      " (SELECT libelle_priorite FROM fr_demande dem JOIN fr_priorite on fr_priorite.id_priorite=dem.id_priorite "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier limit 1) as priorite,  "+
      
      " (SELECT SUM(TO_NUMBER(dem.estimation_dev,'9999999')) FROM fr_demande dem  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier ) as estimation,   "+
      
      " (SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr JOIN fr_demande dem ON cr.id_demande = dem.id_demande  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier) as temps_passe,   "+
      
      " (SELECT SUM(TO_NUMBER(cr.heure,'99999999')) FROM fr_cr cr  "+
      " JOIN fr_demande dem ON cr.id_demande = dem.id_demande JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier) as temps_passe_total,   "+
      
      " (SELECT COUNT(dem.id_demande) FROM "+
      " fr_demande dem  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.id_type_intervention = 1) as bug,  "+ 
      
      " (SELECT et.libelle FROM fr_demande dem  "+
      " JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) as etat,   "+
      
      " (select count(dem.id_demande) FROM fr_demande dem  "+
      " JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null AND dem.date_fin_cr::date > dem.delai::date) as delaiNok,  "+
      
      " (select count(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null  AND dem.date_fin_cr::date <= dem.delai::date) as delaiOk, "+  
        
      " (select count(dem.id_demande) FROM fr_demande dem JOIN fr_application app on dem.id_application = app.id_application "+
      " WHERE app.id_dossier = doss.id_dossier AND dem.delai is not null AND dem.date_fin_cr is not null) as nbDemande "+
      
      " from fr_application app join p_dossier doss on app.id_dossier = doss.id_dossier  "+
      
      " WHERE   "+
      " (SELECT et.libelle FROM fr_demande dem  "+
      " LEFT JOIN fr_cr cr on cr.id_demande = dem.id_demande  "+
      " JOIN fr_etat_demande et ON et.id_etat_demande= dem.id_etat_demande  "+
      " WHERE dem.id_application = app.id_application AND et.id_etat_demande = 2 ORDER BY dem.id_demande DESC Limit 1 ) is not null  "+  
      
      " GROUP BY dossier,doss.id_dossier ORDER BY dossier";
    }
    console.log("Requete GET Liste Tache Pris =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeDataCRtotal: function(option, callback) {
    console.log("===========> SQL FILTRE  OPTION DEV  KDJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ "+option.optionDev);

    //modif
    var sql_id_etat_demande = "";
    var sql_id_dev = "";
    var sql_id_dossier = "";
    var sql_id_application = "";
    var sql_dead_line = "";
    var sql_id_type_intervention = "";
    var sql_id_priorite = "";
    var sql_debut_fin = "";
    var sql_id_demandeur = "";
    var sql = "";
    var sqlFltr_srq = "";
    var sqlFltr_srq2 = "";

    var dateDeb = null;
    var dateFin =  null;

    console.log("===========> OPTION APP =====================================~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ "+option.optionApplication);

    //sql debut fin
    if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionDebut + "','YYYY-MM-DD'))) ";

      dateDeb = option.optionDebut;
      sqlFltr_srq = " AND d.date_demande = to_date('" + option.optionDebut + "','YYYY-MM-DD') ";
      console.log("=============================================> DATE 1 "+sql_debut_fin);
    }
    if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
      sql_debut_fin = " AND cr.semaine = (select extract('week' from to_date('" + option.optionFin + "','YYYY-MM-DD'))) ";
      dateFin = option.optionFin;
      sqlFltr_srq = " AND d.date_demande = to_date('" + option.optionFin + "','YYYY-MM-DD') ";
      console.log("=============================================> DATE 2 "+sql_debut_fin);
    }
    if(option.optionDebut != "" && option.optionFin != ""){
      sqlFltr_srq = " AND d.date_demande between to_date('" + option.optionDebut + "','YYYY-MM-DD') and to_date('" + option.optionFin + "','YYYY-MM-DD') ";
      sqlFltr_srq2 = " AND to_date(d.date_fin_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + "','YYYY-MM-DD') and to_date('" + option.optionFin + "','YYYY-MM-DD') ";

      sql_debut_fin = "AND to_date(cr.date_cr,'YYYY-MM-DD') between to_date('" + option.optionDebut + " ','YYYY-MM-DD') AND  to_date('" + option.optionFin + " ','YYYY-MM-DD') ";
      console.log("=============================================> DATE BETWEEN "+sql_debut_fin);
      dateDeb = option.optionDebut;
      dateFin = option.optionFin;
    }

    var sqlFiltreDate = sql_debut_fin;

    var sqlFiltre = sql_id_etat_demande + sql_id_dev + sql_id_dossier + sql_id_application + sql_dead_line + sql_id_type_intervention + sql_id_priorite + sql_debut_fin + sql_id_demandeur;
    console.log("===========> SQL FILTRE "+sqlFiltre);

    var requete = "";
    if(sqlFiltre != "" ){

      requete = "SELECT dem.id_personne_dev, pers.appelation, "+
      "(SELECT get_count_total_heure_date(3,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as assistance, "+
      "(SELECT get_count_total_heure_date(2,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as developpement, "+
      "(SELECT get_count_total_heure_date(4,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as nouvelle, "+
      "(SELECT get_count_total_heure_date(5,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as recherche,  "+
      "(SELECT get_count_total_heure_date(1,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as bug,  "+
      "(SELECT get_count_total_heure_date(9,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as gestion,  "+
      "(SELECT get_count_total_heure_date(8,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as reunion, "+
      "(SELECT get_count_total_heure_date(7,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as redaction, "+
      "(SELECT get_count_total_heure_date(10,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as test, "+
      "(SELECT get_count_total_heure_date(6,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as formation, "+
      "(SELECT get_count_total_heure_date(11,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as analyse, "+

      "(SELECT get_count_nombre_total_date(3,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as assistanceNb,  "+
      "(SELECT get_count_nombre_total_date(2,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as developpementNb,  "+
      "(SELECT get_count_nombre_total_date(5,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as rechercheNb,  "+
      "(SELECT get_count_nombre_total_date(1,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as bugNb,  "+
      "(SELECT get_count_nombre_total_date(9,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as gestionNb,  "+
      "(SELECT get_count_nombre_total_date(8,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as reunionNb, "+
      "(SELECT get_count_nombre_total_date(7,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as redactionNb, "+
      "(SELECT get_count_nombre_total_date(10,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as testNb, "+
      "(SELECT get_count_nombre_total_date(6,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as formationNb, "+
      "(SELECT get_count_nombre_total_date(11,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as analyseNb, "+

      "(SELECT get_count_nombre_app(2,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as appEnCours, "+
      "(SELECT get_count_nombre_app_termine(3,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as appTermine, "+

      "(SELECT get_count_somme_temps(2,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as tempsEstime, "+
      "(SELECT get_count_somme_temps_passe(2,dem.id_personne_dev, '"+dateDeb+"', '"+dateFin+"' )) as tempsPasse, "+

      "(select count(d.id_demande) FROM fr_demande d WHERE d.delai != '' AND d.date_fin_cr::date <= d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev "+sqlFltr_srq+" "+
        " OR   d.delai != '' AND d.date_fin_cr::date <= d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev " + sqlFltr_srq2 +") as delaiOK, "+

      "(select count(d.id_demande) FROM fr_demande d WHERE d.delai != '' AND d.date_fin_cr::date > d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev "+sqlFltr_srq+"  "+
      "   OR   d.delai != '' AND d.date_fin_cr::date > d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev " + sqlFltr_srq2 +" ) as delaiNOK "+

      "FROM fr_demande dem JOIN fr_cr cr ON cr.id_demande = dem.id_demande  join r_personnel pers on dem.id_personne_dev = pers.id_pers WHERE 1=1 "+ sqlFiltre +
      "GROUP BY dem.id_personne_dev , pers.appelation ORDER BY dem.id_personne_dev ";

    }else{

      requete = "SELECT dem.id_personne_dev, pers.appelation, "+
      "(SELECT get_count_total_heure_date(3,dem.id_personne_dev, null, null )) as assistance, "+
      "(SELECT get_count_total_heure_date(2,dem.id_personne_dev, null, null )) as developpement, "+
      "(SELECT get_count_total_heure_date(4,dem.id_personne_dev, null, null )) as nouvelle, "+
      "(SELECT get_count_total_heure_date(5,dem.id_personne_dev, null, null )) as recherche,  "+
      "(SELECT get_count_total_heure_date(1,dem.id_personne_dev, null, null )) as bug,  "+
      "(SELECT get_count_total_heure_date(9,dem.id_personne_dev, null, null )) as gestion,  "+
      "(SELECT get_count_total_heure_date(8,dem.id_personne_dev, null, null )) as reunion,  "+
      "(SELECT get_count_total_heure_date(7,dem.id_personne_dev, null, null )) as redaction,  "+
      "(SELECT get_count_total_heure_date(10,dem.id_personne_dev, null, null )) as test,  "+
      "(SELECT get_count_total_heure_date(6,dem.id_personne_dev, null, null )) as formation,  "+
      "(SELECT get_count_total_heure_date(11,dem.id_personne_dev, null, null )) as analyse,  "+

      "(SELECT get_count_nombre_total_date(3,dem.id_personne_dev, null, null )) as assistanceNb,  "+
      "(SELECT get_count_nombre_total_date(2,dem.id_personne_dev, null, null )) as developpementNb,  "+
      "(SELECT get_count_nombre_total_date(5,dem.id_personne_dev, null, null )) as rechercheNb,  "+
      "(SELECT get_count_nombre_total_date(1,dem.id_personne_dev, null, null )) as bugNb,  "+
      "(SELECT get_count_nombre_total_date(9,dem.id_personne_dev, null, null )) as gestionNb,  "+
      "(SELECT get_count_nombre_total_date(8,dem.id_personne_dev, null, null )) as reunionNb,  "+
      "(SELECT get_count_nombre_total_date(7,dem.id_personne_dev, null, null )) as redactionNb,  "+
      "(SELECT get_count_nombre_total_date(10,dem.id_personne_dev, null, null )) as testNb,  "+
      "(SELECT get_count_nombre_total_date(6,dem.id_personne_dev, null, null )) as formationNb,  "+
      "(SELECT get_count_nombre_total_date(11,dem.id_personne_dev, null, null )) as analyseNb,  "+

      "(SELECT get_count_nombre_app(2,dem.id_personne_dev, null, null )) as appEnCours, "+
      "(SELECT get_count_nombre_app(3,dem.id_personne_dev, null, null )) as appTermine, "+

      "(SELECT get_count_somme_temps(2,dem.id_personne_dev, null, null )) as tempsEstime, "+
      "(SELECT get_count_somme_temps_passe(2,dem.id_personne_dev, null, null )) as tempsPasse, "+

      "(select count(d.id_demande) FROM fr_demande d WHERE d.delai != '' AND d.date_fin_cr::date <= d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev) as delaiOK, "+
      "(select count(d.id_demande) FROM fr_demande d WHERE d.delai != '' AND d.date_fin_cr::date > d.delai::date AND d.date_fin_cr is not null AND d.id_personne_dev = dem.id_personne_dev) as delaiNOK "+

      "FROM fr_demande dem  join r_personnel pers on dem.id_personne_dev = pers.id_pers "+
      "GROUP BY dem.id_personne_dev , pers.appelation  ORDER BY dem.id_personne_dev ";

    }
    console.log("Requete GET Liste Tache Pris =======>"+requete);
    console.log("fin requete application encours ++++++++");
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },
  
  getListeDataProcessusTotal: function(option, callback) {

    var requete = "";
    console.log("Requete GET Processus =======> 1 ");
    if(option.optionDebut != "" && option.optionFin != ""){
      console.log("Requete GET Processus =======> 2");
      requete = "select fr_processus_dev.id, fr_calcul.libelle as calcul, fr_indicateur.numero, fr_indicateur.libelle as indicateur, fr_cible.libelle as cible, "+
    
      //cible 1
      "(select get_kpi_count_nombre_delai_ok('"+ option.optionDebut + "', '"+ option.optionFin + "')) as delaiOk, "+
      "(select get_kpi_count_nombre_demande('"+ option.optionDebut + "', '"+ option.optionFin + "')) as nbDemande, "+

      //cible 2
      "(get_kpi_count_nombre_delai_atteint('"+ option.optionDebut + "', '"+ option.optionFin + "')) as delaiAtteint, "+
      "(SELECT get_kpi_count_nombre_heure_appli_bug('"+ option.optionDebut + "', '"+ option.optionFin + "')) as heureAppliBug, "+

      //cible 4
      "(SELECT get_kpi_count_nombre_appli_bug('"+ option.optionDebut + "', '"+ option.optionFin + "')) as appliBug, "+
      "(SELECT get_kpi_count_nombre_appli_total('"+ option.optionDebut + "', '"+ option.optionFin + "')) as appliTotal, "+

      //cible 5
      "(SELECT get_kpi_count_nombre_demande_bug('"+ option.optionDebut + "', '"+ option.optionFin + "')) as demandeBug, "+
      "(SELECT get_kpi_count_nombre_demande_total('"+ option.optionDebut + "', '"+ option.optionFin + "')) as demandeTotal, "+

      //cible 6
      "(SELECT get_kpi_count_total_temps('"+ option.optionDebut + "', '"+ option.optionFin + "')) as totalTemps, "+

      //cible 8
      //a delai 1 application[i].date_fin_cr <= application[i].delai
      "(SELECT get_kpi_count_heure_priorite('"+ option.optionDebut + "', '"+ option.optionFin + "', 1)) as heureUrgent, "+
      "(SELECT get_kpi_count_heure_priorite_total('"+ option.optionDebut + "', '"+ option.optionFin + "', 1)) as heureTotalUrgent, "+

       //b important
      "(SELECT get_kpi_count_heure_priorite('"+ option.optionDebut + "', '"+ option.optionFin + "', 2)) as heureImportant, "+
      "(SELECT get_kpi_count_heure_priorite_total('"+ option.optionDebut + "', '"+ option.optionFin + "', 2)) as heureTotalImportant, "+

       //c normal
      "(SELECT get_kpi_count_heure_priorite('"+ option.optionDebut + "', '"+ option.optionFin + "', 3)) as heureNormal, "+
      "(SELECT get_kpi_count_heure_priorite_total('"+ option.optionDebut + "', '"+ option.optionFin + "', 3)) as heureTotalNormal, "+

      //cible 9
      "(SELECT get_kpi_count_nombre_appli_new('"+ option.optionDebut + "', '"+ option.optionFin + "')) as appliNew, "+

      //cible 10
      "(SELECT get_kpi_count_nombre_bug_type_app('"+ option.optionDebut + "', '"+ option.optionFin + "',4)) as appliNewNbBug, "+
      
      //cible 11
      "(SELECT get_kpi_count_nombre_appli_update('"+ option.optionDebut + "', '"+ option.optionFin + "')) as appliUpdate, "+

      //cible 12
      "(SELECT get_kpi_count_nombre_bug_type_app('"+ option.optionDebut + "', '"+ option.optionFin + "',1)) as appliUpdateNbBug "+
      
      "from fr_processus_dev "+
      "left join fr_calcul on fr_processus_dev.id_calcul = fr_calcul.id "+
      "left join fr_indicateur on fr_processus_dev.id_indicateur = fr_indicateur.id "+
      "left join fr_cible on fr_processus_dev.id_cible = fr_cible.id "+
      "order by fr_indicateur.id";
    }
    
    console.log("Requete GET Processus =======>"+requete);
    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },
 
  getListeDataGantt: function(option, callback) {
    console.log("===========> SQL GANTT **************************************************** ");

    requete = "SELECT dem.id_personne_dev, pers.appelation, doss.num_dossier, dem.description, dem.id_demande, app.nom_application, dem.date_demande, dem.delai "+
    "FROM fr_demande dem   "+
    "join r_personnel pers on dem.id_personne_dev = pers.id_pers  "+
    "join fr_application app on dem.id_application = app.id_application "+
    "join p_dossier doss on app.id_dossier = doss.id_dossier "+
    "where dem.id_etat_demande in (2) "+
    "GROUP BY dem.id_personne_dev , pers.appelation, doss.num_dossier, app.nom_application, dem.date_demande, dem.delai, dem.description, dem.id_demande "+
    "order by dem.id_personne_dev";

    console.log("Requete GET DATA GANTT =======>"+requete);
    console.log("fin requete gantt ++++++++");

    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeDataGanttDossier: function(option, callback) {
    console.log("===========> SQL GANTT **************************************************** ");

    requete = "SELECT dem.id_personne_dev, pers.appelation, doss.num_dossier, dem.description, dem.id_demande, app.nom_application, dem.date_demande, dem.delai "+
    "FROM fr_demande dem   "+
    "join r_personnel pers on dem.id_personne_dev = pers.id_pers  "+
    "join fr_application app on dem.id_application = app.id_application "+
    "join p_dossier doss on app.id_dossier = doss.id_dossier "+
    "where dem.id_etat_demande in (2) "+
    "GROUP BY dem.id_personne_dev , pers.appelation, doss.num_dossier, app.nom_application, dem.date_demande, dem.delai, dem.description, dem.id_demande "+
    "order by doss.num_dossier";

    console.log("Requete GET DATA GANTT =======>"+requete);
    console.log("fin requete gantt ++++++++");

    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getListeDataGanttApplication: function(option, callback) {
    console.log("===========> SQL GANTT **************************************************** ");

    requete = "SELECT dem.id_personne_dev, pers.appelation, doss.num_dossier, dem.description, dem.id_demande, app.nom_application, dem.date_demande, dem.delai "+
    "FROM fr_demande dem   "+
    "join r_personnel pers on dem.id_personne_dev = pers.id_pers  "+
    "join fr_application app on dem.id_application = app.id_application "+
    "join p_dossier doss on app.id_dossier = doss.id_dossier "+
    "where dem.id_etat_demande in (2) "+
    "GROUP BY dem.id_personne_dev , pers.appelation, doss.num_dossier, app.nom_application, dem.date_demande, dem.delai, dem.description, dem.id_demande "+
    "order by app.nom_application";

    console.log("Requete GET DATA GANTT =======>"+requete);
    console.log("fin requete gantt ++++++++");

    Application.query(requete, function(err,res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  getOneDemande: function(option, callback){
    var req = "SELECT * FROM fr_demande WHERE id_demande = " + option;
    Demande.query(req, function(err, res){
      if(err) return callback(err);
      return callback(null, res.rows);
    });
  },

  uploadOneDemande: function(id, abaque, cTest){
    var req = "UPDATE fr_demande set abaque ='" + abaque + "', file_test ='" + cTest +"' WHERE id_demande=" + id;
    console.log(req);
    Demande.query(req, function(err){
      if(err) return err;
      return true;
    })
  }

};

