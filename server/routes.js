'use strict';

var config = require('./config');
var hogan = require('hogan.js');
var fs = require('fs');



// var ip = require('./helpers').serverIP;

module.exports = function(app) {


  // User route
  app.use('/api/user', require('./api/user'));

  // Wishlist route
  app.use('/api/wishlist', require('./api/wishlist'));

  // Upload route
  app.use('/api/upload', require('./api/upload'));

  //Auth route
  app.use('/api/auth', require('./api/auth'));


  //Get info about app
  app.use('/api/info', function(req, res, next) {
    res.send({
      name:     config.appName,
      version:  config.version,
      ws:       config.ws
    });
  });

  //404 route
  app.use('/api', function(req, res, next) {
    res.status(404).send('404 - Sorry cant find that!');
  });

  //Redirect requests to undefined routepaths to index
  app.route('/*')
    .get(function(req, res, next) {

      //defaults
      var params          = {};
      params.title        = 'Wishero';
      params.description  = 'Makes your wishes come true.';
      params.url          = req.url;
      params.socialUrl    = params.url;

      //render gatekeeper (redirect) page
      var template          = fs.readFileSync(__dirname + '/templates/gatekeeper.hjs','utf-8');
      var compliedTemplate  = hogan.compile(template);

      var urlRoute = req.url.split('/');

      function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }


      if(urlRoute[1] === 'wishlist'){
        var username = capitalizeFirstLetter(urlRoute[2]);



        params.title = username + '\'s Wishlist @Wishero.co';

        params.socialUrl = '/' + urlRoute[2];
        params.description = 'Check out my wishes at Wishero.co. Create and share your wishlist too.';
      }

      res.send(compliedTemplate.render(params));
    });

    // serve public
    //app.use(express.static(app.get('appPath')));


  };
