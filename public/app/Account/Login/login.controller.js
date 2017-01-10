app.controller('LoginCtrl', function($scope, MetaSettings, Auth, LocalStore, $state, User){
  MetaSettings.setTitle('Login');

  $scope.loginFb = function(){
    window.location.href = '/api/auth/facebook';
  };

  $scope.submitForm = function(form){
    $scope.error = '';

    $scope.loading = true;

    if(form.username) form.username = form.username.toLowerCase();

    Auth.login(form)
      .then(function(res){

        User.isInit(function(){
          mixpanel.track("Login");

          $state.go('wishlist', {username: User.getUser().username, id: User.mostWishlistItems()});
        });

      })
      .catch(function(err){
        $scope.error = err.data.message;
        $scope.loading = false;
        $scope.$emit('error', 'Login failed: ' + err.data.message);
      });
  };
});
