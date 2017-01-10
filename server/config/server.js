'use strict';

var config  = require('./');
var ws      = require('../websockets');

module.exports = function(app) {
  if(process.env.test) config.port = process.env.test;
  var server = app.listen(config.port);
  ws.connect(server);
};
