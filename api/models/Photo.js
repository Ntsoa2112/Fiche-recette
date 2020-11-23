/**
 * Photo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'EasyGpaoConnexion',
  tableName: 'r_photo',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  attributes: {
    id : {
      type : 'integer',
      unique: true,
      primaryKey: true,
      columnName : 'id'
    },

    id_pers :{
      type : 'integer',
      columnName : 'id_pers'
    },

    photo : {
      type : 'binary',
      columnName : 'photo'
    },

    iscurrent : {
      type : 'boolean',
      columnName : 'iscurrent'
    }
  }
};

