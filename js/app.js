var app = angular.module('EmployeeTimesheet', ['ui.router', 'ngStorage', 'angularMoment','angularModalService']);
var apiBaseUrl = "http://employeetimesheet.com/";
//var apiBaseUrl = "http://ankur01.thirstt.com:81/timesheet_api/index.php/";
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
        auth.checklogout(auth.getUserId(), $rootScope.authUser.password, function(res) {
                if(res == 200)
                  {

                    alert("You are already logout");
                    auth.logout();
                    return;
                  }
                  else{
    if(!auth.getLogged_in_time())
    {
        $location.url('/');
    }      
    
    $rootScope.complent = "";
    $scope.pr = {
          "0": {"pro": 0,'time':''},
          "1": {'pro': 0,'time':''},
          "2": {'pro': 0,'time':''},
          "3": {'pro': 0,'time':''},
          "4": {'pro': 0,'time':''},
          
        };
    //$scope.pr = {};

    $scope.logged_time_in = new Date(auth.getLogged_in_time());
    var logged_time_in = moment($scope.logged_time_in); // another date
    var now = moment(new Date());
    var duration = moment.duration(now.diff(logged_time_in));
    var hours = ('0' + duration._data.hours).slice(-2);
    var minutes = ('0' + duration._data.minutes).slice(-2);;
    $scope.totalHours = hours+":"+minutes;
    $scope.totalMinutes = moment(new Date("1/1/1900 "+ hours+":"+minutes));
    $scope.totalMinutes =  ($scope.totalMinutes.hour()*60) + $scope.totalMinutes.minute();
     
    $scope.pr[0].time = $scope.totalMinutes;
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
                    auth.logout();
                    return;
                  }else{
            

            //var regexp = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
            if($scope.pr[0].pro == 0 || $scope.pr[0].pro== null)
            { 
                
                    alert("Please select a projects in "+(1)+ " row");
                    return;    
            
            }
            else if($scope.pr[0].time == "" ){
                    alert("Please enter time in "+(1)+ " row");
                    return;  
                }

            /*if($scope.pr[0].time != ""){
                var correct = ($scope.pr[0].time.search(regexp) >= 0) ? true : false;
                if(!correct)
                {
                    alert("Please enter the valid time in 1 row");
                    return;
                }

            }*/
            
            if($scope.pr[1].time != "")
            { 
                /*var correct = ($scope.pr[1].time.search(regexp) >= 0) ? true : false;
                if(!correct)
                {
                    alert("Please enter the valid time in 2 row");
                    return;
                }
                */

                if(typeof $scope.pr[1].pro !== 'object' || $scope.pr[1].pro == null)
                { 
                    
                        alert("Please select a projects in "+(2)+ " row");
                        return;    
                
                }

            }

            if($scope.pr[2].time != "")
            { 
               if(typeof $scope.pr[2].pro !== 'object' || $scope.pr[2].pro == null)
                { 
                    
                        alert("Please select a projects in "+(3)+ " row");
                        return;    
                
                }
            }


            if($scope.pr[3].time != "")
            { 
                
                if(typeof $scope.pr[3].pro !== 'object' || $scope.pr[3].pro == null)
                { 
                    
                        alert("Please select a projects in "+(4)+ " row");
                        return;    
                
                }

            }

            if($scope.pr[4].time != "")
            { 
               
                if(typeof $scope.pr[4].pro !== 'object' || $scope.pr[4].pro == null)
                { 
                    
                        alert("Please select a projects in "+(5)+ " row");
                        return;    
                
                }

            }
                    var total_minutes = 0;
                    for (var i = 0; i < 5; i++) {
                            if($scope.pr[i].time != "" )
                            {
                                total_minutes = parseInt(total_minutes) + parseInt($scope.pr[i].time);

                            }
                    }
                    //alert(total_minutes);
                    regular_minutes = 540;
                    if($scope.totalMinutes == total_minutes){

                        if($scope.totalMinutes < regular_minutes)
                        {  
                            //alert("popu")
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
                                "report_data":$scope.pr,
                                "login_time": $rootScope.authUser.logged_in_time
                            }
                          //  console.log($scope.postData);

                            // Simple GET request example:
                            $http({
                              method: 'POST',
                              url: apiBaseUrl+'create_report?emp_id='+auth.getUserId(),
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
                        if($scope.remain_minutes !=0){
                            alert("You have "+$scope.remain_minutes+" minutes remain");
                            return;
                        }else
                        {
                            alert("You have to enter exceeded time more then total_working_hours!");
                            return;
                        }
                    }
                    
                    

                }
                });      
                


            


     };

   
     
     $scope.blur = function (ind) { 
            
               
                    $scope.focus = true;
                    var input_time = 0;
                        for(var i = 0; i < 5; i++){
                             if($scope.pr[i].time != "" && $scope.pr[i].time != null )
                                    {
                                        
                                            input_time = parseInt(input_time) + parseInt($scope.pr[i].time);

                                    }
                            //input_time = parseInt(input_time) + parseInt($scope.pr[i].time);
                        }

                        console.log(input_time);

                       if($scope.pr[ind].time==0||$scope.pr[ind].time==null||$scope.pr[ind].time<0)
                       {
                        
                       $scope.pr[ind].time = ($scope.totalMinutes - input_time);

                   }
                   else
                   {
                    $scope.remain_minutes=($scope.totalMinutes - input_time);
                   }
                   
                   
       // $scope.pr[ind].time =  $scope.remain_minutes;
        
                
    };
    $scope.remain_minutes = 0;
    $scope.blur_time = function (ind) { 

                var input_time = 0;
                for(var i = 0; i < 5; i++){
                     if($scope.pr[i].time != "" && $scope.pr[i].time != null )
                            {
                                
                                    input_time = parseInt(input_time) + parseInt($scope.pr[i].time);

                            }
                    //input_time = parseInt(input_time) + parseInt($scope.pr[i].time);
                }
                if($scope.totalMinutes < input_time)
                {

                        var tt = 0;
                        for(var i = 0; i < 5; i++){
                             if($scope.pr[i].time != "" && $scope.pr[i].time != null )
                                    {
                                        if(ind != i){
                                            tt = parseInt(tt) + parseInt($scope.pr[i].time);
                                        }

                                    }
                            //input_time = parseInt(input_time) + parseInt($scope.pr[i].time);
                        }
                        console.log(tt);
                   alert("You have enter exceeded time from your total working hours.");
                       
                        $scope.pr[ind].time = 0;
                        $scope.remain_minutes = $scope.totalMinutes - tt;
                    
                }else{
                    $scope.remain_minutes = $scope.totalMinutes - input_time;
                }
                
               }
     }//checklogout END CONDITION 
}); //checklogout END FUNCTION 
}]);

app.controller("reportCtrl", ["$scope","$rootScope","$http",'auth','$location','$element', 'close',
    function($scope, $rootScope,$http, auth,$location, $element, close){
    
     $scope.logout = function(complent) {
            if(complent == "")
            {
                alert("Please nter the reason for leaving early");
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
                                //  Manually hide the modal using bootstrap.
                                //$element.modal('hide');
                                //close(null, 500);
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


app.controller("appCtrl", ["$localStorage","$scope","$rootScope","$http",'auth','$location', 
    function($localStorage, $scope, $rootScope,$http, auth,$location){
    if($rootScope.login_message == "" || $rootScope.login_message == undefined)
    {
        $rootScope.login_message = "You are loggedIn";
    }
    if(!auth.isLoggedIn()){
        $location.url('/login');
    }
   
   $scope.logout = function(){
    auth.systemlogout();
   }

   $rootScope.logged_in_time = 0;
   $scope.timein = function(){
           $http
            .get(apiBaseUrl+'auth/timestart?emp_id='+auth.getUserId())
            .then(function(response){
              if(response.data.code == 200)
              {
                    $localStorage.user.logged_in_time = response.data.data.logged_in_time;
                    //$localStorage.user.already_log = 1;//
                    //$rootScope.logged_in_time = response.data.data.logged_in_time;
                
              }
              else
                {
                    alert(response.data.message);
                }
              
          });
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
                console.log(auth.getUser());
                $location.url('/');
                //$location.url('/');
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

