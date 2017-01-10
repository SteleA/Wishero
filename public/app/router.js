app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider

    .state('main', {
      url: "/",
      templateUrl: "app/Main/main.html",
      controller: 'MainCtrl',
    })

    .state('about', {
      url: "/about",
      templateUrl: "app/About/about.html",
      controller: 'AboutCtrl',
    }) 

    .state('privacy', {
      url: "/privacy",
      templateUrl: "app/Privacy/privacy.html",
      controller: 'PrivacyCtrl',
    })



    .state('token', {
      url: "/token/:token",
      //templateUrl: "app/Main/main.html",
      controller: 'TokenCtrl',
    })

    .state('wishlist', {
      url: "/wishlist/:username/:id",
      templateUrl: "app/Wishlist/wishlist.html",
      controller: 'WishlistCtrl',
      //authenticate: true,
    })


    .state('createWishlist', {
      controller: function($state, Wishlist, User){

        Wishlist.createWishlist({name: 'New wishlist'})
          .success(function(res){
            User.createWishlist(res);
            $state.go('wishlist',{username: User.getUser().username, id: res._id});
          });

      },
    })



    .state('login', {
      url: "/login",
      templateUrl: "app/Account/Login/login.html",
      controller: 'LoginCtrl'
    })

    .state('forgot', {
      url: "/forgot",
      templateUrl: "app/Account/Forgot/forgot.html",
      controller: 'ForgotCtrl'
    })

    .state('resetPassword', {
      url: "/resetPassword/:forgotPasswordToken",
      templateUrl: "app/Account/Forgot/reset.html",
      controller: 'ResetCtrl'
    })

    .state('signup', {
      url: "/signup",
      templateUrl: "app/Account/Signup/signup.html",
      controller: 'SignupCtrl as signupCtrl'
    })

    .state('profile', {
      url: "/profile",
      templateUrl: "app/Account/Profile/profile.html",
      controller: 'ProfileCtrl',
      authenticate: true,
    })

    .state('settings', {
      url: "/settings",
      templateUrl: "app/Account/Settings/settings.html",
      controller: 'SettingsCtrl',
      authenticate: true,
    })

    .state('admin', {
      url: "/admin",
      templateUrl: "app/Account/Admin/admin.html",
      controller: 'AdminCtrl',
      hasRole: 'admin',
    })

    .state('user', {
      url: "/:username",
      templateUrl: "app/User/public.html",
      controller: 'UserCtrl'
    });

});
