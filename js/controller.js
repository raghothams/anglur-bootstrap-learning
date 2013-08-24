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
		$.ajax({
crossDomain:true,
url : "http://173.44.40.56:5000/signin",
			type : "POST",
      data: xsrf,
       xhrFields: {
withCredentials: true
}
		}).success(function(data, status, header) {
//		      console.log(header('Content-Type'));
  //        console.log(header('Set-Cookie'));
    debugger;
          console.log(header);
		      me.getData();
		    });
	};



	$scope.getData = function($cookies){
		var me = this;
		$scope.cookieValue = $cookieStore.get('session');
		
		
		$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
        url:'http://173.44.40.56:5000/post?group_id=520dddba00b8b945e3e98305', 
        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){
			console.log(json);
			// check for errors
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
