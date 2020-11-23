/**
 * CompetenceController
 *
 * @description :: Server-side logic for managing competences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    index: function(req, res)
    {
      if (!req.session.user) return res.redirect('/login');
      Competence.query('select * from fr_competence where id_type_competence = 1 order by id_competence', function(err, found){
        if (err) return res.send(err);
        var retVal = [];
        retVal['competences'] = found.rows;
        console.log(found.rows);
        res.view( 'user/GestionCompetence', retVal );  //redirection vers accueil avec la liste des applications
      });
    },

    indexDev: function(req, res)
    {
      if (!req.session.user) return res.redirect('/login');
      Competence.query('select * from fr_competence where id_type_competence = 2 order by id_competence', function(err, found){
        if (err) return res.send(err);
        var retVal = [];
        retVal['competences'] = found.rows;
        console.log(found.rows);
        res.view( 'user/GestionCompetenceTechDev', retVal );  //redirection vers accueil avec la liste des applications
      });
    },

    getListeCompetence: function(req, res)
    {
        var option = [];
        option.type = req.param('type',null);
        async.series([
        function (callback) {
            Competence.getListeCompetence(option,callback);
        }
        ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));
        })
    },

    getListeCompetenceApp: function(req, res)
    {
        async.series([
        function (callback) {
            Competence.getListeCompetenceApp(null,callback);
        }
        ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));
        })
    },

    getListeCompetenceDev: function(req, res)
    {
        var option = [];
        option.idDev = req.param('idDev',null);
        option.type = req.param('type',null);
        async.series([
        function (callback) {
            Competence.getListeCompetenceDev(option,callback);
        }
        ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));
        })
    },

    getListeCompetenceDevApp: function(req, res)
    {
        var option = [];
        option.idDev = req.param('idDev',null);

        async.series([
        function (callback) {
            Competence.getListeCompetenceDevApp(option,callback);
        }
        ],function (err,result) {
        if (err) return res.send("Erreur de requete");
        return res.ok(JSON.stringify(result[0]));
        })
    },

    findAllCompetence: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        Competence.query('select * from fr_competence', function(err, found){
            if (err) return res.send(err);
            var retVal = [];
            retVal['typeTests'] = found.rows;
            //res.view( 'test/listeTypeTest', retVal );
        });
    },

    createCompetence: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        Competence.create({libelle:req.param('libelle'), id_type_competence : req.param('type')}).exec(function(err,model) {
            if (err) return res.send(err);
            if(req.param('type') == 1){
                return res.redirect('gestionCompetence');
            }
            else{
                return res.redirect('gestionCompetenceDev');
            }
        });
    },

    createCompetenceDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        CompetenceDev.create({id_pers:req.param('idDev'), id_competence : req.param('idComp'), nb_etoile : req.param('nbEtoile') }).exec(function(err,model) {
            if (err) return res.send(err);
            return res.redirect('competenceDev');
        });
    },

    createCompetenceDevApp: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        CompetenceApp.create({id_pers:req.param('idDev'), id_app : req.param('idComp'), nb_etoile : req.param('nbEtoile') }).exec(function(err,model) {
            if (err) return res.send(err);
            return res.redirect('competenceDev');
        });
    },

    findCompetenceById: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var id=req.param('id',null); //id application
        var retVal = [];
        Competence.findOne(id).exec(function (err, typeTest){
            if (err) return res.send(err);
            if (!id)return res.notFound('Could not find sorry.');

            var listtest;
            var retVal = [];
            retVal['typeTests'] = typeTest;
            //res.view( 'test/modifierTypeTest', retVal );
        });
    },

    updateCompetence: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var libelle = req.param('libelle');
        var sqlUpdateComp = "update fr_competence set libelle = '"+libelle+"' where id_competence = "+idCompetence;
        Competence.query(sqlUpdateComp, function(err, found){
            if (err) return res.send(err);
            if(req.param('type') == 1){
                return res.redirect('gestionCompetence');
            }
            else{
                return res.redirect('gestionCompetenceDev');
            }
        });
    },


    deleteCompetence: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var sqlSuprComp = "delete from fr_competence where id_competence = "+idCompetence;
        var sqlSuprCompDev = "delete from fr_competence_dev where id_competence = "+idCompetence;

        Competence.query(sqlSuprComp, function(err, found){
            if (err) return res.send(err);
            Competence.query(sqlSuprCompDev, function(err, found){
                if (err) return res.send(err);
                if(req.param('type') == 1){
                    return res.redirect('gestionCompetence');
                }
                else{
                    return res.redirect('gestionCompetenceDev');
                }
            });
        });
    },

    deleteCompetenceTechDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var sqlSuprComp = "delete from fr_competence_tech where id_competence_tech = "+idCompetence;
        var sqlSuprCompDev = "delete from fr_competence_dev where id_competence = "+idCompetence;

        Competence.query(sqlSuprComp, function(err, found){
            if (err) return res.send(err);
            Competence.query(sqlSuprCompDev, function(err, found){
                if (err) return res.send(err);
                else return res.redirect('gestionCompetence');
            });
        });
    },

    updateNbEtoile: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var nbEtoile = req.param('nbEtoile');
        var sqlUpdateComp = "update fr_competence_dev set nb_etoile = '"+nbEtoile+"' where id_competence_dev = "+idCompetence;
        Competence.query(sqlUpdateComp, function(err, found){
            if (err) return res.send(err);
            else return res.redirect('competenceDev');
        });
    },

    updateNbEtoileApp: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var nbEtoile = req.param('nbEtoile');
        var sqlUpdateComp = "update fr_competence_app set nb_etoile = '"+nbEtoile+"' where id_competence_dossier = "+idCompetence;
        Competence.query(sqlUpdateComp, function(err, found){
            if (err) return res.send(err);
            else return res.redirect('competenceDev');
        });
    },

    deleteCompetenceDev: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var sqlSuprCompDev = "delete from fr_competence_dev where id_competence_dev = "+idCompetence;

        Competence.query(sqlSuprCompDev, function(err, found){
            if (err) return res.send(err);
            else return res.redirect('competenceDev');
        });
    },

    deleteCompetenceApp: function (req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        var idCompetence = req.param('idCompetence');
        var sqlSuprCompDev = "delete from fr_competence_app where id_competence_dossier = "+idCompetence;

        Competence.query(sqlSuprCompDev, function(err, found){
            if (err) return res.send(err);
            else return res.redirect('competenceDev');
        });
    },
};

