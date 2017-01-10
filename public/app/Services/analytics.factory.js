app.factory('analytics', function(){
  return {
    identify: function(id){
      mixpanel.identify(id);
    },
    track: function(action, options){
      mixpanel.track(action, options);
    },
    setUser: function(options){
      mixpanel.people.set(options);
    }

  };
});
