'use strict';

var User        = require('./user.model');
var Wishlist    = require('../wishlist/wishlist.model');


exports.getFriends = function(user, cb) {

  if(!user) return cb('user param missing');

    var friends = user.friends || [];

    User.find({_id: {$in:friends}},{username:1, picture:1, firstName:1, lastName:1}, function(err, friends){
      if (err) return cb(err);
      cb(null, friends);
    });

};

exports.getWishlists = function(user, cb) {

  Wishlist.find({userId: user._id}, function(err, wishlists){
    if (err) return cb(err);
    return cb(null, wishlists);
  });

};
