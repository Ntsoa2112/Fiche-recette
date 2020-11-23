/**
 * TypeDemandeController
 *
 * @description :: Server-side logic for managing Typedemandes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findTypeDemande: function(req, res)
    {
        if (!req.session.user) return res.redirect('/login');
        TypeDemande.findTypeDemande(function(err, typeDemande){
        if (err) return res.send(err);
        var retVal = [];
        retVal['typeDemandes'] = typeDemande.rows;
        res.view( 'application/accueil', retVal );
        });
    },
};

