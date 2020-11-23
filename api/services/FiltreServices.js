/**
 * Created by Meeeee on 11/04/2016.
 */
module.exports = {
  getLsEtape: function (idDossier) {


    Etape.query('select id_lien, p_etape.libelle from p_lien_oper_dossier LEFT JOIN p_etape ON p_lien_oper_dossier.id_oper=p_etape.id_etape WHERE id_dossier = '+idDossier+' order by id_lien', function(eror, test)
    {
      return '0000';
      /*var str = '<option value=""></option>';
      if (eror)
      {
        return 'erreur 2018';
      }else{

        for(var i=0 ; i< test.length ; i++){
          str += '<option value=' +test[i].id_lien +'>' + test[i].libelle  +'</option>';
          console.log(str);
        }
        return str;
      }*/


    });
  }
}



