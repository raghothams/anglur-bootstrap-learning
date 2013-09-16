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
    if(this.emailVal != undefined && this.pwdVal != undefined){
      
      var xsrf = $.param({"email": this.emailVal,"password":this.pwdVal});
      $.ajax({
        crossDomain:true,
        url : "http://localhost:5000/signin",
              type : "POST",
              data: xsrf,
               xhrFields: {
        withCredentials: true
        }
      }).success(function(data, status, header) {
            console.log(data);
            // check for statusCode. if success, redirect to home.html
            if(data.error == false){
              window.location.replace("http://localhost:8000/home.html");
            } else{
              // throw error
              $scope.authError = data.data;
              $('#alert-container').show();
            }
      });
    } else{
            // throw alert for wrong username password
            $scope.authError = "Check username / password";
            $('#alert-container').show();
    }
		
	};

  
   		
	$scope.register = function(){
		
		var me = this;
    if(this.rgName != undefined && this.rgEmail != undefined && this.rgPwd != undefined && this.rgRepeat != undefined){
      
      var xsrf = $.param({"email": this.rgEmail,"password":this.rgPwd,"verify":this.rgRepeat,"name":this.rgName});
      $.ajax({
        crossDomain:true,
        url : "http://localhost:5000/signup",
              type : "POST",
              data: xsrf,
               xhrFields: {
        withCredentials: true
        }
      }).success(function(data, status, header) {
            console.log(data);
            // check for statusCode. if success, redirect to home.html
            if(data.error == false){
              $scope.authResult = "Hurray! Registration successful";
              $('#alert-container').show();
            } else{
              // throw error
              $scope.authResult = "Error registering user";
              $('#alert-container').show();
            }
      });
    } else{
            // throw alert for wrong username password
            $scope.authError = "Check user info for registration";
            $('#alert-container').show();
    }
		
	};


  	
};



