'use strict';

var express       = require('express');
var router        = express.Router();
var controller    = require('../user/user.controller');
var wishlistCtrl  = require('./wishlist.controller');
var auth          = require('../auth/auth.service');


//Get images
router.post('/getImages',auth.isAuthenticated(), wishlistCtrl.getImages);


//Get wishlists
router.get('/', auth.isAuthenticated(), wishlistCtrl.getWishlists);
//Get a wishlist
router.get('/:wishlistId', auth.isAuthenticated(), wishlistCtrl.getWishlist);
//Create a wishlist
router.post('/', auth.isAuthenticated(), wishlistCtrl.createWishlist);
//Update a wishlist
router.put('/:wishlistId', auth.isAuthenticated(), wishlistCtrl.updateWishlist);
//Delete a wishlist
router.delete('/:wishlistId', auth.isAuthenticated(), wishlistCtrl.deleteWishlist);




//Get wishlist item
router.get('/item/:wishlistItemId', auth.isAuthenticated(), wishlistCtrl.getWishlistItem);
//Create wishlist item
router.post('/:wishlistId', auth.isAuthenticated(), wishlistCtrl.createWishlistItem);
//Update wishlist item
router.put('/:wishlistId/:wishlistItemId', auth.isAuthenticated(), wishlistCtrl.updateWishlistItem);
//Update wishlist item
router.delete('/:wishlistId/:wishlistItemId', auth.isAuthenticated(), wishlistCtrl.deleteWishlistItem);

module.exports = router;
