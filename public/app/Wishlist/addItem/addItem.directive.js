app.directive('addItem', function($mdDialog){
  return {
    scope: {},
    link: function(scope, element, attributes){
      element.bind('click', function(ev){
        $mdDialog.show({
          templateUrl: 'app/Wishlist/addItem/addItem.template.html',
          clickOutsideToClose: true,
          targetEvent: ev,
          controller: addItem,
        });
      });

      function addItem(scope, $mdDialog, $state, helpers, User) {

        scope.addItem = function(){

          if(!scope.newItem.item || !$state.params.id) return;

          var _item = {
            wishlistId: $state.params.id,
            priority: 0,
            id: helpers.makeId(5)
          };

          if(is.url(scope.newItem.item)) {
            _item.url = scope.newItem.item;
          } else {
            _item.name = scope.newItem.item;
          }

          User.addWishListItem(_item);
          $mdDialog.cancel();
        };

      }
    }
  };
});
