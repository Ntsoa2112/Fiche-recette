/**
 * Created by 8032 on 25/07/2016.
 */

module.exports = {
  setNotificationAppliValide: function(req, res) {
    var id_personne = req.session.user;
    sails.sockets.blast("notif", "test notification :p :p :p");
  },
}
