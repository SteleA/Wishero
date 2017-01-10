app.directive('wishlistEmptyState', function(User, $state, Wishlist, helpers){
  return {
    templateUrl: 'app/Wishlist/empty/emptyState.template.html',
    scope: {},
    link: function(scope, element, attribute){

      User.isInit(function(){

        if($state.params.id){
          scope.wishlist = User.getWishlist($state.params.id);

          if(scope.wishlist === null) scope.hideEmptyState = true;

          scope.$watch(function () { return User.getWishlist($state.params.id); }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              scope.wishlist = newValue;

              if(scope.wishlist === null) scope.hideEmptyState = true;

            }
          });
        }else {

          scope.hideEmptyState = true;
        }
      });

      scope.addItem = function(nameOrUrl){
        if(!nameOrUrl) return;

        var wishlist = {_id: $state.params.id};

        var _item = {
          wishlistId: $state.params.id,
          priority: 0,
          id: helpers.makeId(5)
        };

        if(is.url(nameOrUrl)) {
          _item.url = nameOrUrl;
        } else {
          _item.name = nameOrUrl;
        }

        User.addWishListItem(_item);


      };

    }
  };
});
