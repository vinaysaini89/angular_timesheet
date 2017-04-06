var app = angular.module('EmployeeTimesheet', ['ui.router', 'ngStorage']);
var apiBaseUrl = "http://employeetimesheet.com/";
app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
    function($stateProvider,$urlRouterProvider,$locationProvider) {
    $stateProvider
    .state("/", {
        url:'/',
        views: {
            "header@": {
                templateUrl : "tpl/common/header.html",
            },
            "sidebar@": {
                templateUrl : "tpl/common/sidebar.html"
                },
            "content@": {
                templateUrl : "tpl/welcome.html",
                controller:  "appCtrl"
            }
        }
        
    })
    .state("timesheet", {
        url:'/timesheet',
        
        views: {
            "header@": {
                templateUrl : "tpl/common/header.html",
            },
            "sidebar@": {
                templateUrl : "tpl/common/sidebar.html"
                },
            "content@": {
                templateUrl : "tpl/main.html",
                controller:  "timesheetCtrl"
            }
        }
       
    })
    .state('login',{
        url: '/login',
        views: {
            "header@": {
                template : "",
            },
            "sidebar@": {
                template : ""
                },
            "content@": {
                templateUrl: 'tpl/login.html',
                controller:  "loginCtrl"
    
                }
        }

        })
    .state('logout',{
        url: '/logout',
        views: {
            "header@": {
                templateUrl : "tpl/common/header.html",
            },
            "sidebar@": {
                templateUrl : "tpl/common/sidebar.html"
                },
            "content@": {
                templateUrl : "tpl/logout.html",
                controller:  "logoutCtrl"
            }
        }

        })
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');

    
}]);

app.run(["$rootScope", "$location",'auth', function ($rootScope, $location, auth) {
        
        $rootScope.location = $location.url();

        if(auth.isLoggedIn()){
            $rootScope.authUser =  auth.getUser();
            return;
        }

        // Redirect to third party login page
        $location.url('/login');

        // Make sure bootstrap process is stopped
       // throw new Error('Access denied');

}] );



app.controller("logoutCtrl", ["$rootScope","$scope","$http",'auth','$location', function($rootScope,$scope, $http, auth,$location){

    $scope.logged_time_in = new Date($rootScope.authUser.logged_in_time);


}]);


app.controller("appCtrl", ["$scope","$rootScope","$http",'auth','$location', 
    function($scope, $rootScope,$http, auth,$location){
    if($rootScope.login_message == "" || $rootScope.login_message == undefined)
    {
        $rootScope.login_message = "You are loggedIn";
    }
    if(!auth.isLoggedIn()){
        $location.url('/login');
    }
   $scope.logout = function(){
    auth.logout();
   }


}]);

app.controller("loginCtrl", ["$rootScope","$scope","$http", '$location', 'auth', function($rootScope,$scope, $http, $location, auth){

       // if(auth.isLoggedIn()){ 
            // Redirect to third party login page
         //   $location.url('/');
        //}

    $scope.login = function(){
        if(!$scope.emp_id){
            alert("Employee id is required");
            return;
        }

        if(!$scope.pass){
            alert("Password id is required");
            return;
        }

        auth.logIn($scope.emp_id,$scope.pass, function(res){
            if(res ==1 || res == 2)
            {
                //console.log(auth.getUser());
                $location.url('/');
            }
            else
            {
                alert("Employee id and password does not match");
                return;   
            }

        })
        

    }

    $scope.logout = function(){ 
        if(!$scope.emp_id){
            alert("Employee id is required");
            return;
        }

        if(!$scope.pass){
            alert("Password id is required");
            return;
        }

        auth.logout($scope.emp_id, $scope.pass);
   }

}]);


app.controller("timesheetCtrl", ["$scope", "$rootScope", "$http", '$location', 'auth','$filter' ,
    function($scope, $rootScope, $http, $location, auth, $filter){

        if(!auth.isLoggedIn()){ 
            // Redirect to third party login page
            $location.url('/');
        }

    $scope.currentMonthYear = $filter('date')(new Date(), "MMMM-yyyy");
    $http
      .get(apiBaseUrl+"?emp_id="+$rootScope.authUser.id)
                .then(function(response){
                   if(response.data.code == 200)
                    {
                        $scope.timesheetdata = response.data.data.timesheet;
                        $scope.user_project =  response.data.data.user_project;
                       
                    }else
                    {
                        $scope.timesheetdata = response.data.data.timesheet;
                        $scope.user_project =  response.data.data.user_project;
                    }
                });
        

}]);


app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.split(' ').map(function(wrd){return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();}).join(' ') : '';
    }
});

app.filter('dateTimestamp',['$filter', function($filter) {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(date, format) {
    if(date != "0000-00-00 00:00:00"){
        if(date == "00:00:00")
        {
            if(format == "H:mm")
            {
                return "00:00";
            }
            else
            {
                return date;
            }

        }
        else if(date == "09:00:00")
        {

            if(format == "H:mm")
            {
                return "09:00";
            }
            else
            {
                return date;
            }   

                     
        }
        else
        {
            return $filter('date')(new Date(date), format);
        }

        
    }
    else
    {
        if(format == "H:mm"){
            return "00:00";
        }
        else if(format == "H:mm:ss")
        {
            return "00:00:00";   
        }
        else
        {
            return date;
        }
    }

  }

}]);

app.filter('totalHours',['$filter', function($filter) {
    return function(input, startTime, endTime) {
            if(input == "00:00"){
                if(endTime == "00:00"){
                    endTime = $filter('date')(new Date(), "H:mm");
                }
                else
                {
                    endTime = endTime;   
                }

               

                if (startTime && endTime) {
                  var s_hr = startTime.split(":")[0];
                  var s_min = startTime.split(":")[1];
                  var e_hr = endTime.split(":")[0];
                  var e_min = endTime.split(":")[1];

                  var th = (parseInt(e_hr) - parseInt(s_hr));
                  var tm = (parseInt(e_min) - parseInt(s_min));
                  tm = parseInt(tm.replace('-',''));
                  return (('0' + th).slice(-2) +":"+ ('0' + tm).slice(-2));
                }
            }else
            {
                return input;
            }
        
    }

}])



function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

