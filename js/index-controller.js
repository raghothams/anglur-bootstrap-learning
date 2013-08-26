// declare a module
var myAppModule = angular.module('myApp', []);

myAppModule.config(['$httpProvider', function($httpProvider){
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	delete $httpProvider.defaults.headers.common["Content-Type"];
	$httpProvider.defaults.useXDomain = true;
}]);

function loginCtr($scope,$http){
	$http.defaults.useXDomain = true;
	$scope.login = function(){
		
		var me = this;
    if(this.emailVal != undefined && this.passwordVal != undefined){
      
      var xsrf = $.param({"email": "dev@dev.com","password":"dev123"});
      $.ajax({
        crossDomain:true,
        url : "http://173.44.40.56:5000/signin",
              type : "POST",
              data: xsrf,
               xhrFields: {
        withCredentials: true
        }
      }).success(function(data, status, header) {
            console.log(header);
            // check for statusCode. if success, redirect to home.html
      });
    } else{
            // throw alert for wrong username password
    }
		
	};

  	
};



