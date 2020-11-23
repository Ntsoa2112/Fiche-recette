/**
 * TypeTestController
 *
 * @description :: Server-side logic for managing typetests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  findTypeTest: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    TypeTest.query('select * from fr_type_test where suppr = false order by id_type_test asc', function(err, found){
      if (err) return res.send(err);
      var retVal = [];
      retVal['typeTests'] = found.rows;
      res.view( 'test/listeTypeTest', retVal );
    });
  },

  createTypeTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    if(req.method == 'POST' && req.param('nom_type_test',null)) {
      TypeTest.create({nom_type_test:req.param('nom_type_test'),suppr:false}).exec(function(err,model) {
        if (err) return res.send(err);
        res.redirect('listeTypeTest');
      });
    }else{
      var retVal = [];
      res.view( 'test/listeTypeTest');
    }
  },

  findTypeTestById: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id=req.param('id',null); //id application
    var retVal = [];
    TypeTest.findOne(id).exec(function (err, typeTest){
      if (err) return res.send(err);
      if (!id)return res.notFound('Could not find sorry.');

      var listtest;
      var retVal = [];
      retVal['typeTests'] = typeTest;
      res.view( 'test/modifierTypeTest', retVal );
    });
  },

  updateTypeTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();
    var id = params.id_type_test;
    TypeTest.update({id_type_test: id}, params).exec(function (err, model) {
      if (err) return res.send(err);
      return res.redirect('listeTypeTest');
    });
  },

  deleteTypeTest: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var id = req.param('idTypeTest');
    TypeTest.update({id_type_test: id},{suppr:true}).exec(function (err, updated){
      if (err) return res.send(err);
      else return res.redirect('listeTypeTest');
    });
  },
};

