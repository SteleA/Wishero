app.controller('SettingsCtrl', function($scope, MetaSettings, Auth, LocalStore, $timeout, $state, User){
  MetaSettings.setTitle('Settings');

  User.isInit(function(){
    $scope.user = User.getUser();

    $scope.form = {
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      birthday: new Date($scope.user.birthday),
      username: $scope.user.username,
      email: $scope.user.email,
    };

  });

  $scope.submitForm = function(){
    $scope.error = '';

    if($scope.form.birthday) $scope.form.birthday.setHours(2);

    Auth.userSettings($scope.form)
      .then(
        function success(){
          $scope.error = '';
          $state.go('profile');
        },
        function error(err){

          var errorObject = err.data.errors;
          var errorArr = [];

          for(var errors in errorObject){
            errorArr.push(errorObject[errors].message);
          }

          $scope.error = errorArr.join(" & ");
        }
      );
  };
});
