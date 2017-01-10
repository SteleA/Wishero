app.directive('error', function($rootScope, Auth, $state, $mdToast){
  return {
    link: function(scope, element, attributes){

      $rootScope.$on('error', function(event, err){
        if(err === 401) return Auth.logout();
        if(err === 403){
          event.preventDefault();
          return $state.go('main');
        }

        if(typeof err === 'string') $mdToast.showSimple(err);

      });
    }
  };
});
