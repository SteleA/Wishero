
var hogan = require('hogan.js');
var fs = require('fs');
var config = require('../config');
var sendgrid = require("sendgrid")(config.sendgridUsername, config.sendgridPassword);


exports.forgotPassword = function(res, user){

  var template = fs.readFileSync(__dirname + '/forgotPassword.hjs','utf-8');
  var compliedTemplate = hogan.compile(template);

  if(!config.sendgridUsername && !config.sendgridPassword) return res.send('missing sendgrid credentials');

  sendgrid.send({
    to:       user.email,
    fromname: config.appName,
    from:     config.supportEmail,
    subject:  'Forgot password',
    html:     compliedTemplate.render({
      resetURL: config.URL + '/resetPassword/' + user.forgotPasswordToken,
      email: user.email,
      username: user.username,
      supportEmail: config.supportEmail,
      appName: config.appName,
      appURL: config.URL,
    })
  }, function(err, json){
    if (err) return console.log(err);
    res.send('success');
  });
};

exports.feedback = function(user, callback){



  if(!config.sendgridUsername || !config.sendgridPassword) {
    return callback('missing sendgrid credentials');
  }

  sendgrid.send({
    to:       ['alemik+ls8iks3fuylunol1keig@boards.trello.com', 'feedback@wishero.co'],
    fromname: user.email,
    from:     config.supportEmail,
    subject:  user.username + ' | ' + new Date(),
    html:     user.feedback
  }, function(err, json){
    if (err) return callback(err);
    return callback(null, json);
  });


};

exports.confirm = function(user, callback){

  var template = fs.readFileSync(__dirname + '/confirm.hjs','utf-8');
  var compliedTemplate = hogan.compile(template);

  if(!config.sendgridUsername || !config.sendgridPassword) {
    return callback('missing sendgrid credentials');
  }


  sendgrid.send({
    to:       user.email,
    fromname: config.appName,
    from:     config.supportEmail,
    subject:  'Confirm your account',
    html:     compliedTemplate.render({
      resetURL: config.URL + '/api/user/confirm/' + user.confirmToken,
      email: user.email,
      username: user.username,
      supportEmail: config.supportEmail,
      appName: config.appName,
      appURL: config.URL,
    })
  }, function(err, json){
    if (err) return callback(err);
    return callback(null, json);
  });


};

exports.invite = function(user, callback){

  var template = fs.readFileSync(__dirname + '/invite.hjs','utf-8');
  var compliedTemplate = hogan.compile(template);

  if(!config.sendgridUsername || !config.sendgridPassword) {
    return callback('missing sendgrid credentials');
  }


  sendgrid.send({
    to:       user.invite,
    fromname: config.appName,
    from:     config.supportEmail,
    subject:  user.firstName + ' invited you to join Wishero',
    html:     compliedTemplate.render({
      firstName: user.firstName,
      supportEmail: config.supportEmail,
      appName: config.appName,
      appURL: config.URL,
    })
  }, function(err, json){
    if (err) return callback(err);
    return callback(null, json);
  });


};
