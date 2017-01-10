'use strict';

var _       = require('lodash');
var ws      = require('ws');
var clients = [];

exports.connect = function (server) {
  var wss = new ws.Server({server: server});

  wss.on('connection', function (ws) {

    if(ws.upgradeReq.url) {
      ws.user = ws.upgradeReq.url.substring(7,ws.upgradeReq.url.length);
    }

    clients.push(ws);


    ws.on('message', function (m) {
      //exports.broadcast(m)
    });



    // console.log(clients.length, 'clients connected');
    exports.broadcast('new client joined');

    ws.on('close', function () {
      _.remove(clients, ws);
    });

  });

};

exports.broadcast = function (topic, data) {
  var json = JSON.stringify({topic: topic, data: data});
  clients.forEach(function (client) {
    if(data && data.userId == client.user) client.send(json);
  });
};
