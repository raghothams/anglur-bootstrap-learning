// declare a module
var myAppModule = angular.module('urlur', ['ngCookies']);

myAppModule.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider){
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	delete $httpProvider.defaults.headers.common["content-type"];
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	//$httpProvider.defaults.headers.common["Access-Control-Allow-Credentials"] = true;

}]);

function postCtr($scope,$http, $cookieStore, $cookies){
	// $http.withCredentials = true;
	// $rootScope.$cookies = $cookies

	$scope.login = function(){
		
		var me = this;
		var loginData = "username="+this.emailVal+"&password="+this.pwdVal;
		console.log(loginData);
		var xsrf = $.param({"email": "dev@dev.com","password":"dev123"});
		$http({
			url : "http://localhost:5000/signin",
			method : "POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},

			data : xsrf
		}).success(function(data, status, header) {
		      // console.log(header('Set-Cookie'));
		      // console.log($cookies);
		      me.getData();
		    });
	};



	$scope.getData = function($cookies){
		var me = this;
		$scope.cookieValue = $cookieStore.get('session');
		
		
		$http({withCredentials: true, url:'http://localhost:5000/post?groupId=520dddba00b8b945e3e98305', headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){
			console.log(json);
			// check for errors

			if(json.error){
				var alert = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+json.data[0]+'</div>'
				$("#base-data-container").html(function(){
					$(this).prepend(alert);
				});
				
			}
		    
		    $scope.posts = json.data;
		});
	};

	$scope.search = function(){
		var me = this;
		var query = this.searchQuery;
		$http.get('http://localhost:5000/search?q='+query).success(function(json){

			$scope.posts = [json.data[1]];
		});
	};

  	$scope.login();
}


function groupCtr($scope,$http){
	
	$scope.getData = function(){
		var me = this;
		$http.get('http://localhost:5000/user/group').success(function(json){
			console.log(json.data);
		    
		    $scope.groups = json.data;
		});
	};

  	// $scope.getData();
}