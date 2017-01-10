app.directive('user', function(){
  return {
    templateUrl: 'app/User/user.html',
    scope: {},
    controller: function($scope, md5, Auth, LocalStore, User, $mdDialog, $http){
      $scope.userAction   = Auth;

      User.isInit(function(){

        $scope.user = User.getUser();
        $scope.$watch(function () { return User.getUser(); }, function (newValue, oldValue) {
          if (newValue !== oldValue) $scope.user = newValue;
          if ($scope.user && $scope.user.facebook) {
            $scope.user.facebook.displayName  = $scope.user.facebook.displayName.split(' ');
            $scope.user.facebook.displayName  = $scope.user.facebook.displayName[0];
            if(!$scope.user.picture) {
              $scope.user.picture               = 'http://graph.facebook.com/' + $scope.user.facebook.id + '/picture?width=300';
            }
          }

          if($scope.user && !$scope.user.facebook && $scope.user.email && !$scope.user.picture) {
            $scope.user.picture = 'http://www.gravatar.com/avatar/' + md5.createHash($scope.user.email) + '?s=300';
          }

      });


      $scope.feedback = function(ev) {

        $mdDialog.show({
          templateUrl: 'app/Directives/feedback/feedback.html',
          clickOutsideToClose:true,
          targetEvent: ev,
          preserveScope: true,
          locals: {},
          controller: feedbackCtrl,
        }).then(function(form){
          $http.post('api/user/feedback', form);
        });
      };



      function feedbackCtrl($scope, $mdDialog, $http) {
        $scope.send = function(form) {
          $mdDialog.hide(form);
        };
      }

      });



    }
  };
});
