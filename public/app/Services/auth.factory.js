app.factory('Auth', function($http, LocalStore, $rootScope, $state, $q, $timeout, User){

  return {
    login: login,
    signup: signup,
    logout: logout,
    userIs: userIs,
    userSettings: userSettings,
    loginWithToken: loginWithToken,
    refresh: getUserInfo,
    forgot: forgot,
    resetPassword: resetPassword,
    getUsers: getUsers,
    deleteUser: deleteUser,
  };

  function login(user) {
    //clearing out old token from localstore
    LocalStore.setItem('auth-token');

    return $http.post('/api/auth/local', user)
              .success(User.init);
  }

  function signup(user){

    LocalStore.setItem('auth-token');
    return $http.post('/api/user', user)
              .success(User.init);
  }

  function getUserInfo(user, event){
            User.init(user);
  }

  function loginWithToken(token){
    return User.init({token: token});
  }

  function userIs(){
    return $http.get('/api/user/profile/me');
  }

  function userSettings(user){
    return $http.put('/api/user', user)
      .then(function(res){
        mixpanel.track("Settings changed");
        getUserInfo(res, 'setting');
      });
  }

  function logout(){
    $timeout(function () {
      mixpanel.track("Logout");
      LocalStore.setItem('auth-token');
      $rootScope.$emit('webSocket', null);
      $rootScope.$emit('user', null);
      User.setUser(null);
      User.setWishlists(null);
      User.kill();
    }, 200)
      .then(function(){
        $state.go('login');
      });


  }

  function forgot(usernameOrEmail){
    return $http.get('/api/user/forgotpassword/' + usernameOrEmail);
  }

  function resetPassword(resetTokenAndPassword){
    return $http.post('/api/user/resetPassword', resetTokenAndPassword);
  }

  function getUsers(){
    return $http.get('/api/user');
  }

  function deleteUser(user){
    return $http.delete('/api/user/' + user._id);
  }


});
