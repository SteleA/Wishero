app.directive('wishlistMissing', function($state, User){
  return {
    templateUrl: 'app/Wishlist/missing/missing.template.html',
    scope: {},
    link: function(scope, element, attribute){
      User.isInit(function(){
        scope.wishlist = User.getWishlist($state.params.id);

        scope.$watch(function () { return User.getWishlist($state.params.id); }, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.wishlist = newValue;
            if(newValue === null)  scope.wishlistStatus = "Wishlist deleted";
          }
        });

        if(scope.wishlist === null)  {
          scope.wishlistStatus = "Wishlist not found";
        }

      });
    }
  };
});
