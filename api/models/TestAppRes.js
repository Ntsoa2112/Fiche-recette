module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_assoc_tst_ap_res', // nom du table qui est associé avec le modele Resultat
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_assoc: { //id assocciation
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_assoc'
    },

    id_test_application: { //id test application
      type: 'integer',
      columnName:'id_test_application'
    },

    id_resultat: { //id resultat
      type: 'integer',
      columnName:'id_resultat'
    }

    
  }
};