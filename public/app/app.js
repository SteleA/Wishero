
var app = angular.module('Wishero', [
  'ui.router',
  'angular-md5',
  'ngMaterial',
  //'ngMessages'
]);

app.run(function($rootScope, $state, Auth, User) {
  User.init();

  $rootScope.$on('$stateChangeSuccess', function (event, next) {
      ga('send', 'pageview', '/' + $state.current.name);
  });


  $rootScope.$on('$stateChangeStart', function (event, next) {



    User.isInit(function(){

      if (next.authenticate || next.hasRole) {

        if (!User.getUser()){
          event.preventDefault();
          $state.go('main');
        }

        if (next.hasRole === 'admin') {
          Auth.userIs()
            .then(function success(response) {
              if (next.hasRole === response.data.role) return;
            });
        }
      }
    });



    });
  });

app.config(function ($locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('AuthInterceptor');
});


// Running Google analytics
app.run(function(User){
  ga('create', 'UA-71680176-1', 'auto');
  ga('send', 'pageview');
});
