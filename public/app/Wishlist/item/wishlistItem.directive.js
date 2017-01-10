app.directive('wishlistItems', function(User, $state, $mdDialog, Wishlist, helpers){
  return {
    templateUrl: 'app/Wishlist/item/item.template.html',
    scope: {},
    link: function(scope, element, attribute){


      User.isInit(function(){
        if($state.params.id){
          scope.wishlist = User.getWishlist($state.params.id);
          scope.$watch(function () { return User.getWishlist($state.params.id); }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              scope.wishlist = newValue;
            }
          });
        }
      });

      }
  };
});
