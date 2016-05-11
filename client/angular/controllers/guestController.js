myApp.controller('guestController', function($scope, $window, auth, postFactory,$document, $state){
  $scope.logOut = function(){
    $state.go('index');
  }
});
