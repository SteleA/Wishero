app.controller('subheaderCtrl', function($scope, User, Wishlist, $state, $timeout, $rootScope){

  User.isInit(function(){
    if($state.current.name == 'wishlist') {
      $rootScope.showSubheader = true;
    }
  });

  $scope.deleteWishlist = function() {
    User.deleteWishlist($state.params.id);
    Wishlist.deleteWishlist({_id: $state.params.id});
  };


});
