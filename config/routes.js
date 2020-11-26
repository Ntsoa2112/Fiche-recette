/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, styleshegetStatets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    controller: 'DashBoardController',
    action: 'sendData'
  },

  //_____________________________________authentification
  'get /login': 'AuthController.loginSimple',

  'post /login': 'AuthController.loginLdap', 

  '/logout': 'AuthController.logout', 

  'get /signup': {  
    view: 'signup'
  },

//_____________________________________Accueil
  '/accueil': { 
    //view: 'accueil'
    controller: 'ApplicationController',
    action: 'findApplication'
  },

  //_____________________________________Liste application Ã  tester
  '/listeApplication': { 
    //view: 'accueil'
    controller: 'ApplicationController',
    action: 'findApplicationToTest'
  },

  //_____________________________________Modifier application
  'get /modifierApplication': {
    controller: 'ApplicationController',
    action: 'updateApp'
  },

  //_____________________________________Liste application testÃ©es
  '/listAppTest': {
    controller: 'ApplicationController',
    action: 'findApplicationTested'
  },

  //_____________________________________Liste application Ã  tester
  '/voirResultatTest': {
    view:'test/resultatTest'
  },

  //_____________________________________Modifier test
  'get /modifierTest': {
    controller: 'TestController',
    action: 'updateTest'
  },

  //_____________________________________Modifier test specifique
  '/modifierTestSpecifique': {
    controller: 'TestController',
    action: 'updateTestSpec'
  },

  //_____________________________________Modifier test byId
  'get /testById': 'TestController.findTestById',

  //_____________________________________Modifier test specifique byId
  'get /testSpecById': 'TestController.findTestSpecById',

  //_____________________________________Supprimer test byId
  'get /testSupprById': 'TestController.deleteTest',

  //_____________________________________Details application
  'get /appById': 'ApplicationController.findApplicationById',

  //_____________________________________Details application test
  'get /appByIdTest': 'ApplicationController.findApplicationByIdTest',

  //_____________________________________Modifier application
  'get /appByIdUpdate': 'ApplicationController.findApplicationByIdUpdate',

  //_____________________________________Dashboard
  'get /dashboard': { //makany am dashboard
    controller: 'DashBoardController',
    action: 'sendData'
  },

//_____________________________________Apercu pdf
  '/apercuPdf': {
    controller: 'PdfController',
    action: 'apercuPdf'
  },

  //_____________________________________Generer pdf
  '/genererPdf': {
    controller: 'ApplicationController',
    action: 'findApplicationForPDF'
  },

//__________________________________________________generate
  '/generate': {
    controller: 'PdfController',
    action: 'generatePdf'
  },

  //_____________________________________PDF OK
  '/pdfOk': {
    view: 'application/pdfOk'
  },

  //_____________________________________Liste test
  '/listeTest': {
    controller: 'TestController',
    action: 'findTest'
  },

  //_____________________________________Liste test spÃ©cifique
  '/listeTestSpecifique': {
    controller: 'TestController',
    action: 'findTestSpecifique'
  },

  //_____________________________________Liste dossier
  '/listeDossier': {
    controller: 'DossierController',
    action: 'findDossier'
  },

  //_____________________________________Liste etape
  '/listeEtape': {
    controller: 'EtapeController',
    action: 'findEtape'
  },

  //_____________________________________liste User
  '/listeUser': { //makany am page d'accueil
    controller: 'UserController',
    action: 'getUser'
  },

  //_____________________________________Encoi E-mail
  /*'/envoiEmail': {
    view: 'test/envoiEmail'
  },*/

  //_____________________________________Ajout application
  '/ajoutApplication': {
    controller: 'ApplicationController',
    action: 'createApplication'
  },
   '/TestajoutApplication': {
    controller: 'ApplicationController',
    action: 'TestgetTabFonctionnalite'
  },


  //========================================================================================================================================================
  //_____________________________________Demande intervention
  '/demandeIntervention': {
    controller: 'DemandeController',
    action: 'indexDemande'
  },

  '/insertDemandeIntervention': {
    controller: 'DemandeController',
    action: 'demandeIntervention'
  },


    //_____________________________________Demande nouvelle application
  '/demandeApplication': {
    controller: 'DemandeController',
    action: 'demandeApplication'
  },

     //_____________________________________demande assistance
  '/statistiqueDemande': {
    controller: 'DemandeController',
    action: 'getStatistiqueDemande'
  },

  //Recherche et developpement
  '/rechercheDeveloppements': {
    controller: 'DemandeController',
    action: 'rechercheDeveloppement'
  },


//========================================================================================================================================================

  //_____________________________________Supprimer application ***********************************************************************
  'get /supprApplication': {
    controller: 'ApplicationController',
    action: 'deleteApplication'
  },

  //_____________________________________Supprimer type test ***********************************************************************
  'get /supprTypeTest': {
    controller: 'TypeTestController',
    action: 'deleteTypeTest'
  },


  //_____________________________________Ajout test commun
  '/ajoutTest': {
    controller: 'TestController',
    action: 'createTest'
  },

   //_____________________________________Ajout test commun
  '/ajoutTestApp': {
    controller: 'TestController',
    action: 'createTestApp'
  },

   //_____________________________________Ajout test commun
  '/ajoutTestAppMulti': {
    controller: 'TestController',
    action: 'createTestAppMulti'
  },

  //_____________________________________Ajout test commun makany ampage view
  '/ajoutTestCommun': {
    controller: 'TestController',
    action: 'ajoutTest'
  },

  //_____________________________________Ajout test commun makany ampage view
  '/assignerTest': {
    controller: 'TestController',
    action: 'assignerTest'
  },

  //_____________________________________Ajout test commun makany ampage view
  '/ajoutTypeTest': {
    controller: 'TypeTestController',
    action: 'createTypeTest'
  },

  //_____________________________________Ajout test commun makany ampage view
  '/listeTypeTest': {
    controller: 'TypeTestController',
    action: 'findTypeTest'
  },

  //_____________________________________Ajout test specifique
  '/ajoutTestSpecifiqueApplication': {
    controller: 'ApplicationController',
    action: 'findApplicationTestSpecifique'
  },

  //_____________________________________Ajout test specifique
  '/ajoutTestSpecifique': {
    controller: 'TestController',
    action: 'createTestSpec'
  },

  //____________________________________Profile
  '/profil': { //makany am dashboard
    controller: 'ProfileController',
    action: 'getApplicationPris'
  },

  //_____________________________________Encoi E-mail
  '/pageTest': {
    view: 'test/pageTest'
  },

  //_____________________________________Ajout recette
  '/ajoutRecettePage': {
    view:'recette/ajoutRecette'
  },
  '/ajoutRecette': {
    controller: 'RecetteController',
    action: 'createRecette'
  },

  //_____________________________________Liste recette
  '/listeRecette': {
    controller: 'RecetteController',
    action: 'findRecette'
  },

//_____________________________________Modifier recette byId
  'get /recetteById': 'RecetteController.findRecetteById',


  //___________________________________Liste appli par dossier
  '/dossierApplication': {
    controller: 'ApplicationController',
    action: 'findAppliDossier'
  },

  //_____________________________________Ajout application par dossier
  'get /dossierById': 'DossierController.findDossierById',

  //_____________________________________Details dossier
  'get /dossierDetailById': 'ApplicationController.findAppliDossier',

  //_____________________________________Resultat TEST
  'get /appByIdResultatTest': 'ResultatController.createResultat',


  'get /getLsEtape': 'DashboardController.getLsEtape',
  'get /getLsDossier': 'DashboardController.getLsDossier',
  'get /getLsApplication': 'DashboardController.getLsApplication',
  'get /getLsFonctionnalite': 'DashboardController.getLsFonctionnalite',
  'get /getLsApplicationTab': 'DashboardController.getLsApplicationTab',
  'get /getLsTestTab': 'DashboardController.getLsTestTab',
  'get /getStat': 'DashboardController.getStat',//stat
  'get /getLsTestTabAttente': 'DashboardController.getLsTestTabAttente', //test en attente dashboard


  //_____________________________________Type test by id Modifier
  'get /typeTestById': 'TypeTestController.findTypeTestById',
  //_____________________________________Modifier test
  'get /modifierTypeTest': {
    controller: 'TypeTestController',
    action: 'updateTypeTest'
  },


  //**********************************************************************************************************************

  '/listeAdministrateur':'DroitController.findDroit',
  'get /modifierDroit': 'DroitController.deleteDroit',
  'get /ajoutAdministrateur': 'DroitController.deleteDroit',


  //**********************************************************************************************************************
  'get /getTypeTestApp': 'ApplicationController.getTypeTestApp',//stat type test


  'get /commencerTest': 'TestApplicationController.debutTest',

  'get /finTest': 'TestApplicationController.finTest',

  'get /toExcel': 'ExcelController.createExcel',

  //CHAT EXEMPLE
  '/chatExemple':'ChatController.do',

  //Email
  '/a' : 'MailController.sendEmailNode',


  //socket
  '/notifApplicationValide':'SocketController.setNotificationAppliValide',

  //Modifier status notification
  'get /modifierNotification': 'NotificationController.setNotificationView',

  //Insert email
  'get /insertEmailUser': 'UserController.updateUserEmail',

  //_____________________________________supprimer fonctionnalite ***********************************************************************
  'get /deleteFonctionnalite': {
    controller: 'FonctionnaliteController',
    action: 'deleteFonctionnalite'
  },

  //_____________________________________modifier fonctionnalite ***********************************************************************
  'get /updateFonctionnalite': {
    controller: 'FonctionnaliteController',
    action: 'updateFonctionnalite'
  },

  //_____________________________________creer fonctionnalite ***********************************************************************
  'get /createFonctionnalite': {
    controller: 'FonctionnaliteController',
    action: 'createFonctionnalite'
  },

  '/testFonctionnalite': {
    controller: 'ApplicationController',
    action: 'test'
  },

   'get /ajoutTests': {
    controller: 'TestController',
    action: 'ajoutTests'
  },
  // RONNY ADD ROUTE DEMANDE APPLICATION
  '/ListeDemandeApp': {
    view:'application/ListeDemandeApplication',
    locals: {
      layout: false
    }
  },
  'get /getLsDemandeApp':{
    controller: 'DemandeController',
    action: 'getListeDemandeApplication'
  },

  'get /getLsDemandeNewApp':{
    controller: 'DemandeController',
    action: 'getListeDemandeNouvelleApplication'
  },

  'get /Assigner_Application_Dev':{
    controller: 'DemandeController',
    action: 'assignerDeveloppeurDemandeApplication'
  },

   'get /Assigner_New_Application_Dev':{
    controller: 'DemandeController',
    action: 'assignerDeveloppeurDemandeNewApplication'
  },
  /*'/testTEMPLATE': {
    view:'application/TEST_TEMPLATE_DATE_PICKER',
    locals: {
      layout: false
    }
  }*/
    //_____________________________________Supprimer application ***********************************************************************
  'get /terminerDemande': {
    controller: 'DemandeController',
    action: 'updateEtatDemande'
  },

  /*
    TEST CSV SERVICE
  */
   '/testCsv': {
    controller: 'CsvController',
    action: 'insertFonctionnaliteCsv'
  },

  //CR get
    '/toExcelCR': 'ExcelController.createExcelCR',

  //Sous tache
   '/gestionSousTache': {
    controller: 'DemandeController',
    action: 'indexSousTache'
  },

  //GET CR
  '/getCRAll': {
    controller: 'ProfileController',
    action: 'getCRAll'
  },

  '/getAvancementAll': {
    controller: 'ProfileController',
    action: 'getAvancementAll'
  },


  //____________________________________ LISTE TACHE ******************************************
  '/AfficherListeTachePris': {
    controller: 'DemandeController',
    action: 'AfficherListeTachePris'
  },
  'get /AfficherListeTachePrisTab': {
    controller: 'DemandeController',
    action: 'AfficherListeTachePrisTab'
  },
  
  'get /AfficherListeTachePrisTabProd': {
    controller: 'DemandeController',
    action: 'AfficherListeTachePrisTabProd'
  },
  
    'get /AfficherListeTachePrisTabGlobale': {
    controller: 'DemandeController',
    action: 'AfficherListeTachePrisTabGlobale'
  },
  
  '/ModifierDemandeEnCours': {
    controller: 'DemandeController',
    action: 'ModifierEtatDemandeEncours'
  },

  '/ModifierEtatDemandeStandBy': {
    controller: 'DemandeController',
    action: 'ModifierEtatDemandeStandBy'
  },

  '/AjoutSousTache': {
    controller: 'DemandeController',
    action: 'AjouterSousTache'
  },
  
  '/ModifierSousTache': {
    controller: 'DemandeController',
    action: 'ModifierSousTache_InsertionCR'
  },
  
  '/UpdateSousTache': {
    controller: 'DemandeController',
    action: 'ModifierSousTache'
  },
  
  
  '/AjoutCRTache': {
    controller: 'DemandeController',
    action: 'AjoutCRTache'
  },

  '/supprimerSousTache': {
    controller: 'DemandeController',
    action: 'SupprimerSousTache'
  },

  '/supprimerDemandeSousTacheCR': {
    controller: 'DemandeController',
    action: 'SupprimerDemandeSousTacheCR'
  },

  '/supprimerCR': {
    controller: 'DemandeController',
    action: 'SupprimerCR'
  },

  //EMAIL confirmation DDL et estimation
  '/envoyerMailConfirmationDemande': {
    controller: 'DemandeController',
    action: 'envoyerMailConfirmationDemande'
  },

   '/envoyerMailConfirmationDemandeTermine': {
    controller: 'DemandeController',
    action: 'envoyerMailConfirmationDemandeTermine'
  },


  'get /deleteDemande': {
    controller: 'DemandeController',
    action: 'deleteDemande'
  },
  
  '/Export': {
    controller: 'DemandeController',
    action: 'export'
  },

  '/Reporting': {
    controller: 'DemandeController',
    action: 'reporting'
  },


  '/ExportDossier': {
    controller: 'DemandeController',
    action: 'exportDossier'
  },

  '/AfficherDataExport': {
    controller: 'DemandeController',
    action: 'afficherDataExport'
  },

  '/AfficherDataExportReporting': {
    controller: 'DemandeController',
    action: 'afficherDataExportReporting'
  },

  '/AfficherDataExportDossier': {
    controller: 'DemandeController',
    action: 'afficherDataExportDossier'
  },

  '/CRmois': {
    controller: 'DemandeController',
    action: 'crMois'
  },

  '/ProcessusDev': {
    controller: 'DemandeController',
    action: 'processusDev'
  },

  '/Gantt': {
    controller: 'DemandeController',
    action: 'gantt'
  },

  '/AfficherDataGantt': {
    controller: 'DemandeController',
    action: 'afficherDataGantt'
  },


  '/GanttDossier': {
    controller: 'DemandeController',
    action: 'ganttDossier'
  },

  '/AfficherDataGanttDossier': {
    controller: 'DemandeController',
    action: 'afficherDataGanttDossier'
  },

  '/GanttApplication': {
    controller: 'DemandeController',
    action: 'ganttApplication'
  },

  '/AfficherDataGanttApplication': {
    controller: 'DemandeController',
    action: 'afficherDataGanttApplication'
  },


  '/AfficherDataCRtotal': {
    controller: 'DemandeController',
    action: 'afficherDataCRtotal'
  },

  '/AfficherDataProcessusTotal': {
    controller: 'DemandeController',
    action: 'afficherDataProcessusTotal'
  },

  '/AfficherDataConge': {
    controller: 'DemandeController',
    action: 'getNombreConge'
  },

  
  //
  '/getLsDevPers':'DemandeController.getListeDevPers',
  'get /getLsDemandeurPers':'DemandeController.getListeDemandeurPers',
  '/getLsTypePriorite':'DemandeController.getListeTypePriorite',
  '/getLsTypeDemande':'DemandeController.getListeTypeDemande',
  '/getLsEtatDemande':'DemandeController.getListeEtatDemande',


// gestion competence
'/gestionCompetence':'CompetenceController.index',
'/gestionCompetenceDev':'CompetenceController.indexDev',
'/competenceDev':'CompetenceDevController.index',
'get /updateNbEtoile': {
  controller: 'CompetenceDevController',
  action: 'updateNbEtoile'
},

'get /supprimerCompetenceLibelle': {
  controller: 'CompetenceController',
  action: 'deleteCompetence'
},


'get /supprimerCompetenceLibelleDev': {
  controller: 'CompetenceController',
  action: 'deleteCompetenceDev'
},
'get /supprimerCompetenceLibelleApp': {
  controller: 'CompetenceController',
  action: 'deleteCompetenceApp'
},

'get /modifierCompetenceLibelle': {
  controller: 'CompetenceController',
  action: 'updateCompetence'
},

'get /modifierNbEtoile': {
  controller: 'CompetenceController',
  action: 'updateNbEtoile'
},
'get /modifierNbEtoileApp': {
  controller: 'CompetenceController',
  action: 'updateNbEtoileApp'
},

'get /creerCompetenceLibelle': {
  controller: 'CompetenceController',
  action: 'createCompetence'
},


'/getListeCompetence':'CompetenceController.getListeCompetence',

'/getListeCompetenceApp':'CompetenceController.getListeCompetenceApp',

'get /getListeCompetenceDev': {
  controller: 'CompetenceController',
  action: 'getListeCompetenceDev'
},

'get /getListeCompetenceDevApp': {
  controller: 'CompetenceController',
  action: 'getListeCompetenceDevApp'
},

'get /creerCompetenceDev': {
  controller: 'CompetenceController',
  action: 'createCompetenceDev'
},

'get /creerCompetenceDevApp': {
  controller: 'CompetenceController',
  action: 'createCompetenceDevApp'
},

'post /verifierFiles': {
  controller: 'DemandeController',
  action: 'verifierFiles'
},

'post /uploadFileDemande': {
  controller: 'DemandeController',
  action: 'uploadFileDemande'
},

'get /getListeDemandeur':'DemandeController.getListeDemandeur',

  //____________________________________ ETAT GLOBAL ******************************************
  '/AfficherEtatGlobal': 'DemandeController.AfficherEtatGlobal',
  'get /AfficherListeTachePrisTabGlobaleEtat': 'DemandeController.AfficherListeTachePrisTabGlobaleEtat',
  '/modifierCommentaireDemande': 'DemandeController.ModifierCommentaireDemande',


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
