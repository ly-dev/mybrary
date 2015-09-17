'use strict';

angular.module('app_mybrary', ['ui.router', 'ImageCropper', '720kb.datepicker'])

.config(['$logProvider', '$urlRouterProvider', '$httpProvider', 
    function ($logProvider, $urlRouterProvider, $httpProvider) {
        // disable debug log for production
        $logProvider.debugEnabled(true);

    	// For any unmatched url, redirect to /dashboard
    	$urlRouterProvider.otherwise("/dashboard");
    	
        $urlRouterProvider
        // http common header
    	$httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    	$httpProvider.defaults.headers.common['X-CSRF-Token'] = Drupal.settings.mybrary_web.csrf_token;
    	$httpProvider.defaults.headers.common['X-ANGULARJS'] = 1;
}])

.run(['AppLog', 'AppHelper', 'AppApi', '$rootScope', 
    function(AppLog, AppHelper, AppApi, $rootScope) {
	    AppLog.debug("App running");
	    
	    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
	    	AppHelper.dismissAlert();
		});
	    
	    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
	    	// collapse the dropdown menu
	    	jQuery('#navbar.collapse.in').removeClass('in').attr('aria-expanded', false);
		});
}])

.controller('SearchBarController', ['AppLog', 'AppHelper', 'AppApi', '$state', 
    function(AppLog, AppHelper, AppApi, $state) {
	    AppLog.debug("SearchBarController");
	    
	    this.searchParams = AppApi.searchParams;
		this.goSearch = function() {
			$state.go('search', AppApi.searchParams);
		};	    
}]);