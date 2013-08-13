// declare a module
var myAppModule = angular.module('urlur', ['ngCookies']);

myAppModule.config(['$httpProvider', function($httpProvider){
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	delete $httpProvider.defaults.headers.common["content-type"];
	$httpProvider.defaults.useXDomain = true;
	// $httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.common["Access-Control-Allow-Credentials"] = true;

}]);

function postCtr($scope,$http, $cookieStore, $cookies){
	// $http.withCredentials = true;
	alert($cookies.text)
;	$scope.getData = function(){
		var me = this;
		$scope.cookieValue = $cookieStore.get('tab');
		alert($scope.cookieValue);
		$http({url:'http://localhost:5000/post?group_id=51f7e7128b330855713a0788',method:'GET', headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){
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

  	$scope.getData();
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