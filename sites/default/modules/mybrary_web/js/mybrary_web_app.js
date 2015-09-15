'use strict';

angular.module('app_mybrary', ['ui.router', 'ImageCropper'])

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

.controller('SearchBarController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', 
    function(AppLog, AppHelper, AppApi, $state, $scope) {
	    AppLog.debug("SearchBarController");
	    
	    this.searchParams = AppApi.searchParams;
		this.goSearch = function() {
			AppLog.debug(AppApi.searchParams);
			$state.go('search', AppApi.searchParams);
		};	    
}]);