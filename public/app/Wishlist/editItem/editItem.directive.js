app.directive('editItem', function($mdDialog){
  return {
    scope: {
      item: '@',
      wishlist: '@'
    },
    link: function(scope, element, attributes) {

      element.bind('click', function(ev){

        var item          = JSON.parse(attributes.item);
        item.wishlistId   = attributes.wishlist;
        var wishlist      =  {_id: attributes.wishlist};

        $mdDialog.show({
          templateUrl: 'app/Wishlist/editItem/editItem.template.html',
          clickOutsideToClose:true,
          targetEvent: ev,
          locals: {
            item: item,
            wishlist: wishlist
          },
          controller: editItemCtrl,
        });
      });

      function editItemCtrl(scope, $mdDialog, item, wishlist, User, Wishlist, helpers) {
        scope.item = item;
        scope.wishlist = wishlist;

        scope.save = function() {
          User.updateWishlistItem(scope.item);
          $mdDialog.hide();
        };

        scope.delete = function() {
          User.removeWishlistItem(scope.item);
          $mdDialog.cancel();
        };

        scope.typewatch = function(){
          helpers.typewatch(scope.item.url, function(){
            if(!is.url(scope.item.url)) return;

            scope.loading = true;

            Wishlist.fetchItemData(scope.item)
              .then(
                function success(res){
                  //add image if there is no image
                  if(res.data.img.length > 0 && !scope.item.img) scope.item.img = res.data.img[0];
                  //add name if there is no name
                  if(res.data.name && !scope.item.name) scope.item.name = res.data.name;
                  scope.loading = false;
                },
                function error(){scope.loading = false;}
              );
            });
          };
      }

    }
  };
});
