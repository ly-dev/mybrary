'use strict';

angular.module('app_inventory', ['ui.router', 'app_log', 'app_helper',  'app_api'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /
	$urlRouterProvider.otherwise("/main");
	
	// Now set up the states
	$stateProvider
    .state('main', {
		url: "/main",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/inventory/main',
    	controller: 'InventoryController',
    	resolve:{
            termsPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }],
            friendsPromise:  ['AppApi', function(AppApi) {
               return AppApi.connectionList();
            }]
        }
    });
}])

.controller('InventoryController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'termsPromise', 'friendsPromise', function(AppLog, AppHelper, AppApi, $scope, termsPromise, friendsPromise) {
    AppLog.debug("InventoryController");

    
	$scope.friends = friendsPromise;
}]);

