app.directive('confirmAccount', function(LocalStore, $timeout, User, $http){
  return {
    templateUrl: 'app/Directives/confirmAccount/confirmAccount.html',
    scope: {},
    link: function(scope, element, attr){

      User.isInit(function(){
        scope.user = User.getUser();

        scope.$watch(function () { return User.getUser(); }, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.user = newValue;
          }
        });
      });

      scope.text = 'Your account is not confirmed. Click here to send a confirmation email.';
      scope.showBtn = true;

      scope.accept = function(){
        $http.get('/api/user/confirm/send')
          .then(function(){
            scope.text = 'Confirmation email has been sent. Check your inbox and spam folder.';
            scope.showBtn = false;
            setTimeout(function () {
              element.find('div').addClass('slideOutDown');
            }, 3000);
          });

      };

    }
  };
});
