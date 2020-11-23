/**
 * ImageServiceController
 *
 * @description :: Server-side logic for managing Imageservices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');

var pdf = require('html-pdf');
var html = fs.readFileSync('./views/application/pdfTest.ejs', 'utf8');
var options = { format: 'Letter', border: 'top:2in,right:2in,bottom:2in,left:2in' };

module.exports = {
  // function to encode file data to base64 encoded string
  base64_encode : function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  },

  // function to create file from base64 encoded string
  base64_decode : function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
  },

  //pour avoir le format d'image a afficher dans <img src
  toBase64String : function (byte){
    return new Buffer(byte, 'base64').toString('base64');
  },

  getImage : function(callback){
    Photo.query("select photo from r_photo where id_pers = 551", function(err, res){
      if(err) return err;

      ImageService.base64_decode(res.rows[0].photo, 'E:\TEST_IMAGE\test.jpg');

      callback();
    });
  },
};

