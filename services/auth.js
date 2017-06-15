app.service('auth',['$localStorage', '$sessionStorage', '$http',"$location",'$rootScope', 
  function($localStorage, $sessionStorag, $http, $location,$rootScope) {
    		this.apiBaseUrl = apiBaseUrl;

		//set user like session in local storage
		this.logIn = function(emp_id, pass, callback){
    $http
      .post(this.apiBaseUrl+'auth/postLogin?emp_id='+emp_id+'&password='+pass)
        		.then(function(response){
        			if(response.data.code == 200)
        			{
                $rootScope.login_message = "You are loggedIn successfully";
                $rootScope.authUser =  response.data.data;
        				$localStorage.user = response.data.data;
               //$localStorage.user.already_log = 0;
        				login = 1;
        			}
              else if(response.data.code == 400){
                $rootScope.login_message = "You are already loggedIn";
                $rootScope.authUser =  response.data.data;
                $localStorage.user = response.data.data;
                //$localStorage.user.already_log = 1;
        				login = 2;
        			}
              else
              {
                login = 3;
              }
          		
          		callback(login);
          		
        	});

        	

			
		};


		/**
    	* Check whether the user is logged in
    	* @returns boolean
    	*/
    	this.isLoggedIn = function isLoggedIn(){
        //console.log(this.getUser());
        return !isEmpty(this.getUser());
      	
    	};

		
		//get user data
		this.getUser = function(){
			return  $localStorage.user;
		}

    //get user data
    this.getUserId = function(){
      return  $localStorage.user.id;
    }

    //get user data
    this.getLogged_in_time = function(){
      return  $localStorage.user.logged_in_time;
    }

		/**
     	* Destroy localstorage
     	*/
    	this.logout = function destroy(emp_id = "", pass= "" ){

        if(emp_id=="")
        {
          emp_id = this.getUserId();
        }

        if(pass=="")
        {
          pass = $localStorage.user.password;
        }

      $http
      .post(this.apiBaseUrl+'auth/logout?emp_id='+emp_id+'&password='+pass)
            .then(function(response){
              if(response.data.code == 200)
              {
                $localStorage.user = {};
                $location.url('/login');
              }else if(response.data.code == 400)
              {
                $localStorage.user = {};
                alert("You are already logout");
                $location.url('/login');
                
              }
              else
              {
                 alert("Employee id and password does not match");
              }
          });

      		

      	};


        /**
      * Destroy localstorage
      */
      this.systemlogout = function destroy(){
        $localStorage.user = {};
        $location.url('/login');
        };

        this.checklogout = function(emp_id, pass, callback) {
           $http
            .get(apiBaseUrl+'auth/checklogout?emp_id='+emp_id+'&password='+pass)
                .then(function(response){
                    callback(response.data.code);
                  
                  
              });

        }



        this.ipCheck = function ipCheck()
        {
            var url = "http://freegeoip.net/json/";
            $http.get(url).then(function(response) {
              //console.log(response.data.ip);
              $rootScope.ip = response.data.ip;
              //alert(ip_list.indexOf($rootScope.ip));
              if(ip_list.indexOf($rootScope.ip) == "-1")
              {   //alert("df");
                  $location.url('/notfound');
              }
            });
        }

}]);