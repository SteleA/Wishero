app.controller('UserCtrl', function(MetaSettings, $scope, $stateParams, $http, $window, User, $rootScope){

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  MetaSettings.setTitle(capitalizeFirstLetter($stateParams.username) +  '\'s wishlist');
  $scope.loading = true;


    $http.get('api/user/public/' + $stateParams.username)
      .then(
        function success(user){
          mixpanel.track("Viewing friend's wishes");
          $rootScope.$broadcast('pub', user.data);
          $scope.pubUser = user.data;
          $scope.loading = false;
        },
        function error(){
          $scope.loading = false;
          $scope.pubUser = null;
          $scope.$emit('error', ' The username could not be found. Check if the url is looking legit.');
          $scope.userStatus = 'User not found.';
        });





});
