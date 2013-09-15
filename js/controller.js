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

myAppModule.directive("addurl", function(){
	return{
		restrict : 'E',
		templateUrl : 'add-url-modal.html'
	};

});

myAppModule.directive("addgroup", function(){
	return{
		restrict : 'E',
		templateUrl : 'add-group-modal.html'
	};

});

function postCtr($scope,$http, apiEndPoint){
	
	$scope.currentGroup;
  $scope.posts = [];
  var obj = {'title':'fb dummy'};
  $scope.posts.push(obj);
  
  // method to fire http request & GET posts
	$scope.getData = function(){
		var me = this;
		//$scope.cookieValue = $cookieStore.get('session');
		
		// check if any group is selected
		if(typeof $scope.currentGroup !== "undefined"){
				var groupParam = "group_id="+$scope.currentGroup._id;
				console.log(groupParam);

				// HTTP request to get posts
				$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
		        url:apiEndPoint+'/post?'+groupParam, 
		        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

		        // save data & trigger dataset change 
					
						// check for errors
		        $scope.posts = json.data;
		        $scope.$apply();
		        //console.log($scope.posts);
				});
		}
		    
	};

	$scope.showAddURLModal = function(){
		$('#addURLProgress').hide();
		$scope.isAddUrlModal = true;
	};

	$scope.showAddGroupModal = function(){
		$('#addGroupProgress').hide();
		$scope.isAddGroupModal = true;
	};

	// method called when user searches for a post
	$scope.search = function(){
	
		var me = this;
		var query = this.searchQuery;
		query = encodeURIComponent(query);
	
		// fire http reqest to search user query for posts
    $.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"GET",
        url:apiEndPoint+'/search?q='+query,
        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

        	// save data & trigger dataset change
					$scope.posts = json.data;
		      $scope.$apply();
		});
	};

	// handler for groupSelected event - triggers getData()
	$scope.$on('groupSelected', function(event) { 
		 $scope.getData();
	});

  // method to get the url details from modal dialog & send it to the backend
  $scope.addUrl = function(){
  		// get the user inputs
  		// fire POST request

  		var payloadObj = {};
  		payloadObj.title = encodeURIComponent(this.ipTitle);
  		payloadObj.link = this.ipURL;
  		payloadObj.category = null;
  		payloadObj.groups = this.ipGroup._id;

  		var tagsArray = this.ipTags.split(",");
  		payloadObj.tags = tagsArray;

  		$('#addURLProgress').show();
  		$('#frmAddURL').hide();
  		$('#submitURL').toggleClass('disabled');
  		// fire http reqest to search user query for posts
	    $.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"POST",
	        url:apiEndPoint+'/post',
	        data:"data="+JSON.stringify(payloadObj),
	        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

						$scope.ipTitle = "";
						$scope.ipURL = "";
						$scope.ipGroup = "";
						$scope.ipTags = "";
						$scope.$apply();

						$('#submitURL').toggleClass('disabled');
						$('#addURLModal').modal('hide');
  					$('#frmAddURL').show(); 

  					$scope.isAddUrlModal = false;
  					$scope.getData();

			});

  };

  $scope.addGroup = function(){
		
		var groupName = this.newGroupName;
		var payloadObj = {};
		payloadObj.group_name = groupName;
		var payload = "data="+JSON.stringify(payloadObj);
		console.log(payload);

		$('#addGroupProgress').show();
  	$('#frmAddGroup').hide();
  	$('#submitGroup').toggleClass('disabled');
		
		$.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"POST",
			url:apiEndPoint+'/group',
			data:"data="+JSON.stringify(payloadObj),
			headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

								$('#submitGroup').toggleClass('disabled');
								$('#addGroupModal').modal('hide');
		  					$('#frmAddGroup').show();  

		  					$scope.isAddGroupModal = false;
								$scope.getGroupsData();    

					});

	};

  /*
	*	Methods to handle events & data related to groups
	*/
	
	// event handler for Group data loaded
	$scope.$on('groupDataLoaded', function(event, data){
		$scope.groups = data;
    $scope.$apply();
	});

	$scope.selectGroup = function(evt, group){

		// save the selected group in the factory - shared data
		$scope.currentGroup = group;
		console.log('selected - '+group._id);

		// change css class for selected group
		$('.group-item').removeClass('active');
		$(evt.currentTarget).addClass('active');

		// fire groupSelected event, which triggers getData() in postCtr
 		$scope.$emit('groupSelected');
		
	};

	$scope.getGroupsData = function(){
						// fire http request to get groups
						$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
		        url:apiEndPoint+'/user/group', 
		        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

		        	// on success store data & trigger dataset change
		        	$scope.groups = json.data;
		        	$scope.$emit("groupDataLoaded", $scope.groups);
						});
	};

	$scope.logout = function(){
						$.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"POST",
			        url:apiEndPoint+'/logout',
			        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
			        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

								alert('logout success');    

					});
	};

	// explicitly load group data on page load
	$scope.getGroupsData();

}

