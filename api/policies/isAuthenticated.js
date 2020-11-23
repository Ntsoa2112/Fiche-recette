/**
 * Created by 8032 on 26/02/2016.
 */
module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else{
    return res.redirect('/login');
  }
};
