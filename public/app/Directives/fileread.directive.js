app.directive("fileread", function (upload, Wishlist, $http, User) {
    return {
        scope: {
            fileread: "=",
            wish:'@',
            wl:'@'
        },
        link: function (scope, element, attributes) {

          var wishlist, wish, file;

          var fileIntput = element.parent().find('input');

            element.bind('click', function(){
              element.parent().find('input')[0].click();
            });

            fileIntput.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread  = changeEvent.target.files[0];
                    wishlist    = JSON.parse(attributes.wl);
                    wish        = JSON.parse(attributes.wish);
                    file        = changeEvent.target.files[0];

                    upload.getSignature(file, function(err, signature){
                      if(err) return scope.$emit('error', err);
                      wish.img = signature.url;
                      file.name = signature.fileName;

                      upload.uploadFile(file, signature.signed_request, updateWishlist);
                    });
                });
            });

            function updateWishlist(err){
              if(err) return scope.$emit('error', err);
              //element.parent().find('img')[0].src = wish.img;
              wish.wishlistId = wishlist._id;
              User.updateWishlistItem(wish);
              mixpanel.track("Wishlist item picture uploaded");
              Wishlist.updateItem(wishlist, wish);
            }
        }
    };
});
