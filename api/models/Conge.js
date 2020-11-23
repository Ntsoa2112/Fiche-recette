/**
 * Conge.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'EasyGpaoConnexion', // connexion à la base, nom du base:"EasyGpaoConnexion"
    tableName: 'r_conge', // nom du table qui est associé avec le modele Dossier
    autoCreatedAt: false,
    autoUpdatedAt: false,
  
    //attributs
    attributes: {
      id_pers: { 
        type: 'integer',
        columnName:'id_pers'
      },
  
      date_debut: { //id personnel
        type: 'string',
        columnName:'date_debut'
      },
  
      date_fin: { //id personnel
        type: 'string',
        columnName:'date_fin'
      },
    },


    getNombreConge: function(option, callback) {
      
        var sql_debut_fin = "";
        
        console.log("===========> OPTION APP ==================== "+option.optionDebut + "-------" + option.optionFin);
    
        //sql debut fin
        if(option.optionDebut != "" && option.optionDebut != null && option.optionFin == ""){WScript
          sql_debut_fin = " AND to_date(date_debut,'DD/MM/YYYY') = to_date('" + option.optionDebut + "','DD/MM/YYYY')  ";
          //sql_debut_fin = " AND date_fin = '" + option.optionDebut + "'  ";
        }
        if(option.optionFin != "" && option.optionFin != null  && option.optionDebut == ""){
          sql_debut_fin = " AND to_date(date_fin,'DD/MM/YYYY') = to_date('" + option.optionFin + "','DD/MM/YYYY')  ";
          //sql_debut_fin = " AND date_debut = '" + option.optionFin + "' ";
        }
        if(option.optionDebut != "" && option.optionFin != ""){
          sql_debut_fin = " AND to_date(date_fin,'DD/MM/YYYY') between to_date('" + option.optionDebut + "','DD/MM/YYYY') and to_date('" + option.optionFin + "','DD/MM/YYYY') AND to_date(date_debut,'DD/MM/YYYY') between to_date('" + option.optionDebut + "','DD/MM/YYYY') and to_date('" + option.optionFin + "','DD/MM/YYYY') ";
          //sql_debut_fin = " AND date_fin between '" + option.optionDebut + "' and '" + option.optionFin + "' AND date_debut between '" + option.optionDebut + "' and '" + option.optionFin + "' ";
        }
    
        sqlFiltre = sql_debut_fin;
        var requete = "";
        if(sqlFiltre != "" ){
    
          requete = " SELECT SUM(conge_pris) from r_conge where id_pers = "+option.idPers+" "+ sqlFiltre;
    
        }else{
    
          requete = " SELECT SUM(conge_pris) from r_conge where id_pers = "+option.idPers;
    
        }
        console.log("Requete GET Nombre congé=======>"+requete);
        console.log("fin requete application encours ++++++++");
        Conge.query(requete, function(err,res){
          if(err) return callback(err);
          return callback(null, res.rows);
        });
      }
  };
  
  