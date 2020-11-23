/**
 * Created by 01019 on 11/10/2016.
 */
module.exports = {
  //Fonction pour changer LE FORMAT d'un timestamp
  changeFormatTimestamp: function(date) {
    var month = new Array();
    month[0] = "Janvier";
    month[1] = "Février";
    month[2] = "Mars";
    month[3] = "Avril";
    month[4] = "Mai";
    month[5] = "Juin";
    month[6] = "Juillet";
    month[7] = "Aout";
    month[8] = "Septembre";
    month[9] = "Octobre";
    month[10] = "Novembre";
    month[11] = "Décembre";

    var dateParse = new Date(Number(Date.parse(date)));
    var monthParse = month[dateParse.getMonth()];
    var newDate = dateParse.getDate()+" "+monthParse+" "+dateParse.getFullYear()+" - "+dateParse.getHours()+":"+dateParse.getMinutes()+":"+dateParse.getSeconds();
    return newDate;
  }
};
