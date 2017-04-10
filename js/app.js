var app = angular.module('EmployeeTimesheet', ['ui.router', 'ngStorage', 'angularMoment','angularModalService']);
//var apiBaseUrl = "http://employeetimesheet.com/";
var apiBaseUrl = "http://ankur01.thirstt.com:81/timesheet_api/index.php/";
app.config(['$stateProvider','$urlRouterProvider','$locationProvider', '$httpProvider',
    function($stateProvider,$urlRouterProvider,$locationProvider, $httpProvider) {
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

    //$httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

    
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



app.controller("logoutCtrl", ["$rootScope","$scope", "$filter","$http",'auth','$location', 'moment','ModalService',
    function($rootScope,$scope, $filter, $http, auth,$location, moment, ModalService){
       
        
    $rootScope.complent = "";
    $scope.pr = {
          "0": {"pro": 0,'description':'','time':''},
          "1": {'pro': 0,'description':'','time':''},
          "2": {'pro': 0,'description':'','time':''}
          
        };
    //$scope.pr = {};

    $scope.logged_time_in = new Date($rootScope.authUser.logged_in_time);
    var logged_time_in = moment($scope.logged_time_in); // another date
    var now = moment(new Date());
    var duration = moment.duration(now.diff(logged_time_in));
    var hours = ('0' + duration._data.hours).slice(-2);
    var minutes = ('0' + duration._data.minutes).slice(-2);;
    $scope.totalHours = hours+":"+minutes;
    $scope.totalMinutes = moment(new Date("1/1/1900 "+ hours+":"+minutes));
    $scope.totalMinutes =  ($scope.totalMinutes.hour()*60) + $scope.totalMinutes.minute();
     
    //$scope.pr[0]['pro'] = 0;
    //$scope.pr[1]['pro'] = 0;
    //$scope.pr[2].project = 0;

    $scope.pr[0].time = $scope.totalHours;
    $http.get(apiBaseUrl+"/projects")
                .then(function(response){
                   if(response.data.code == 200)
                    {
                        console.log($scope.projects = response.data.data);
                        
                    }
                    else
                    {
                        $scope.projects = response.data.data;
                        
                    }
                });


        $scope.checklogout = function(emp_id, pass, callback) {
           $http
            .get(apiBaseUrl+'auth/checklogout?emp_id='+emp_id+'&password='+pass)
                .then(function(response){
                    callback(response.data.code);
                  
                  
              });

        }

        $scope.submit = function() {

            $scope.checklogout(auth.getUserId(), $rootScope.authUser.password, function(res) {
                if(res == 200)
                  {

                    alert("You are already logout");
                    return;
                  }else{
            

            var regexp = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
            if($scope.pr[0].pro == 0 || $scope.pr[0].pro== null)
            { 
                
                    alert("Please select a projects in "+(1)+ " row");
                    return;    
            
            }
            else if($scope.pr[0].description == "" ){
                    alert("Please enter description in "+(1)+ " row");
                    return;  
                }
            else if($scope.pr[0].time == "" ){
                    alert("Please enter time in "+(1)+ " row");
                    return;  
                }

            if($scope.pr[0].time != ""){
                var correct = ($scope.pr[0].time.search(regexp) >= 0) ? true : false;
                if(!correct)
                {
                    alert("Please enter the valid time in 1 row");
                    return;
                }

            }
            
            if($scope.pr[1].time != "")
            { 
                var correct = ($scope.pr[1].time.search(regexp) >= 0) ? true : false;
                if(!correct)
                {
                    alert("Please enter the valid time in 2 row");
                    return;
                }

                if(typeof $scope.pr[1].pro !== 'object' || $scope.pr[1].pro == null)
                { 
                    
                        alert("Please select a projects in "+(2)+ " row");
                        return;    
                
                }

                if($scope.pr[1].description == "")
                { 
                    
                        alert("Please enter description in "+(2)+ " row");
                        return;    
                
                }
                      
            
            }

            if($scope.pr[2].time != "")
            { 
                var correct = ($scope.pr[2].time.search(regexp) >= 0) ? true : false;
                if(!correct)
                {
                    alert("Please enter the valid time in 3 row");
                    return;
                }
                if(typeof $scope.pr[2].pro !== 'object' || $scope.pr[2].pro == null)
                { 
                    
                        alert("Please select a projects in "+(3)+ " row");
                        return;    
                
                }

                if($scope.pr[2].description == "")
                { 
                    
                        alert("Please enter description in "+(3)+ " row");
                        return;    
                
                }
                      
            
            }

                
                
                    var regular_hours = "09:00";
                    var regular_minutes =  moment(new Date("1/1/1900 "+ regular_hours));
                    var regular_minutes =  (regular_minutes.hour()*60) + regular_minutes.minute();

                    var t_times_1 =  moment(new Date("1/1/1900 "+ $scope.pr[0].time));
                    var t_times_2 =  moment(new Date("1/1/1900 "+ $scope.pr[1].time));
                    var t_times_3 =  moment(new Date("1/1/1900 "+ $scope.pr[2].time));
                    var t_min_1 =  (t_times_1.hour()*60) + t_times_1.minute();
                    var t_min_2 =  (t_times_2.hour()*60) + t_times_2.minute();
                    var t_min_3 =  (t_times_3.hour()*60) + t_times_3.minute();
                    var total_minutes = t_min_1 + t_min_2 +t_min_3;
                    if($scope.totalMinutes == total_minutes){

                        if($scope.totalMinutes < regular_minutes)
                        {  
                            
                            $rootScope.postData = {
                                "total_working_hours":$scope.totalHours,
                                "report_data":$scope.pr,
                                "login_time": $rootScope.authUser.logged_in_time
                            }
                            
                            ModalService.showModal({
                                  templateUrl: "tpl/report_modal.html",
                                  controller: "reportCtrl"
                                  }).then(function(modal) {
                                    modal.element.modal();
                                    
                                });
                        }
                        else
                        {
                            $scope.postData = {
                                "total_working_hours":$scope.totalHours,
                                "report_data":$scope.pr
                            }
                          //  console.log($scope.postData);

                            // Simple GET request example:
                            $http({
                              method: 'POST',
                              url: apiBaseUrl+'create_report?emp_id=1',
                              data: $.param($scope.postData),
                              headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
                              //  dataType: "json"

                            }).then(function successCallback(response) {
                                if(response.data.code == 200)
                                {
                                    auth.logout();
                                }
                                else
                                {
                                    alert(response.data.message);
                                }
                              }, function errorCallback(response) {
                                 console.log(response);
                              });

                              
                                
                        }

                    }
                    else
                    {
                        alert("You have enter exceeded or lower time from your total working hours.");
                        return;
                    }
                    
                    

                }
                });      

                
            


     };

    /* $scope.submit = function() {
        var total_times = "00:00";
        var total_minutes = 0;
        alert(Object.keys($scope.pr).length);
        for (var i=0;  (Object.keys($scope.pr).length); i++)
         {
            if($scope.pr[i].pro == 0 || $scope.pr[i].pro== null)
            { 
                if($scope.pr[i].time != "" ){
                    alert("Please select a projects in "+(i+1)+ " row");
                    return;    
                }
                

            }

            if($scope.pr[i].pro != 0  || $scope.pr[i].pro== null)
            { 
                if($scope.pr[i].time == "" ){
                    alert("Please enter time in "+(i+1)+ " row");
                    return;    
                }
                
                
            }

            if(typeof $scope.pr[i].pro === 'object')
            {   
                var regexp = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
                var correct = ($scope.pr[i].time.search(regexp) >= 0) ? true : false;
                if(correct)
                {
                    var t_times =  moment(new Date("1/1/1900 "+ $scope.pr[i].time));
                    var t_min =  (t_times.hour()*60) + t_times.minute();
                    total_minutes = total_minutes + t_min;
                    
                    

                    

                }
                else
                {
                    alert("Please enter the valid time");
                    return;
                }



            }

        }

                    if($scope.totalMinutes == total_minutes)
                    {
                        alert("sd");
                    }
                    else
                    {
                        alert("You have to enter hours more then total working hours");
                        return;
                    } 
        
    };*/

    $scope.chanheTime1 = function () { 
        
                    var input_time = moment(new Date("1/1/1900 "+ $scope.pr[0].time));
                    var total_time = moment(new Date("1/1/1900 "+ $scope.totalHours));
                    var duration = moment.duration(total_time.diff(input_time));
                    var hours = ('0' + duration._data.hours).slice(-2);
                    var minutes = ('0' + duration._data.minutes).slice(-2);
                    $scope.pr[1].time = hours+":"+minutes;
    };

    $scope.chanheTime2 = function () { 
        
                    var input_time1 =   moment(new Date("1/1/1900 "+ $scope.pr[0].time));
                    var i1min = (input_time1.hour()*60) + input_time1.minute();
                    //alert(i1min);
                    var input_time2 =   moment(new Date("1/1/1900 "+ $scope.pr[1].time));
                    //var i2min = (input_time2.hour()*60) + input_time2.minute();

                    var sum_of_time =   moment(input_time2).add((i1min), 'minutes');
                    //alert(sum_of_time);
                    var total_time = moment(new Date("1/1/1900 "+ $scope.totalHours));
                    var duration = moment.duration(total_time.diff(sum_of_time));
                    var hours = ('0' + duration._data.hours).slice(-2);
                    var minutes = ('0' + duration._data.minutes).slice(-2);
                    $scope.pr[2].time = hours+":"+minutes;
    };

}]);

app.controller("reportCtrl", ["$scope","$rootScope","$http",'auth','$location','$element','close',
    function($scope, $rootScope,$http, auth,$location, $element, close){
    
     $scope.logout = function(complent) {
            if(complent == "")
            {
                alert("Please enter the reason for leaving early");
                return;
            }
            $rootScope.postData.reason = complent;
                 $http({
                              method: 'POST',
                              url: apiBaseUrl+'reason?emp_id='+auth.getUserId(),
                              data: $.param($rootScope.postData),
                              headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
                              //  dataType: "json"

                            }).then(function successCallback(response) {
                                //console.log(response);
                                if(response.data.code == 200)
                                {
                                    //  Manually hide the modal using bootstrap.
                                    $element.modal('hide');
					close(null, 500);
                                    auth.logout();
                                    
                                }
                                else
                                {
                                    alert(response.data.message);
                                }
                              }, function errorCallback(response) {
                                 console.log(response);
                              });


            

     }
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

app.controller("loginCtrl", ["$localStorage","$rootScope","$scope","$http", '$location', 'auth',
    function($localStorage, $rootScope,$scope, $http, $location, auth){

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

    $scope.logout = function(){ //$localStorage.user = {};
        if(!$scope.emp_id){
            alert("Employee id is required");
            return;
        }

        if(!$scope.pass){
            alert("Password id is required");
            return;
        }
        

        $http
        .get(apiBaseUrl+'auth/checklogout?emp_id='+$scope.emp_id+'&password='+$scope.pass)
            .then(function(response){
              if(response.data.code == 200)
              {
                $localStorage.user = {};
                alert("You are already logout");
                //$location.url('/login');
              }
              else if(response.data.code == 400)
              {
                if(response.data.data.logged_in_time){
                    $localStorage.user = response.data.data;
                    $rootScope.authUser = response.data.data;
                    $location.url('/logout');
                }
                else
                {
                    alert("You have not loggedIn today!");
                }
                
              }
              else
              {
                 alert("Employee id and password does not match");
              }
          });
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

