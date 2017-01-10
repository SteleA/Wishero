app.controller('HeaderCtrl', function($scope, User, $mdSidenav, Auth){

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.$watch(function () { return User.getUser(); }, function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.user = newValue;
    }
  });

  $scope.logout = function(){
    Auth.logout();
  };

});
