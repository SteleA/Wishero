app.controller('WishlistCtrl', function ($scope, MetaSettings, $state, User){

  MetaSettings.setTitle('Wishlist');
  MetaSettings.setSocialUrl($state.params.username);
  MetaSettings.setDesc('Check out my wishes at Wishero.co. Create and share your wishlist too.');

  $scope.wishlistId = function(){
    return $state.params.id;
  };


  User.isInit(function(){
    if(!User.getUser() && $state.params.username) $state.go('user', {username: $state.params.username});
  });

});
