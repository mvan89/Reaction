var myApp = angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ui.navbar', 'jcs-autoValidate', 'ngAnimate', 'ngToast', 'ngSanitize', 'angularFileUpload', 'duScroll'])
.value('duScrollDuration', 1000)
 .value('duScrollOffset', 30);


myApp.run(function(defaultErrorMessageResolver){
  defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages){
    errorMessages['badName'] = 'Name must only contain Alpha characters.';
    });
  }
);

myApp.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

myApp.config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      verticalPosition: 'top',
      horizontalPosition: 'right',
      maxNumber: 1
    });
  }]);

myApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('index',{
        url: '/',
        templateUrl: 'static/partials/login.html',
        onEnter: function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }
    })
    .state('home',{
        url: '/home',
        templateUrl: 'static/partials/loggedIn.html',
        controller:'mainController',
        onEnter: function($state, auth){
          if(!auth.isLoggedIn()){
            $state.go('index');
          }
        }
    })
    .state('guest',{
        url: '/guest',
        templateUrl: 'static/partials/loggedInGuest.html',
        controller:'mainController'
    })

});
