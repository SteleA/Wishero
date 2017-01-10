
app.factory('User', function($q, Wishlist, $timeout, $rootScope, LocalStore, $http, analytics){

  var wishlists = [];
  var initialized = false;
  var user = null;


  return {
    init: init,
    isInit: isInit,
    getWishlists: getWishlists,
    getWishlist: getWishlist,
    setWishlists: setWishlists,
    updateWishlist: updateWishlist,
    kill: kill,
    getUser: getUser,
    setUser: setUser,
    mostWishlistItems: mostWishlistItems,
    addWishListItem: addWishListItem,
    removeWishlistItem: removeWishlistItem,
    updateWishlistItem: updateWishlistItem,
    getAllWishes: getAllWishes,
    createWishlist: createWishlist,
    deleteWishlist: deleteWishlist,
    getFriends:getFriends,
    addFriend:addFriend,
    deleteFriend: deleteFriend,
    inviteFriend: inviteFriend
  };

  function getUser(){
      return user;
  }

  function setUser(newUser){
    user = newUser;
  }

  function isInit(cb){
    if(!initialized){
      $timeout(function(){
        isInit(cb);
      }, 1000);
    } else {
      return cb();
    }
  }

  function init(obj){
    initialized = false;
    var wishlistDefer = $q.defer();

    if(obj && obj.token){
      LocalStore.setItem('auth-token', obj.token);
    }

    if(obj && obj.user) {
      user = obj.user;
      analytics.identify(user._id);
    }

    if(obj && obj.wishlists) {
      wishlists = obj.wishlists;
      wishlistDefer.resolve(obj.wishlists);
      initialized = true;
    }

    $timeout(function () {
      if(LocalStore.getItem('auth-token')) {
        Wishlist.fetch()
          .then(

            function success(res){
              wishlistDefer.resolve(res.data.wishlist);
              wishlists = res.data.wishlist;
              user = res.data.user;



              analytics.identify(user._id);


              analytics.setUser({
                $email: user.email,
                $username: user.username,
                $name: username(),
                wishes: getAllWishes().items.length,
                wishlists: wishlists.length,
                birthday: birthday(),
                friends: user.friends.length,
                facebook: facebook(),
                confirmed: user.confirmed || false,
              });

              function username(){
                if(user && user.firstName && user.lastName) return user.firstName + ' ' + user.lastName;
                return user.username;
              }

              function birthday(){
                if(user && user.birthday === '1970-01-01T00:00:00.000Z') return;
                return user.birthday;
              }

              function facebook() {
                if(user && user.facebook) return true;
                return false;
              }


              initialized = true;
            },
            function error(err){
              initialized = true;
            }
          );
      }else {
        initialized = true;
        wishlistDefer.resolve();
      }
    }, 10);


    return $q.all([wishlistDefer.promise]);



  }

  function getWishlists(){
    return wishlists;
  }

  function getWishlist(id){




    for (var i = 0; i < wishlists.length; i++) {
      if(id === wishlists[i]._id){
        return wishlists[i];
      }
    }

    return null;

  }

  function setWishlists(wishlists){
    wishlists = wishlists;
  }

  function updateWishlist(newWishlist){
    var oldWishlist = findWishlist(newWishlist._id);
    oldWishlist = newWishlist;
    mixpanel.track("Wishlist updated");
    Wishlist.updateWishlist(newWishlist);
  }

  function findWishlist(id){
    for (var i = 0; i < wishlists.length; i++) {
      if(id === wishlists[i]._id){
        return wishlists[i];
      }
    }
  }

  function mostWishlistItems(){
        var mostItems = 0;
        var goto = 0;

        if(wishlists.length === 0) return null;

        for (var i = 0; i < wishlists.length; i++) {
          if(mostItems <= wishlists[i].items.length) {
            mostItems = wishlists[i].items.length;
            goto = wishlists[i];
          }
        }

        return goto._id;
  }

  function getAllWishes(){
    var obj = {};
    var arr = [];

    for (var i = 0; i < wishlists.length; i++) {
      arr.push(wishlists[i].items);
    }

    arr = _.flatten(arr);
    obj.items = arr;

    return obj;
  }


  function kill(){
    //initialized = false;
  }

  //check if item exists within wishlist
  function wishListItemExisits(wishlist, item){
    for (var i = 0; i < wishlist.items.length; i++) {
      if(wishlist.items[i].id == item.id){
        return true;
      }
    }
    return false;
  }

  //add item to wishlist if item does not exist
  function addWishListItem(item){
    var wishlist = findWishlist(item.wishlistId);

    if(!wishListItemExisits(wishlist, item)) {
      wishlist.items.push(item);

      Wishlist.addItem(wishlist, item)
        .success(function(res){
          mixpanel.people.increment("wishes");
          mixpanel.track("Wishlist item added");
          if(res.url){

             Wishlist.fetchItemData(item)
               .success(function(res){
                 if(res.img.length > 0)  item.img  = res.img[0];
                 if(res.name)            item.name = res.name;
                 if(res.desc)            item.desc = res.desc;

                 updateWishlistItem(item);
                 Wishlist.updateItem(wishlist, item);
               });

           }
        });
    }

  }

  function getWishlistItem(wishlist, item, cb){
    for (var i = 0; i < wishlist.items.length; i++) {
      if(wishlist.items[i].id == item.id){
        return cb(wishlist.items[i], i, wishlist);
      }
    }
    return cb(null);
  }


  function removeWishlistItem(item) {
    var wishlist = findWishlist(item.wishlistId);

    getWishlistItem(wishlist, item, function(_item, index, _wishlist){
      if(!_item) return;
      _wishlist.items.splice(index, 1);
      mixpanel.people.increment("wishes", -1);
      mixpanel.track("Wishlist item removed");
      Wishlist.deleteItem(wishlist, item);
    });

  }

  function updateWishlistItem(item){
    var wishlist = findWishlist(item.wishlistId);

    getWishlistItem(wishlist, item, function(_item, index, _wishlist){
      if(!_item) return;
      _wishlist.items[index] = item;
      Wishlist.updateItem(wishlist, item);
      mixpanel.track("Wishlist item updated");
    });
  }

  function deleteWishlist(wishlistId){

    for (var i = 0; i < wishlists.length; i++) {
      if(wishlists[i]._id == wishlistId) {
        wishlists[i].items = [];
        $rootScope.showSubheader = false;
        wishlists.splice(i,1);
        mixpanel.people.increment("wishlists", -1);
        mixpanel.track("Wishlist deleted");
      }
    }
  }

  function createWishlist(wishlist){
    var exists = false;

    for (var i = 0; i < wishlists.length; i++) {
      if(wishlists[i]._id == wishlist._id) exists = true;
    }

    if (!exists) {
      mixpanel.people.increment("wishlists");
      mixpanel.track("Wishlist created");
      wishlists.push(wishlist);
    }

  }

  function getFriends(query) {
    return $http.get('/api/user/friend/' + query);
  }

  function deleteFriend(friend){

    for (var i = 0; i < user.friends.length; i++) {
      if(friend._id === user.friends[i]._id) {
        user.friends.splice(i,1);
        del();
        }
      }
      function del(){
        $http.delete('/api/user/friend/' + friend._id)
          .then(
            function success(res){
              $rootScope.$emit('error', 'Friend removed');
              mixpanel.people.increment("friends", -1);
              mixpanel.track("Friend deleted");
            },
            function error(err){
              $rootScope.$emit('error', 'Unable to remove friend');
            }
          );
      }



  }

  function addFriend(friend){

    var exisits = false;

    for (var i = 0; i < user.friends.length; i++) {
      if(friend._id === user.friends[i]._id) {
        exisits = true;
      }
    }

    if(!exisits) {

      $http.post('/api/user/friend/', {_id: friend._id})
      .then(
        function success(){
          user.friends.push(friend);
          mixpanel.people.increment("friends");
          mixpanel.track("Friend added");
        },
        function error(err){
          $rootScope.$emit('error', err.data.error);
        });
    }

  }

  function inviteFriend(email){
    mixpanel.track("Friend invited");
    return $http.post('/api/user/invite', {email: email});
  }

});
