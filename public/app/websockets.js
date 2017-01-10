// app.run(function($rootScope, $timeout, $http, LocalStore, MetaSettings){
//
//
//   $rootScope.$on('webSocket', function(event, data, userEvent){
//
//
//     if(userEvent) return;
//
//     if(!data) {
//
//       if($rootScope.wsConnection) {
//         $rootScope.wsConnection.onclose = function (e) {
//           console.log('WebSocket closed');
//         };
//         $rootScope.wsConnection.close();
//       }
//
//
//       return
//     }
//
//     (function connect(){
//     $http.get('/api/info')
//       .success(function(res){
//
//         var server = res.ws + '?user=' + data._id;
//
//         $rootScope.wsConnection = new WebSocket(server);
//         MetaSettings.setVersion(res.version);
//         $rootScope.$broadcast('version', res.version);
//         $rootScope.name         = res.name;
//
//
//
//         $rootScope.wsConnection.onopen = function () {
//           console.log('WebSocket connected');
//         };
//
//         $rootScope.wsConnection.onclose = function (e) {
//           console.log('WebSocket closed unexpected. reconnecting...');
//           $timeout(connect, 2*1000);
//         };
//
//         $rootScope.wsConnection.onmessage = function (e) {
//           console.log(e.data);
//           var payload = JSON.parse(e.data);
//           $rootScope.$broadcast('ws:' + payload.topic, payload.data);
//         };
//       });
//
//     })();
//
//   });
//
//
//
//
//
// });
