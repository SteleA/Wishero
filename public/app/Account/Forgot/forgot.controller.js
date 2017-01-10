app.controller('ForgotCtrl', function($scope, MetaSettings, Auth, $mdDialog){
  MetaSettings.setTitle('Forgot password');

  $scope.loginFb = function(){
    window.location.href = '/api/auth/facebook';
  };

  $scope.submitForm = function(form){
    $scope.error = '';
    $scope.loading = true;

    Auth.forgot(form.username)
      .then(function success(){
        $scope.loading = false;
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Reset password')
            .content('We have sent you a reset password link to your email. Check your inbox and spam folder.')
            .ariaLabel('Reset passord')
            .ok('Got it!')
            .targetEvent()
        );
      })
      .catch(function error(err){
        $scope.loading = false;
        $scope.error = err.data;
      });
  };
});
