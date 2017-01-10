'use strict';

var User          = require('../user/user.model');
var getFriends     = require('../user/common').getFriends;
var Wishlist      = require('./wishlist.model');
var helper        = require('../../helpers');
var moment        = require('moment');
var sendEmail     = require('../../emails');
var _             = require('lodash');
var ws            = require('../../websockets');
var scrape        = require('./scrapeimage');

// userId: { type: String, required: true },
// name: String,
// public: Boolean,
// items: []

exports.getImages = function(req, res, next) {

  scrape.get(req.body.url, function(err, data){
    if(err) return next(err);
    res.send(data);
  });

};


exports.getWishlists = function(req, res, next) {

  Wishlist.find({userId: req.user._id}, function(err, wishlist){
    if (err) return next(err);
    req.user.password = undefined;
    getFriends(req.user, function(err, friends){
      if(err) return next(err);

      req.user.friends = friends;
      res.send({wishlist: wishlist, user: req.user});

    });

  });

};

exports.getWishlist = function(req, res, next) {

  Wishlist.findOne({_id: req.params.wishlistId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.status(404).send();
    res.send(wishlist);
  });

};

exports.createWishlist = function(req, res, next) {

  req.body.userId  = req.user._id;
  var wishlist = new Wishlist(req.body);

  wishlist.save(function(err){
    if (err) return next(err);
    ws.broadcast('createWishlist', wishlist);
    res.status(201).send(wishlist);
  });


};

exports.updateWishlist = function(req, res, next) {

  // userId: { type: Schema.Types.ObjectId, required: true },
  // name: String,
  // public: {type: Boolean, default: true},
  // items: []


  Wishlist.findOne({_id: req.params.wishlistId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.sendStatus(404);

    var _userId     = String(wishlist.userId);
    var _reqUserId  = String(req.user._id);

    if(_userId != _reqUserId) return res.sendStatus(401);

    wishlist.name   = req.body.name   || wishlist.name;
    wishlist.public = req.body.public || wishlist.public;

    wishlist.save(function(err){
      if (err) return next(err);
      ws.broadcast('updateWishlist', wishlist);
      res.send(wishlist);
    });

  });

};

exports.deleteWishlist = function(req, res, next) {

  Wishlist.findById(req.params.wishlistId, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.sendStatus(404);
    var _userId     = String(wishlist.userId);
    var _reqUserId  = String(req.user._id);

    if(_userId != _reqUserId) return res.sendStatus(401);

    wishlist.remove(function(err){
      ws.broadcast('deleteWishlist', wishlist);
      res.sendStatus(204);
    });

  });

};

exports.getWishlistItem = function(req, res, next) {

  Wishlist.findOne({'items.id': req.params.wishlistItemId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.sendStatus(404);

    for (var i = 0; i < wishlist.items.length; i++) {
      if(wishlist.items[i].id == req.params.wishlistItemId) return res.send(wishlist.items[i]);
    }
  });

};

exports.createWishlistItem = function(req, res, next) {

  //id
  //name
  //url
  //desc
  //priority

  Wishlist.findOne({_id: req.params.wishlistId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.status(404).send();
    var _userId     = String(wishlist.userId);
    var _reqUserId  = String(req.user._id);

    if(_userId != _reqUserId) return res.sendStatus(401);
    //if(!req.body.name) return next('missing name');

    var wishlistItem = {};

    wishlistItem.id       =   req.body.id || helper.makeId(5);
    wishlistItem.name     =   req.body.name;
    wishlistItem.url      =   req.body.url;
    wishlistItem.desc     =   req.body.desc;
    wishlistItem.priority =   0;

    wishlist.items.push(wishlistItem);
    wishlist.markModified("items");

    wishlist.save(function(err){
      if (err) return next(err);
      wishlistItem.wishlistId = req.params.wishlistId;
      wishlistItem.userId = req.user._id;
      ws.broadcast('newWishlistItem', wishlistItem);
      res.status(201).send(wishlistItem);
    });

  });


};

exports.updateWishlistItem = function(req, res, next) {

  Wishlist.findOne({'items.id': req.params.wishlistItemId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.sendStatus(404);

    var _userId     = String(wishlist.userId);
    var _reqUserId  = String(req.user._id);

    if(_userId != _reqUserId) return res.sendStatus(401);
    var updatedWishlistItem;

    if (req.body && req.body.priority >= 100) req.body.priority = 100;
    if (req.body && req.body.priority <= 0) req.body.priority = 0;

    for (var i = 0; i < wishlist.items.length; i++) {
      if(wishlist.items[i].id == req.params.wishlistItemId){
        wishlist.items[i].name          =   req.body.name       || wishlist.items[i].name;
        wishlist.items[i].url           =   req.body.url        || wishlist.items[i].url;
        wishlist.items[i].desc          =   req.body.desc;
        wishlist.items[i].priority      =   req.body.priority   || wishlist.items[i].priority;
        wishlist.items[i].img           =   req.body.img        || wishlist.items[i].img;
        updatedWishlistItem             =   wishlist.items[i];
      }
    }
    wishlist.markModified("items");

    wishlist.save(function(err){
      if (err) return next(err);
      updatedWishlistItem.wishlistId = wishlist._id;
      updatedWishlistItem.userId = req.user._id;
      ws.broadcast('updateWishlistItem', updatedWishlistItem);
      res.status(200).send(updatedWishlistItem);
    });

  });

};

exports.deleteWishlistItem = function(req, res, next) {

  Wishlist.findOne({'items.id': req.params.wishlistItemId}, function(err, wishlist){
    if (err) return next(err);
    if(!wishlist) return res.sendStatus(404);
    var _userId     = String(wishlist.userId);
    var _reqUserId  = String(req.user._id);

    if(_userId != _reqUserId) return res.sendStatus(401);
    for (var i = 0; i < wishlist.items.length; i++) {
      if(wishlist.items[i].id == req.params.wishlistItemId) wishlist.items.splice( i, 1 );
    }

    wishlist.markModified("items");

    wishlist.save(function(err){
      if (err) return next(err);

      ws.broadcast('deleteWishlistItem', {wishlistId: wishlist._id, id: req.params.wishlistItemId, userId: req.user._id});
      res.sendStatus(204);
    });

  });

};
