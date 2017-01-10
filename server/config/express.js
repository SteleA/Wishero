'use strict';

var express       = require('express');
var config        = require('./');
var morgan        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var cors          = require('cors');
var path          = require('path');
var favicon       = require('serve-favicon');

module.exports = function(app) {

  app.set('appPath', path.join(path.normalize(__dirname + '/../..'), 'public'));

  app.use(favicon(app.get('appPath') + '/favicon.png'));

  // allow CORS
  app.use(cors());

  // use morgan to log requests to the console
  app.use(morgan('dev'));

  // read cookies (needed for auth)
  app.use(cookieParser());

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());


  // serve public
  app.use(express.static(app.get('appPath')));

};
