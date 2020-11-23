/**
 * Created by 01019 on 18/10/2016.
 */
module.exports = {
  //fonction modifier statut notification
  setNotificationView : function (req, res)
  {
    var id_notification = req.param('id_notification');
    var requeteUpdate = "update fr_notification set statut = 1  where id_notification = "+id_notification+" and id_personnel = "+req.session.user;
    Resultat.query(requeteUpdate, function (errr, resultat) {
      if(errr) return next(errr);

      //update liste Notif et nb notif
      Notification.query('select * from fr_notification where statut = 0 and id_personnel ='+req.session.user ,function (errr, liste) {
        if(errr) console.log("errr:"+errr);

        Notification.count({statut:'0', id_personnel:req.session.user}).exec(function countCB(err, nb_notif) {
          if (err) return res.send(err);

          console.log("================================  Notif 1"+ liste.rows );
          req.session.listNotification = liste.rows;
          req.session.nbNotification = nb_notif;
          console.log("================================  Nombre notification ===> "+ nb_notif);
          console.log("================================ Notif 2 "+req.session.listNotification);
          res.redirect('back');
        });
      });
    });
  }
}
