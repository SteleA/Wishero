var request = require('request');
var md5     = require('md5');

exports.getMembers = function(options, cb){

  if(!options || typeof options !== 'object'){
    return cb('options object not provided');
  }

  if(!cb || typeof cb !== 'function'){
    return cb('callback not provided');
  }

  if(!options.email) return cb('missing email property');
  if(!options.list) return cb('missing list property');
  if(!options.apiKey) return cb('missing apiKey property');
  if(!options.dataCenter) return cb('missing dataCenter property');

  request.get({
    url: 'https://'+ options.dataCenter +'.api.mailchimp.com/3.0/lists/' + options.list + '/members',
    headers: {'Authorization': 'apikey ' + options.apiKey}
  }, function(err, res, body){
    if(err) return cb(err);

    var response = JSON.parse(body);
    return cb(null, response);
  });

};

exports.getMember = function(options, cb){

  if(!options || typeof options !== 'object'){
    return cb('options object not provided');
  }

  if(!cb || typeof cb !== 'function'){
    return cb('callback not provided');
  }

  if(!options.email) return cb('missing email property');
  if(!options.list) return cb('missing list property');
  if(!options.apiKey) return cb('missing apiKey property');
  if(!options.dataCenter) return cb('missing dataCenter property');

  request.get({
    url: 'https://'+ options.dataCenter +'.api.mailchimp.com/3.0/lists/' + options.list + '/members/' + md5(options.email),
    headers: {'Authorization': 'apikey ' + options.apiKey}
  }, function(err, res, body){
    if(err) return cb(err);

    var response = JSON.parse(body);
    return cb(null, response);
  });

};

exports.addMember = function(options, cb){

  if(!options || typeof options !== 'object'){
    return cb('options object not provided');
  }

  if(!cb || typeof cb !== 'function'){
    return cb('callback not provided');
  }

  if(!options.email) return cb('missing email property');
  if(!options.list) return cb('missing list property');
  if(!options.apiKey) return cb('missing apiKey property');
  if(!options.dataCenter) return cb('missing dataCenter property');

  var body = {
    "status": options.status || "subscribed",
    "email_address": options.email
  };

  request.post({
    url: 'https://'+ options.dataCenter +'.api.mailchimp.com/3.0/lists/' + options.list + '/members',
    body: JSON.stringify(body),
    headers: {'Authorization': 'apikey ' + options.apiKey}
  }, function(err, res, body){
    if(err) return cb(err);

    var response = JSON.parse(body);
    return cb(null, response);
  });

};

exports.updateMember = function(options, cb){

  if(!options || typeof options !== 'object'){
    return cb('options object not provided');
  }

  if(!cb || typeof cb !== 'function'){
    return cb('callback not provided');
  }

  if(!options.email) return cb('missing email property');
  if(!options.list) return cb('missing list property');
  if(!options.apiKey) return cb('missing apiKey property');
  if(!options.dataCenter) return cb('missing dataCenter property');

  var body = {
    "status": options.status || "subscribed",
    "email_address": options.email
  };

  request.put({
    url: 'https://'+ options.dataCenter +'.api.mailchimp.com/3.0/lists/' + options.list + '/members/' + md5(options.email),
    body: JSON.stringify(body),
    headers: {'Authorization': 'apikey ' + options.apiKey}
  }, function(err, res, body){
    if(err) return cb(err);

    var response = JSON.parse(body);
    return cb(null, response);
  });

};

exports.deleteMember = function(options, cb){

  if(!options || typeof options !== 'object'){
    return cb('options object not provided');
  }

  if(!cb || typeof cb !== 'function'){
    return cb('callback not provided');
  }

  if(!options.email) return cb('missing email property');
  if(!options.list) return cb('missing list property');
  if(!options.apiKey) return cb('missing apiKey property');
  if(!options.dataCenter) return cb('missing dataCenter property');

  request.del({
    url: 'https://'+ options.dataCenter +'.api.mailchimp.com/3.0/lists/' + options.list + '/members/' + md5(options.email),
    headers: {'Authorization': 'apikey ' + options.apiKey}
  }, function(err, res, body){
    if(err) return cb(err);

    var response = JSON.parse(body);
    return cb(null, response);
  });

};
