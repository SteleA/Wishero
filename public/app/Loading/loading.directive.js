app.directive('loading', function($window, User){
  return {
    templateUrl: 'app/Loading/loading.html',
    transclude: true,
    link: function(scope, element, attr){}
  };
});
