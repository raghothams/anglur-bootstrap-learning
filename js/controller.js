// declare a module
var myAppModule = angular.module('urlur', ['ngCookies']);

myAppModule.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider){
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	delete $httpProvider.defaults.headers.common["content-type"];
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	//$httpProvider.defaults.headers.common["Access-Control-Allow-Credentials"] = true;

}]);

myAppModule.value('apiEndPoint', 'http://localhost:5000');

// Factory to share group data between postCtr & groupCtr
myAppModule.factory('GroupData', function(){
  return {
  	'all' : [],
  	'selected' : undefined
  };
});

function postCtr($scope,$http, GroupData, apiEndPoint){
	// $http.withCredentials = true;
	// $rootScope.$cookies = $cookies
  $scope.posts = [];
  var obj = {'title':'fb dummy'};
  $scope.posts.push(obj);

  // method to fire http request & GET posts
	$scope.getData = function(){
		var me = this;
		//$scope.cookieValue = $cookieStore.get('session');
		
		// check if any group is selected
		if(typeof GroupData.selected !== "undefined"){
				var groupComponent = "group_id="+GroupData.selected._id;
				console.log(groupComponent);

				// HTTP request to get posts
				$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
		        url:apiEndPoint+'/post?'+groupComponent, 
		        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

		        // save data & trigger dataset change 
					
						// check for errors
		        $scope.posts = json.data;
		        $scope.$apply();
		        //console.log($scope.posts);
				});
		}
		    
	};

	// method called when user searches for a post
	$scope.search = function(){
	
		var me = this;
		var query = this.searchQuery;
		query = encodeURIComponent(query);
	
		// fire http reqest to search user query for posts
    $.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"GET",
        url:'http://localhost:5000/search?q='+query,
        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

        	// save data & trigger dataset change
					$scope.posts = json.data;
		      $scope.$apply();
		});
	};

	// handler for groupSelected event - triggers getData()
	$scope.$on('groupSelected', function() { 
		$scope.getData();
	});

  	$scope.getData();
}


function groupCtr($scope,$http, GroupData){

	$scope.selectGroup = function(evt, group){

		// save the selected group in the factory - shared data
		GroupData.selected = group;
		console.log('selected - '+group._id);

		// change css class for selected group
		$('.group-item').removeClass('active');
		$(evt.currentTarget).addClass('active');

		// fire groupSelected event, which triggers getData() in postCtr
 		$scope.$emit('groupSelected');
		
	};
	
	$scope.getData = function(){
		var me = this;

		// fire http request to get groups
		$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
        url:'http://localhost:5000/user/group', 
        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

        	// on success store data & trigger dataset change
        	$scope.groups = json.data;
        	$scope.$apply();
		    	GroupData.all = json.data;

				});
	};

  	$scope.getData();
}
