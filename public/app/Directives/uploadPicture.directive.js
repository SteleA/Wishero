app.directive("uploadPicture", function (upload, Auth, $http, imageService, $rootScope) {
    return {
        scope: {},
        link: function (scope, element, attributes) {

          var file, userpic;


            var trigger;

            var ele = element.parent().children();



            for (var i = 0; i < ele.length; i++) {
              if(ele[i].dataset.pic) {
                trigger = ele[i];
              }
            }


            trigger.addEventListener("click", function(){
              element[0].click();
            });

            element.bind("change", function (changeEvent) {



                    file            = changeEvent.target.files[0];
                    var currentImg  = element.parent().find('img')[0].src;
                    var img         = new Image();

                    //img.crossOrigin = "Anonymous";



                    //get the file path
                    var fileLoader = new FileReader();
                    fileLoader.readAsDataURL(file);

                    //wait for fileLoader to finnish
                    fileLoader.onload = function() {
                       var data = this.result;
                       element.parent().find('img')[0].src = data;
                       img.src = data;
                     };

                     fileLoader.onabort = function() {
                       $rootScope.emit('error', 'The upload was aborted.');
                    };

                    fileLoader.onerror = function() {
                      $rootScope.emit('error', 'An error occured while reading the file.');
                    };


                    img.onload = function() {
                        imageService.resizeStep(img, 500, 500)
                          .then(function (resizedImage) {

                            //prepare new image for upload
                            var blobBin = atob(resizedImage.src.split(',')[1]);
                            var array = [];
                            for(var i = 0; i < blobBin.length; i++) {
                                array.push(blobBin.charCodeAt(i));
                            }

                            var newFile = new Blob([new Uint8Array(array)], {type: file.type});
                            newFile.name = file.name;


                            upload.getSignature(newFile, function(err, signature){
                              if(err) return console.log(err);
                              userpic = signature.url;
                              file.name = signature.fileName;
                              upload.uploadFile(newFile, signature.signed_request, function(err){
                                if(err) return console.log(err);
                                scope.$emit('fileUploadSuccess', userpic);
                              });

                            });

                        });
                    };






            });

        }
    };
});
