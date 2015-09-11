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
            connectionListPromise:  ['AppApi', function(AppApi) {
               return AppApi.connectionList();
            }],
            termListPromise:  ['AppApi', function(AppApi) {
                return AppApi.termList();
             }],
             inventoryListPromise:  ['AppApi', function(AppApi) {
                return AppApi.inventoryList();
             }]
        }
    });
}])

.controller('DashboardController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'connectionListPromise', 'termListPromise', 'inventoryListPromise', function(AppLog, AppHelper, AppApi, $scope, connectionListPromise, termListPromise, inventoryListPromise) {
    AppLog.debug("DashboardController");
    
	$scope.friends = connectionListPromise;
    $scope.terms = termListPromise;
	$scope.items = inventoryListPromise;
}]);

