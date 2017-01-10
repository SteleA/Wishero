app.directive('feedback', function($mdDialog, $http){
  return {
    template: '<span ng-click="feedback($event)" class="feedback">Give feedback</span>',
    scope: {},
    controller: function($scope){


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
    }
  };
});
