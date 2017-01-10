'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

  exports.isEmail = function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

  exports.makeId = function (length){
      var lengthOfId = 30;
      if (length) lengthOfId=length;


      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < lengthOfId; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  };

  exports.serverIP = function(){

    var ip;

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          ip = iface.address;

        } else {
          // this interface has only one ipv4 adress
          ip = iface.address;

        }
        ++alias;
      });


    });

    return ip;

  };
