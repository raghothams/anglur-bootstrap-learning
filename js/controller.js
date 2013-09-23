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

myAppModule.directive("removegroup", function(){
	return{
		restrict : 'E',
		templateUrl : 'remove-group-modal.html'
	};

});

myAppModule.directive("sharegroup", function(){
	return{
		restrict : 'E',
		templateUrl : 'share-group-modal.html'
	};

});

myAppModule.directive("joingroup", function(){
	return{
		restrict : 'E',
		templateUrl : 'join-group-modal.html'
	};

});

function postCtr($scope,$http, apiEndPoint){
	
	//  initialize models
	$scope.currentGroup;
  $scope.posts = [];
  $scope.posts = [];
  $scope.flags = {};
  $scope.joinGroup = {};

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
		        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
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
		$scope.flags.isAddUrlModal = true;
	};

	$scope.showAddGroupModal = function(){
		$('#addGroupProgress').hide();
		$scope.flags.isAddGroupModal = true;
	};

	$scope.showShareGroupModal = function(){
		$scope.flags.isShareGroupModal = true;
	};

	$scope.showJoinGroupModal = function(){
		$('#joinGroupProgress').hide();
		$scope.flags.isJoinGroupModal = true;
	};

	// method called when user searches for a post
	$scope.search = function(){
	
		var me = this;
		var query = this.searchQuery;
		query = encodeURIComponent(query);
	
		// fire http reqest to search user query for posts
    $.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"GET",
        url:apiEndPoint+'/search?q='+query,
        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
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
  		var newPostData = this.newPostData;
  		var payloadObj = {};
  		payloadObj.title = encodeURIComponent(newPostData.ipTitle);
  		payloadObj.link = newPostData.ipURL;
  		payloadObj.category = null;
  		payloadObj.groups = newPostData.ipGroup._id;

  		var tagsArray = newPostData.ipTags.split(",");
  		var correctedTags = [];
  		// check for tags starting with space
  		$.each(tagsArray, function(idx,tag){
  			while($scope.doesStartWithSpace(tag)){
  					tag = tag.slice(1,tag.length);
  			}
  			correctedTags.push(tag);
  		});

  		payloadObj.tags = correctedTags;

  		$('#addURLProgress').show();
  		$('#frmAddURL').hide();
  		$('#submitURL').toggleClass('disabled');
  		// fire http reqest to search user query for posts
	    $.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"POST",
	        url:apiEndPoint+'/post',
	        data:"data="+JSON.stringify(payloadObj),
	        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
	        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

						$scope.ipTitle = "";
						$scope.ipURL = "";
						$scope.ipGroup = "";
						$scope.ipTags = "";
						$scope.$apply();

						$('#submitURL').toggleClass('disabled');
						$('#addURLModal').modal('hide');
  					$('#frmAddURL').show(); 

  					$scope.flags.isAddUrlModal = false;
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
			statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
			headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

								$('#submitGroup').toggleClass('disabled');
								$('#addGroupModal').modal('hide');
		  					$('#frmAddGroup').show();  

		  					$scope.flags.isAddGroupModal = false;
								$scope.getGroupsData();    

					});

	};

	$scope.joinGroup = function(){
		
		var groupSharer = this.joinGroup.sharer;

		$('#joinGroupProgress').show();
  	$('#frmJoinGroup').hide();
  	$('#submitJoinGroup').toggleClass('disabled');
		
		$.ajax({crossDomain:true,xhrFields:{withCredentials:true},type:"POST",
			url:apiEndPoint+'/group/join/'+groupSharer,
			statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
			headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

							if(json.error){
								alert(json.data[0]);
							}
								$('#submitGroup').toggleClass('disabled');
								$('#joinGroupModal').modal('hide');
		  					$('#frmJoinGroup').show();  

		  					$scope.flags.isJoinGroupModal = false;
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
		$(evt.currentTarget).parent().addClass('active');

		// fire groupSelected event, which triggers getData() in postCtr
 		$scope.$emit('groupSelected');
		
	};

	$scope.onShareGroup = function(evt, group){
		
		$scope.flags.isShareGroupModal = true;

		$scope.sharedGroup = {};
		$scope.sharedGroup.hash = group.hash;
		$scope.sharedGroup.name = group.name;

	}

	$scope.onRemoveGroup = function(evt, group){
		$scope.flags.isRemoveGroupModal = true;
		
		$scope.removeGroupData = group;
	};

	$scope.getGroupsData = function(){
						// fire http request to get groups
						$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
		        url:apiEndPoint+'/user/group',
		        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
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

	$scope.getUserInfo = function(){
					$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"GET", 
		        url:apiEndPoint+'/user/info',
		        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
		        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

		        	// on success store data & trigger dataset change
		        	$scope.groups = json.data[0].groups;
		        	$scope.uname = json.data[0].name;
		        	$scope.$emit("groupDataLoaded", $scope.groups);
		        	
						});
	};

	$scope.removeGroup = function(){
					var groupId = this.removeGroupData._id;
					$.ajax({crossDomain:true,xhrFields:{withCredentials: true},type:"DELETE", 
		        url:apiEndPoint+'/group/'+groupId,
		        statusCode:{
			        	302: function(){
			        		window.location.replace("http://localhost:8000/index.html");
			        	}
			        },
		        headers:{'Access-Control-Allow-Credentials':true}}).success(function(json){

		        	// on success store data & trigger dataset change
		        	$scope.removeGroupData = {};
		        	$scope.flags.isRemoveGroupModal = false;
		        	
						});
	}

	// util method to check if a tag (string starts with a blank space)
	$scope.doesStartWithSpace = function(tag){
		if(tag[0] === " "){
			return true;
		} else{
			return false;
		}
	};

	// explicitly load group data on page load
	$scope.getUserInfo();

}
