/**
 * RecetteController
 *
 * @description :: Server-side logic for managing recettes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllersfg
 */

module.exports = {
  //_________________________________________________debut FIND RECETTE
  //fonction qui retourne la liste de touS les recettes
  findRecette: function(req, res)
  {
    if (!req.session.user) return res.redirect('/login');
      Recette.find({}, function(err, found){
        if (err) return res.send(err);
        var retVal = [];
        retVal['recettes'] = found;
        console.log(found);
        res.view( 'recette/listeRecette', retVal );
      });
  },

  //____________________________________________debut fonctionn CREATE
  //fonction pour creer un recette
  createRecette: function (req, res)
  {
    var titre = req.param('titre_recette',null);
    var etape = req.param('etape_recette',null);
    var resultatAttendu = req.param('resultat_attendu',null);
    var resultatObtenu = req.param('resultat_obtenu',null);
    var status = req.param('status_recette',null);

    var stat = true;
    if(status = 2)stat = false;

    if(req.method == 'POST' &&  titre != null && etape!= null && resultatAttendu != null && resultatObtenu != null && status != null) {
      Recette.create({titre_recette:titre,etape_recette:etape,resultat_attendu:resultatAttendu,resultat_obtenu:resultatObtenu,status_recette:stat}).exec(function(err,model) {
        if (err) return res.send(err);
        res.redirect('accueil');
      });
    }else{
        res.view( 'recette/ajoutRecette');
    }
  },

  //____________________________________________debut fonctionn FIND BY ID
  //fonction qui recherche une recette  par son id et qui retourne une recette
  findRecetteById: function(req, res)
  {
    var id=req.param('id',null); //id application
    Recette.findOne(id).exec(function (err, finn){
      if (err)return res.negotiate(err);
      if (!id)return res.notFound('Could not find sorry.');
      var retVal = [];
      retVal['recettes'] = finn;
      res.view( 'recette/detailRecette', retVal );
    });
  },
};

