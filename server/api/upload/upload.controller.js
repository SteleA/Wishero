'use strict';

var User        = require('../user/user.model');
var Wishlist    = require('../wishlist/wishlist.model');
var helper      = require('../../helpers');
var moment      = require('moment');
var config      = require('../../config');
var aws         = require('aws-sdk');

var s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'eu-central-1',
  signatureVersion: 'v4'
});

// list all users
exports.getAwsSignature = function(req, res, next) {

  var fileEnding;
  var allowedFiles = ['jpg','jpeg','png','gif'];

  if(req.query && req.query.file_name){
    fileEnding = req.query.file_name.split('.');
    fileEnding = fileEnding[fileEnding.length-1];
    fileEnding = fileEnding.toLowerCase();
  }

  if(allowedFiles.indexOf(fileEnding) == -1) return next('filetype not allowed');

  var fileName = helper.makeId(10) + '.' + fileEnding;

  // aws.config.update();


  var s3_params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3_params, function(err, data){
      if(err) return next(err);

          var return_data = {
              signed_request: data,
              url: 'https://'+process.env.S3_BUCKET+'.s3.amazonaws.com/'+fileName,
              fileName: fileName
          };

          res.send(return_data);

  });

};




// list all users
exports.profilePicture = function(req, res, next) {

  // User.find({}, '-password', function(err, user){
  //   if (err) next(err);
  //   if (!user) return res.json('No users found');
  //   res.send( user );
  // });

};
