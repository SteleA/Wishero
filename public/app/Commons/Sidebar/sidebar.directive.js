app.directive('sidebar',function(User){
  return {
    templateUrl: 'app/Commons/Sidebar/sidebar.html',
    scope: {},
    link: function(scope, element, attributes) {

      element.parent().addClass('hide');

      scope.user = User.getUser();

      scope.$watch(function () { return User.getUser(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.user = newValue;
          if(!newValue) {
            element.parent().addClass('hide');
          }
          if(newValue) {
            element.parent().removeClass('hide');
          }
        }

      });
    },
    controller: function($scope, $rootScope, Wishlist, $state, $mdSidenav, $mdDialog, $log, $http, $q, MetaSettings, User, $timeout){



      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };


      $timeout(function () {

      $scope.wishlists = User.getWishlists();

      $scope.$watch(function () { return User.getWishlists(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.wishlists = newValue;
        }
      });

    }, 10);








      $scope.addFriend = function(ev) {

        $mdDialog.show({
          templateUrl: 'app/Friend/addFriend.html',
          clickOutsideToClose:true,
          targetEvent: ev,
          preserveScope: true,
          locals: {},
          controller: addFriendCtrl,
        }).then(function(item){
          if(item) {
            User.addFriend(item);
          }
        });
      };

      $scope.removeFriend = function(friend) {

        User.deleteFriend(friend);
      };


      function addFriendCtrl($scope, $mdDialog, helpers) {

            $scope.querySearch = function (query) {
              var defered;

              deferred = $q.defer();

              helpers.typewatch(query, function(){
                User.getFriends(query)
                  .success(function(users){
                    deferred.resolve(users);
                  });
              });

              return deferred.promise;
            };



            $scope.isEmail = function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            };

            $scope.sendInvite = function(email){
              User.inviteFriend(email)
                .then(
                  function success(res){
                    $scope.$emit('error', 'Invite has been sent!');
                    $scope.searchText = '';
                    $mdDialog.hide($scope.item);
                  },
                  function error(err){
                    $scope.$emit('error', err.data);
                  }
                );
            };

            $scope.cleanUser = function (user){
              if(!user.firstName && !user.lastName) return user.username;
              return  user.username + ', ' + user.firstName + ' ' + user.lastName;
            };

            $scope.addFriend = function(){
              $mdDialog.hide($scope.item);
            };


      }

    }
  };
});
