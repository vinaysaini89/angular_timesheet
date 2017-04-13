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



app.controller("logoutCtrl", ["$rootScope","$scope", "$filter","$http",'auth','$location', 'moment','ModalService','$compile',
    function($rootScope,$scope, $filter, $http, auth,$location, moment, ModalService, $compile){
       
        
    $rootScope.complent = "";
    $scope.pr = [];
    $scope.obj = {};
    $scope.obj.pro = 0;
    $scope.obj.time = 0;
    $scope.pr.push($scope.obj);
    
    var regular_hours = "09:00";
    var regular_minutes =  moment(new Date("1/1/1900 "+ regular_hours));
    var regular_minutes =  (regular_minutes.hour()*60) + regular_minutes.minute();



    $scope.logged_time_in = new Date($rootScope.authUser.logged_in_time);
    var logged_time_in = moment($scope.logged_time_in); // another date
    var now = moment(new Date());
    var duration = moment.duration(now.diff(logged_time_in));
    var hours = ('0' + duration._data.hours).slice(-2);
    var minutes = ('0' + duration._data.minutes).slice(-2);;

    $scope.totalHours = hours+":"+minutes;
    $scope.totalMinutes = moment(new Date("1/1/1900 "+ hours+":"+minutes));
    $scope.totalMinutes =  ($scope.totalMinutes.hour()*60) + $scope.totalMinutes.minute();
     
    $scope.pr[0].time = $scope.input_total = $scope.totalMinutes//$scope.totalHours;
    $http.get(apiBaseUrl+"/projects")
                .then(function(response){
                   if(response.data.code == 200)
                    {
                        $scope.projects = response.data.data;
                        
                    }
                    else
                    {
                        $scope.projects = response.data.data;
                        
                    }
                });


        $scope.inc = 1;
        $scope.addNewRow = function() {

            var obj = {"pro": 0,'time':''};
            //$scope.pr.splice($scope.inc, 0, obj);
            //$scope.pr.push(obj);
            //console.log($scope.pr);
            var html =  "<div class='row rrow'>";
                html += "<div class='col-md-3'>";
                html += "<select name='report["+$scope.inc+"][project]' ng-model='pr["+$scope.inc+"].pro' ng-options='(project.p_name + \" - \" +project.activity) | capitalize for (key,project) in projects | orderBy:\"p_name\" track by project.id' class='form-control'>";
                html += "<option value=''>--Select Project and activity--</option>";
                html += "</select>";
                html += "</div>";
                html += "<div class='col-md-3'>";
                html += "<input min='0' value='0' ng-blur='blurs($event, "+$scope.input_total+")' type='number' placeholder='Enter time(Minutes)' name='report["+$scope.inc+"][time]' class='form-control input_time'>";
                html += "</div>";
                //html += '<div class="col-md-3">';
                //html += '<button class="btn btn-danger" ng-click="removeRow($event,'+$scope.inc+')">-</button>';
                //html += '</div>';
                html += "</div>";
                
                html = $compile(html)($scope);
                var report_container = $("#report_content");
                report_container.append(html);

                $scope.inc++;
            
        }


        $scope.removeRow = function(element, inc) {
           
            element = angular.element(element.target);
            element.parent().parent().remove();
             //var index = $scope.pr.indexOf(inc);
            //$scope.pr.splice(inc, 1); 
            //console.log($scope.pr);
            $scope.inc--;

        }

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
                        var $form = $('#report_form');
                        var values = {};
                        var is = false;
                        var iss=false;
                        $.each($form.serializeArray(), function(i, field) {
                            
                                if(field.value == "")
                                { 
                                    is = true;
                                  if(!iss){  
                                    iss=true;
                                    str = field.name.replace('[', ".").replace('[', ".").replace(']', ".").replace(']', ".");
                                    alert(str.split('.')[3].charAt(0).toUpperCase()+str.split('.')[3].slice(1)+" is required in "+(parseInt(str.split('.')[1])+1)+" row");
                                    return;
                                   } 
                                }
                                else{       

                                    values[field.name] = field.value;
                                }
                        });

                    values['total_working_hours'] = $scope.totalHours;
                    values['login_time'] = $rootScope.authUser.logged_in_time;
                    if(is)
                    {
                        return;
                    }

                    //console.log(values);
                    var total_minutes = 0;
                    for (var i = 0; i < $scope.inc; i++) {
                       total_minutes = total_minutes + parseInt(values["report["+i+"][time]"]);
                    }
                    //alert(total_minutes);
                    
                    
                    if($scope.totalMinutes == total_minutes){

                        if($scope.totalMinutes < regular_minutes)
                        {  
                            
                            $rootScope.postData = values;
                            
                            ModalService.showModal({
                                  templateUrl: "tpl/report_modal.html",
                                  controller: "reportCtrl"
                                  }).then(function(modal) {
                                    modal.element.modal();
                                    
                                });
                        }
                        else
                        {
                           
                            $http({
                              method: 'POST',
                              url: apiBaseUrl+'create_report?emp_id='+auth.getUserId(),
                              data: $.param(values),
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

    
        var tt_m = 0;
         $scope.blurs = function blurs(ele, total_minutes){
            
            element = angular.element(ele.target);
            tt_m = (parseInt(tt_m) + parseInt(element.val()));
            console.log(total_minutes - tt_m);
            $(element).closest('.row').next().find('.input_time').val((total_minutes - tt_m));
                
            }




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

}]);



function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

