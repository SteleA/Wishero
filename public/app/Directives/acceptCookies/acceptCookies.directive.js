app.directive('acceptCookies', function(LocalStore, $timeout){
  return {
    templateUrl: 'app/Directives/acceptCookies/acceptCookies.html',
    scope: {},
    link: function(scope, element, attr){
      $timeout(function(){
        if(!LocalStore.getItem('cookiesAccepted')) scope.acceptCookies = true;
      },100);

      scope.accept = function(){
        LocalStore.setItem('cookiesAccepted', true);
        element.find('div').addClass('slideOutDown');
      };
    }
  };
});
