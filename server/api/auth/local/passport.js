'use strict';

var User          = require('../../user/user.model');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment        = require('moment');
var helper        = require('../../../helpers');



module.exports = function() {

  passport.use(new LocalStrategy(
    function(username, password, done) {

      var query = {};
      var type;

      if (helper.isEmail(username)) {
        type = 'email';
        query = {email: username };
        findUser();
      } else {
        type = 'username';
        query = {username: username};
        findUser();
      }

      function findUser(){
        User.findOne(query,function (err, user) {
          if (err) return done(err);

          if (!user) {
            return done(null, false, { message: 'User does not exist.' });
          }

          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect ' + type + ' or password.' });
          }

          user.lastLogin = moment();


          user.save(function(err, user){
            return done(null, user);
          });


        });
      }
    }
  ));


};
