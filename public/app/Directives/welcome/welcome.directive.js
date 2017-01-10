app.directive('welcome', function($rootScope, $window, LocalStore, $state, $timeout, User) {
  return {
    templateUrl: 'app/Directives/welcome/welcome.template.html',
    scope: {},
    link: function(scope, element, attrs) {


      var coverImg    = element.find('img');
      var text        = element.find('span');
      var loading     = document.getElementById('loading');
      var welcome     = document.getElementById('welcome');
      var cover       = document.getElementById('cover');
      var coverText   = document.getElementById('text');
      var isLoggedIn  = LocalStore.getItem('auth-token');

      var skipStates = ['user', 'forgot', 'resetPassword', 'login', 'signup', 'wishlist', 'about', 'privacy'];

      scope.about = function(){
        $state.go('about');
        removeWelcomeScreen();
      };

      scope.welcome = function welcome(){
        $state.go('signup');
        removeWelcomeScreen();
      };

      function removeWelcomeScreen(){
        element.children().addClass('fadeOut animated');
        $timeout(function () {
          element.remove();
        }, 300);
      }

      function removeLoading(){
        loading.classList.add("fadeOut");
        $timeout(function () {
          hideEl(loading);
        }, 300);
      }

      function showCoverImage(){
        showEl(cover);
        coverImg.removeClass('ng-hide').addClass('fadeInCover');
        $timeout(function () {
          showEl(coverText);
          text.removeClass('ng-hide').addClass('fadeInDown');
        }, 600);
      }

      function showEl(el){
        el.style.display = 'block';
      }

      function hideEl(el){
        el.style.display = 'none';
      }

      function removeWelcomeIfState(){
        if(skipStates.indexOf($state.current.name)  != -1) removeWelcomeScreen();
      }

      User.isInit(function(){
        removeLoading();
        if(isLoggedIn) return removeWelcomeScreen();
        removeWelcomeIfState();
        showCoverImage();
        setTimeout(function () {
          if($state.current.name === 'main') return $state.go('signup');
        }, 1000);

      });

    }
  };
});
