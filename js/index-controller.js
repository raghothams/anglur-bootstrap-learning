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
		
		
		var loginData = "username="+this.emailVal+"&password="+this.pwdVal;
		console.log(loginData);
		var xsrf = $.param({"username": "tester@test.com","password":"test123"});
		$http({
			url : "http://localhost:5000/signin",
			method : "POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},

			data : xsrf
		}).success(function(json){
			alert(json.error);
			console.log(json);
		});
	};

  	
};



