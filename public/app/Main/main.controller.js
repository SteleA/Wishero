app.controller('MainCtrl', function($scope, MetaSettings, $state, LocalStore, User){
  MetaSettings.setTitle('Makes wishes come true');

  User.isInit(function(){
    if(User.getUser()){
      return $state.go('profile');
    }
    $state.go('signup');
  });

});
