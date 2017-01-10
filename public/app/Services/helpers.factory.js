app.factory('helpers', function(){

  var typewatchTimer = 0;


  return {
    typewatch: typewatch,
    clearTypewatchTimer: clearTypewatchTimer,
    makeId: makeId,
    capitalizeFirstLetter: capitalizeFirstLetter
  };


  function typewatch(string, cb, time){
    time = time || 1000;

    clearTimeout (typewatchTimer);

    typewatchTimer = setTimeout(function(){
      if(!string) return;

      return cb();

    }, time);
  }

  function clearTypewatchTimer(){
    clearTimeout(typewatchTimer);
  }

  function makeId(length){
      var lengthOfId = 30;
      if (length) lengthOfId=length;


      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < lengthOfId; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

});
