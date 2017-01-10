app.factory('MetaSettings', function(){
  var appName = 'Wishero';
  var title = 'Loading';
  var desc = '';
  var version = '';
  var socialUrl = '';

  return {
    appName: function () {return appName;},
    title: function () {return title + ' | ';},
    setTitle: function (newTitle) {title = newTitle;},
    desc: function (text) {return desc;},
    setDesc: function (newDesc) {desc = newDesc;},
    version: function () {return version;},
    setVersion: function (newVersion) {version = newVersion;},
    setSocialUrl: function (url) {socialUrl = url;},
    getSocialUrl: function (url) {return socialUrl;}
  };

});
