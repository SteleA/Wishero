'use strict';

var express       = require('express');
var router        = express.Router();
var controller    = require('./user.controller');
var auth          = require('../auth/auth.service');


// define the home page route
router.get('/', auth.hasRole('admin'), controller.findAll);
router.get('/:id', auth.isAuthenticated(), controller.findOne);
router.delete('/:id', auth.hasRole('admin'), controller.deleteUser);
router.post('/', controller.createUser);
router.put('/', auth.isAuthenticated(), controller.updateUserSettings);
router.get('/profile/me', auth.isAuthenticated(), controller.me);

// confirm user
router.get('/confirm/send', auth.isAuthenticated(), controller.confirmEmail);
router.get('/confirm/:token', controller.confirm);

//forgot password
router.get('/forgotpassword/:usernameOrEmail', controller.forgotPassword);
router.post('/resetpassword', controller.resetPassword);

router.get('/friend/getFriends', auth.isAuthenticated(), controller.getFriends);
router.get('/friend/:usernameOrEmail', auth.isAuthenticated(), controller.findFriend);
router.post('/friend', auth.isAuthenticated(), controller.addFriend);
router.delete('/friend/:id', auth.isAuthenticated(), controller.deleteFriend);
router.post('/invite', auth.isAuthenticated(), controller.invite);

router.get('/public/:username', controller.public);

router.post('/feedback', auth.isAuthenticated(), controller.feedback);




module.exports = router;
