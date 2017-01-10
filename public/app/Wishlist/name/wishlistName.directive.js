app.directive('wishlistName', function(Wishlist, User, $state, helpers){
  return {
    templateUrl: 'app/Wishlist/name/wishlistName.html',
    scope: {},
    controller: function($scope){

      User.isInit(function(){
        $scope.wishlist = User.getWishlist($state.params.id);

        $scope.$watch(function () { return User.getWishlist($state.params.id); }, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.wishlist = newValue;
          }
        });

      });

      $scope.updateWishlist = function(wishlist){
        helpers.clearTypewatchTimer();
        User.updateWishlist(wishlist);
      };

      $scope.typewatch = function(){
        helpers.typewatch($scope.wishlist.name, function(){
          if(!$scope.wishlist.name) return;
          User.updateWishlist($scope.wishlist);
        });
      };

    },
    link: function(scope, element, attrs){
      element.on('submit', function(){
        element.find('input').blur();
      });
    }
  };
});
