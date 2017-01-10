app.factory('Wishlist', function($http, $rootScope){

  var localWishlist = [];

  return {
    fetch         : getWishLists,
    getWishlist   : getWishlist,
    createWishlist: createWishlist,
    updateWishlist: updateWishlist,
    deleteWishlist: deleteWishlist,
    addItem       : addItem,
    updateItem    : updateItem,
    deleteItem    : deleteItem,
    fetchItemData : fetchItemData,

  };

  function getWishLists(){
    return $http.get('api/wishlist');
  }

  function getWishlist(wishlistId){
    return $http.get('api/wishlist/' + wishlistId);
  }

  function createWishlist(wishlist){
    return $http.post('api/wishlist/', wishlist);
  }

  function updateWishlist(wishlist){
    return $http.put('api/wishlist/' + wishlist._id, wishlist);
  }

  function deleteWishlist(wishlist){
    return $http.delete('api/wishlist/' + wishlist._id);
  }

  function addItem(wishlist, item){
    return $http.post('api/wishlist/' + wishlist._id, item);
  }

  function updateItem(wishlist, item){
    return $http.put('api/wishlist/' + wishlist._id + '/' +  item.id, item);
  }

  function deleteItem(wishlist, item){
    return $http.delete('api/wishlist/' + wishlist._id + '/' +  item.id);
  }

  function fetchItemData(item){
    return $http.post('api/wishlist/getImages', {url: item.url});
  }


});
