/**
 * Created by 8032 on 09/08/2016.
 */

module.exports = {
  connection: 'ConnexionPostgresql', // connexion à la base, nom du base:"ConnexionPostgresql"
  tableName: 'fr_notification', // nom du table qui est associé avec le modele Dossier
  autoCreatedAt: false,
  autoUpdatedAt: false,

  //attributs
  attributes: {
    id_notification: { //id du notif
      type: 'integer',
      unique: true,
      primaryKey: true,
      columnName:'id_notification'
    },

    date_notification: {
      type: 'timestamp',
      columnName:'date_notification'
    },

    statut: { // 1(lu) ou 0(non lu)
      type: 'integer',
      required: true,
      unique: true,
      columnName:'statut'
    },

    id_personnel: {
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_personnel'
    },

    id_dossier: {
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_dossier'
    },

    id_application: {
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_application'
    },

    id_test: {
      type: 'integer',
      required: true,
      unique: true,
      columnName:'id_test'
    },

    notification: {
      type: 'string',
      required: true,
      unique: true,
      columnName:'notification'
    },
  }


};

