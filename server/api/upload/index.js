'use strict';

var express       = require('express');
var router        = express.Router();
var controller    = require('./upload.controller');
var auth          = require('../auth/auth.service');



router.get('/', auth.isAuthenticated(), controller.profilePicture);

router.get('/sign_s3', controller.getAwsSignature);





module.exports = router;
