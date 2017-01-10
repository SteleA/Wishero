app.factory('AuthInterceptor', function AuthInterceptor(LocalStore, $q, $rootScope) {
  'use strict';
  return {
    request: addToken,
    responseError: function(res){
      var defer = $q.defer();

      if( LocalStore.getItem('auth-token') ){
        $rootScope.$emit('error', res.status);
      }

      defer.reject(res);

      return defer.promise;
    }
  };

  function addToken(config) {
    var token = LocalStore.getItem('auth-token');

    var url = config.url.split('.');

    if (token && url.indexOf('amazonaws') == -1) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
  }
});
