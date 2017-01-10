app.directive('itemGrid', function(User, $state, $rootScope, $timeout){
  return {
    templateUrl: 'app/Wishlist/itemGrid/itemGrid.template.html',
    scope: { pub: '@'},
    link: function(scope, element, attributes){


      User.isInit(function(){

        if(attributes.show && attributes.show.length > 20){
          scope.showExtras = true;
          scope.wishlist = User.getWishlist(attributes.show);

          scope.$watch(function () { return User.getWishlist(attributes.show); }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              scope.wishlist = newValue;
            }
          });
        }

        if(attributes.show === 'all'){
          scope.wishlist = User.getAllWishes();
          scope.showExtras = false;
        }


      });

      scope.$on('pub', function(ev, data){
        scope.showExtras = false;
        var wishlists = data.wishlists;
        var items = [];

        for (var i = 0; i < wishlists.length; i++) {
          items.push(wishlists[i].items);
        }

        items = _.flatten(items);

        scope.wishlist = {items: items};
      });
    }
  };
});
