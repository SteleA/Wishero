app.factory('upload', function($http){
  return {
    getSignature: getSignature,
    uploadFile: uploadFile
  };

  function getSignature(file, cb){
    $http.get('api/upload/sign_s3?file_name=' + file.name + '&file_type=' + file.type)
    .then(
      function success(res){
        return cb(null, res.data);
      },
      function error(err){
        return cb(err);
      });
  }

  function uploadFile(file, signed_request, cb){

    var config = {
      headers: {
        'x-amz-acl': 'public-read'
      }
    };

    $http.put(signed_request, file)
    .then(
      function success(res){
        return cb(null, res.data);
      },
      function error(err){
        return cb(err);
      });

  }




});
