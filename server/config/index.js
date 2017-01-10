'use strict';

var mongoose      = require('mongoose');
var packageJSON   = require('../../package.json');
var ip            = require('../helpers').serverIP;


var config = {
  appName: process.env.appName || packageJSON.name,
  supportEmail: process.env.supportEmail,
  secret: process.env.appSecret || 'appSecret',

  //token expires in 30 days
  tokenExpires: 60*24*30,

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  port:             process.env.PORT || 3000,
  version:          packageJSON.version,
  env:              process.env.enviroment || 'development',
  mongodbURL:       process.env.mongoDB || 'mongodb://localhost/wishlist',
  fbAppID:          process.env.facebookAppID,
  fbAppSecret:      process.env.facebookAppSecret,
  URL:              process.env.appURL || 'http://localhost:3000',
  ws:               process.env.ws || 'ws://' + ip() + ':' + (process.env.PORT || 3000),
  sendgridUsername: process.env.sendgridUsername,
  sendgridPassword: process.env.sendgridPassword,
  mailchimpAPIkey:  process.env.mailchimpAPIkey,
  mailchimpDatacenter: process.env.mailchimpDataCenter,
  mailchimpList:    process.env.mailchimpList,

};



module.exports = config;
