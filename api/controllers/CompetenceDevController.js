/**
 * CompetenceDevController
 *
 * @description :: Server-side logic for managing competencedevs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    index: function(req, res)
    {
      if (!req.session.user) return res.redirect('/login');
      var sql = 'select fr_competence_dev.*, r_personnel.appelation, fr_competence.* '+
      'from fr_competence_dev join r_personnel on fr_competence_dev.id_pers = r_personnel.id_pers '+
      'join fr_competence on fr_competence_dev.id_competence = fr_competence.id_competence where fr_competence.id_type_competence = 1 order by id_pers';

      var sqlApp = 'select fr_competence_dev.*, r_personnel.appelation, fr_competence.* '+
      'from fr_competence_dev join r_personnel on fr_competence_dev.id_pers = r_personnel.id_pers '+
      'join fr_competence on fr_competence_dev.id_competence = fr_competence.id_competence where fr_competence.id_type_competence = 2 order by id_pers';

      /*var sqlApp = 'select fr_competence_app.*, r_personnel.appelation, fr_application.* '+
      'from fr_competence_app join r_personnel on fr_competence_app.id_pers = r_personnel.id_pers '+
      'join fr_application on fr_competence_app.id_app = fr_application.id_application order by id_pers' ;*/

      CompetenceDev.query(sql, function(err, found){
        if (err) return res.send(err);
        CompetenceDev.query(sqlApp, function(err, found2){
            if (err) return res.send(err);
            var retVal = [];
            retVal['competences'] = found.rows;
            retVal['competencesApp'] = found2.rows;
            console.log(found.rows);
            res.view( 'user/CompetenceDev', retVal );  //redirection vers accueil avec la liste des applications
        });
      });
    },


    updateNbEtoile: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var nbEtoile = req.params("nbEtoile");
        var idCompetence = req.params("idCompetence");
        CompetenceDev.update({id_competence_dev: idCompetence}, {nb_etoile : nbEtoile}).exec(function (err, model) {
            if (err) return res.send(err);
            return res.redirect('competenceDev');
            //return callback(null, res.rows);
        });
    },

	findAllCompetenceDev: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        CompetenceDev.query('select * from fr_competence_dev', function(err, found){
            if (err) return res.send(err);
            var retVal = [];
            retVal['typeTests'] = found.rows;
            //res.view( 'test/listeTypeTest', retVal );
        });
    },

    createCompetenceDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        if(req.method == 'POST' && req.param('libelle',null)) {
            CompetenceDev.create({libelle:req.param('libelle')}).exec(function(err,model) {
                if (err) return res.send(err);
                //res.redirect('listeTypeTest');
            });
        }
        else{
            var retVal = [];
            //res.view( 'test/listeTypeTest');
        }
    },

    findCompetenceByIdDev: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var id=req.param('id',null); //id application
        var retVal = [];
        CompetenceDev.findOne(id).exec(function (err, typeTest){
            if (err) return res.send(err);
            if (!id)return res.notFound('Could not find sorry.');

            var listtest;
            var retVal = [];
            retVal['typeTests'] = typeTest;
            //res.view( 'test/modifierTypeTest', retVal );
        });
    },

    updateCompetenceDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var params = req.params.all();
        var id = params.id_type_test;
        CompetenceDev.update({id_type_test: id}, params).exec(function (err, model) {
            if (err) return res.send(err);
            //return res.redirect('listeTypeTest');
        });
    },

    deleteCompetenceDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var id = req.param('idTypeTest');
        /*CompetenceDev.update({id_type_test: id},{suppr:true}).exec(function (err, updated){
            if (err) return res.send(err);
            else return res.redirect('listeTypeTest');
        });*/
    },
};

