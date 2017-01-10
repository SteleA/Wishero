app.controller('TokenCtrl', function($scope, User, $stateParams, $state){
  User.init({token: $stateParams.token})
    .then(function(){
      var gotoWishlist = User.mostWishlistItems();
      if(!gotoWishlist) return $state.go('createWishlist');
      mixpanel.track("Facebook login");
      $state.go('wishlist', {username: User.getUser().username, id: gotoWishlist});
    });
});
