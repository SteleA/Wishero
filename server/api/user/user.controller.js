'use strict';

var User        = require('./user.model');
var Wishlist    = require('../wishlist/wishlist.model');
var bcrypt      = require('bcrypt-nodejs');
var auth        = require('../auth/auth.service');
var helper      = require('../../helpers');
var moment      = require('moment');
var sendEmail   = require('../../emails');
var expressJwt  = require('express-jwt');
var config      = require('../../config');
var jwt         = require('jsonwebtoken');
var mailchimp   = require('../../mailchimp');


// list all users
exports.findAll = function(req, res, next) {
  User.find({}, '-password', function(err, user){
    if (err) next(err);
    if (!user) return res.json('No users found');
    res.send( user );
  });
};

// find user by id
exports.findOne = function(req, res, next) {
  User.findById(req.params.id, '-password -email -facebook -comments -forgotPasswordToken -forgotPasswordTokenExpires', function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');
    res.send(user);
  });
};

exports.createUser = function(req, res, next) {
  var newuser      = new User(req.body);
  newuser.username = newuser.username.toLowerCase().replace(/ /g,'');
  newuser.role     = 'user';
  newuser.confirmToken = helper.makeId(10);

  if(newuser.username.length > 10) return next({message: 'Username too long, maximum 10 characters'});
  if(!helper.isEmail(newuser.email)) return next({message: 'Invalid email'});

  newuser.save(function (err) {
    if (err) return res.status(500).send(err);
    res.json({token: auth.signToken(newuser._id, newuser.role), user:newuser});
  });

};

exports.updateUserSettings = function(req, res, next) {

  var newUsername  = req.body.username.toLowerCase() || req.user.username;
  var newEmail     = req.body.email                  || req.user.email;
  var newPassword  = req.body.password               || req.user.password;
  var firstName    = req.body.firstName              || req.user.firstName || '';
  var lastName     = req.body.lastName               || req.user.lastName  || '';
  var birthday     = req.body.birthday               || req.user.birthday  || '';
  var picture      = req.body.picture                || req.user.picture   || '';
  var _id          = req.user._id;

  var oldEmail;

  User.findById(_id , function(err, user){
    if (err) return next(err);
    if (!user) return res.json('No user found');

    if (user.username !== newUsername) {
      user.username = newUsername;
    }

    if (user.email !== newEmail) {
      oldEmail = user.email;
      user.email = newEmail;
      user.confirmed = false;
      user.confirmToken = helper.makeId(10);
    }

    if (user.password !== newPassword) {
      user.password = newPassword;
    }

    if (user.firstName !== firstName) {
      user.firstName = firstName;
    }

    if (user.lastName !== lastName) {
      user.lastName = lastName;
    }

    if (user.birthday !== birthday) {
      user.birthday = birthday;
    }

    if (user.picture !== picture) {
      user.picture = picture;
    }

    user.save(function (err) {
      if (err) return res.status(500).send(err);

      if(oldEmail) {
        mailchimp.deleteMember({
          email:      oldEmail,
          apiKey:     config.mailchimpAPIkey,
          list:       config.mailchimpList,
          dataCenter: config.mailchimpDatacenter
        },
        function(err, mcResponse){
          res.json({message: 'success'});
        });
      }else {
        res.json({message: 'success'});
      }

    });
  });

};

//Delete User
exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.sendStatus(204);
  });
};



//Get user info
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-password -comments -forgotPasswordToken -forgotPasswordTokenExpires', function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};


// Forgot password
exports.forgotPassword = function(req, res, next) {

  var obj = {};

  if (helper.isEmail(req.params.usernameOrEmail)) {
    obj = {email: req.params.usernameOrEmail};
    findUser();
  } else {
    obj = {username: req.params.usernameOrEmail};
    findUser();
  }


  function findUser(){
    User.findOne(obj, function(err, user){

      if (err) return next(err);
      if (!user) return res.status(400).json('No user found');

      user.forgotPasswordToken = helper.makeId();
      user.forgotPasswordTokenExpires = moment().add(1, 'h').format();

      //Send out email with token
      user.save(function(err){
        if (err) return next(err);
        sendEmail.forgotPassword(res, user);
      });
    });
  }

};

exports.resetPassword = function(req, res, next) {

  var resetToken = req.body.resetToken;
  var newPassword  = req.body.password || req.user.password;

  User.findOne({forgotPasswordToken: req.body.resetToken}, function(err, user){
    if (err) return next(err);
    if (!user) return res.status(400).json('Invalid reset token');

    if(moment().format() > user.forgotPasswordTokenExpires){
      return res.status(401).send('token expired');
    }

    if (user.password !== newPassword) {
      user.password = newPassword;
    }

    user.forgotPasswordTokenExpires = undefined;
    user.forgotPasswordToken = undefined;

    user.save(function (err) {
      if (err) return res.status(500).send(err);
      res.json({message: 'success'});
    });
  });

};

exports.findFriend = function(req, res, next) {

  var query = {};

  if (helper.isEmail(req.params.usernameOrEmail)) {
    query = {email: {$regex: req.params.usernameOrEmail.toLowerCase()} };
    findUser();
  } else {
    query = {username: {$regex: req.params.usernameOrEmail.toLowerCase()}};
    findUser();
  }


  function findUser(){

    User.find(query, {username: 1, _id: 1, firstName:1, lastName:1, picture:1 }, function(err, users){
      if (err) return next(err);

      res.send(users);

    }).limit(5).sort({username:1});
  }

};

exports.addFriend = function(req, res, next) {

    if(req.user._id == req.body._id) return next("You can't add yourself as a friend");
    if(req.user.friends.indexOf(req.body._id) != -1) return next("Friend is in your friendslist");


    User.update({_id: req.user._id}, {$addToSet: {friends: req.body._id}}, function(err, user){
      if (err) return next(err);
      res.send(user);
    });
};

exports.deleteFriend = function(req, res, next) {
    User.update({_id: req.user._id}, {$pull: {friends: req.params.id}}, function(err, user){
      if (err) return next(err);
      res.send(user);
    });
};

exports.getFriends = function(req, res, next) {

  var friends = req.user.friends || [];


    User.find({_id: {$in:friends}},{username:1, picture:1, firstName:1, lastName:1}, function(err, friends){
      if (err) return next(err);
      res.send(friends);
    });
};


exports.public = function(req, res, next) {

  var userId;

  if(req.headers.authorization){
    var token;


    token = req.headers.authorization.split(' ');
    token = token[token.length-1];

    jwt.verify(token, config.secret, function(err, decoded) {
      if(userId) {
        userId = decoded._id;
      }
    });
  }


  User.findOne({username: req.params.username}, '-password -role -email -facebook -forgotPasswordToken -forgotPasswordTokenExpires', function(err, user){
    if (err) return next(err);
    if (!user) return res.sendStatus(404);

    var isAFriend = false;

    if(user.friends.indexOf(userId) != -1) isAFriend = true;

    Wishlist.find({userId: user._id}, function(err, wishlists){
      if (err) return next(err);

      var publicWishlists = [];

      for (var i = 0; i < wishlists.length; i++) {
        if((wishlists[i].public || isAFriend) && wishlists[i].items.length > 0) {
          publicWishlists.push(wishlists[i]);
        }
      }

      var obj = {
        user: user,
        isFriend: isAFriend,
        wishlists: publicWishlists
      };

      res.send(obj);
    });


  });
};

exports.feedback = function(req, res, next) {

  if(!req.body && !req.body.feedback) return next('missing post body');

  req.user.feedback = req.body.feedback;
  req.user.password = null;

  sendEmail.feedback(req.user, function(err, response){
    res.send(response);
  });

};

exports.invite = function(req, res, next) {

  var obj = {};

  obj.invite    = req.body.email;
  obj.firstName = req.user.firstName;





  sendEmail.invite(obj, function(err, emailRes){
    if(err) return next(err);
    res.sendStatus(200);
  });

};

exports.confirm = function(req, res, next) {

  User.findOne({confirmToken: req.params.token}, function(err, user){
    if (err) return next(err);
    if (!user) return res.redirect('/profile');
    user.confirmed = true;
    user.confirmToken = null;

    user.save(function(err){
      mailchimp.addMember({
        email:      user.email,
        apiKey:     config.mailchimpAPIkey,
        list:       config.mailchimpList,
        dataCenter: config.mailchimpDatacenter
      },
      function(err, mcResponse){
        res.redirect(config.appUrl);
      });

    });
  });

};

exports.confirmEmail = function(req, res, next) {

  if(!req.user.confirmToken) {
    User.findOne({_id: req.user._id}, function(err, user){
      if(err) return next(err);
      user.confirmToken = helper.makeId(10);
      user.save(function(err){
        if(err) return next(err);
        req.user.confirmToken = user.confirmToken;
        send();
      });
    });
  } else {
    send();
  }


  function send(){
    sendEmail.confirm({
      email: req.user.email,
      username: req.user.username,
      confirmToken: req.user.confirmToken
    }, function(err, emailRes){
      if(err) return next(err);
      res.sendStatus(200);
    });
  }

};
