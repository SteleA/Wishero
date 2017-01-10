app.directive('subHeader', function($timeout, $state, $rootScope, User){
  return {
    templateUrl: 'app/Wishlist/subHeader/subheader.template.html',
    scope: {},
    link: function(scope, element, attributes){

      var showSubHeaderOnStates = ['wishlist'];

      User.isInit(function(){

        $rootScope.$on('$stateChangeSuccess', function (event, next) {
            showSubeheaderOrNot($state.current.name);
        });

        showSubeheaderOrNot($state.current.name);

        function showSubeheaderOrNot(state){
          if(showSubHeaderOnStates.indexOf(state) > -1){
            scope.showSubheader = true;
          } else {
            scope.showSubheader = false;
          }
        }

        scope.wishlist = User.getWishlist($state.params.id);

        scope.$watch(function () { return User.getWishlist($state.params.id); }, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.wishlist = newValue;
            if(newValue === null)  scope.showSubheader = false;
          }
        });

        if(scope.wishlist === null)  {
          scope.showSubheader = false;
        }

      });

      scope.deleteWishlist = function() {
        User.deleteWishlist($state.params.id);
        Wishlist.deleteWishlist({_id: $state.params.id});
      };

    },
  };
});
