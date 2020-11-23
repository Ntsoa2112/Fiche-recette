/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllerssdf
 */

module.exports = {
  //fonction pour recuperer la liste des utilisateurs
  getUser: function(req, res) {
    User.find({}, function(err, found){
      console.log("______________________________________________USER   "+ found);
      res.view( 'user/listeUser', {users: found} );
    });
  },

  //____________________________________________debut fonctionn UPDATE
  updateUserEmail: function (req, res)
  {
    if (!req.session.user) return res.redirect('/login');
    var params = req.params.all();
    console.log('PARAMS ALL ===> ' + params.email_user);
    var id = req.session.user;
    User.update({id: id}, params).exec(function (err, model) {
      if (err) res.send("Error:".err);
      req.session.emailUser = params.email_user;
      return res.redirect('dashboard');
    });
  },
};

