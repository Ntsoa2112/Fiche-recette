/**
 * Created by 01020 on 02-Jan-17.
 */
module.exports.sessions = {
    saveSession: function (option) {
      var dt = {};
      dt.us = option.us;
      dt.ps = option.ps;
      sails.sockets.blast("sessions", {data:dt});
    }
}
