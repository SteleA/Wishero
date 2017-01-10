app.controller('ProfileCtrl', function($scope, MetaSettings, Wishlist, User, Auth){
  MetaSettings.setTitle('My profile');

  $scope.$on('fileUploadSuccess', function(ev, data){
    $scope.user.picture = data;
    mixpanel.track("Added profile picture");
    Auth.userSettings($scope.user);
  });


  User.isInit(function(){
    $scope.user = User.getUser();
    $scope.wishes = User.getAllWishes().items.length;

    $scope.$watch(function () { return User.getUser(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.user = newValue;
      }
    });
  });








});
