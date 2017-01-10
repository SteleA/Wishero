'use strict';

var express       = require('express');
var app           = express();
var compress      = require('compression');
if(!process.env.enviroment) require('dotenv').load();
var expressConfig = require('./config/express');
var mongoDBConfig = require('./config/database');
var routes        = require('./routes');
var serverConfig  = require('./config/server');
var errorHandling = require('./error');
var tasks         = require('./tasks')();


app.use(compress());
expressConfig(app);
mongoDBConfig();
routes(app);
serverConfig(app);
errorHandling(app);


module.exports = app;
