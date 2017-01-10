'use strict';

var beagle        = require('beagle');
var size          = require('request-image-size');
var _             = require('lodash');

exports.get = function(url, cb) {

  var img             = [];
  var checkedImg      = [];
  var requestToBeMade;
  var requestMade     = 0;
  var item            = {};

  if(url && url.substring(0,4) != 'http' ) {
    url = 'http://' + url;
  }

  beagle.scrape(url, function(err, bone){
    if(err) return cb(err);
    if(!bone.images) return cb(null);

    bone.body = null;
    item.name = bone.title;
    item.desc = bone.preview;

    bone.images = _.uniq(bone.images);

    for (var i = 0; i < bone.images.length; i++) {
      var fileType = bone.images[i].substring((bone.images[i].length-3), bone.images[i].length);
      var allowedFiletypes = ['jpg', 'png'];
      if( allowedFiletypes.indexOf(fileType) != -1 && !bone.images[i].match(/sprite/) ) {
        img.push(bone.images[i]);
      }
    }
    requestToBeMade = img.length;

    img.forEach(getSizeOfCollectedImages);

  });

  function getSizeOfCollectedImages(url){

    size(url, function(err, dimensions, length) {
      if(err) return cb(err);

      if(dimensions.height > 100 && dimensions.width > 100) {
        checkedImg.push(url);
      }

      requestMade++;

      if(requestMade === requestToBeMade) {
        item.img = checkedImg;
        return cb(null, item);
      }

    });



  }

};
