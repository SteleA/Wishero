'use strict';

var express             = require('express');
var router              = express.Router();
var passport            = require('passport');
var auth                = require('../auth.service');
var localPassportConfig = require('./passport')();
var User                = require('../../user/user.model');
var getUserFriends      = require('../../user/common').getFriends;
var getUserWishlists    = require('../../user/common').getWishlists;

router.post('/', function(req, res, next) {

  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});



    var token = auth.signToken(user._id, user.role);
    user.password = undefined;

    getUserFriends(user, function(err, friends){
      if(err) return next(err);
      user.friends = friends;
      getUserWishlists(user, function(err, wishlists){
        if(err) return next(err);
        res.send({
          token: token,
          user:user,
          wishlists:wishlists
        });
      });



    });


  })(req, res, next);
});

module.exports = router;
