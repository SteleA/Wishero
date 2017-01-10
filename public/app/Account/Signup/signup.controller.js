app.controller('SignupCtrl', function($scope, MetaSettings, Auth, User, $state){
  MetaSettings.setTitle('Signup');

  $scope.loginFb = function(){
    window.location.href = '/api/auth/facebook';
  };

  $scope.submitForm = function(form){
    $scope.loading = true;
    Auth.signup(form)
      .then(function(res){
        User.isInit(function(){
          mixpanel.track("Signup");
          ga('send', 'event', 'signup', 'Signup success');
          goog_report_conversion();
          $state.go('createWishlist');
        });
      })
      .catch(function(err){
        $scope.loading = false;
        $scope.error = '';

        if (err.data.errors.username) {
          $scope.error = err.data.errors.username.message;
        }

        if (err.data.errors.username && err.data.errors.email) {
          $scope.error = $scope.error + ' & ';
        }

        if (err.data.errors.email) {
          $scope.error = $scope.error + err.data.errors.email.message;
        }

      });

  };

});
