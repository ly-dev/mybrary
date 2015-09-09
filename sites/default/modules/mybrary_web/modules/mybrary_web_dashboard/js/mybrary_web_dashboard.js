'use strict';

angular.module('app_dashboard', ['ui.router', 'app_log', 'app_helper',  'app_api'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /
	$urlRouterProvider.otherwise("/main");
	
	// Now set up the states
	$stateProvider
    .state('main', {
		url: "/main",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/dashboard/main',
    	controller: 'DashboardController',
    	resolve:{
            friendsPromise:  ['AppApi', function(AppApi) {
               return AppApi.connectionList();
            }]
        }
    });
}])

.controller('DashboardController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'friendsPromise', function(AppLog, AppHelper, AppApi, $scope, friendsPromise) {
    AppLog.debug("DashboardController");
    
	$scope.friends = friendsPromise;
}]);

