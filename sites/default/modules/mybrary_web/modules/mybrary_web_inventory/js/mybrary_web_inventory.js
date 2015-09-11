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
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }],
            inventoryListPromise:  ['AppApi', function(AppApi) {
               return AppApi.inventoryList();
            }]
        }
    });
}])

.controller('InventoryController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'termListPromise', 'inventoryListPromise', function(AppLog, AppHelper, AppApi, $scope, termListPromise, inventoryListPromise) {
    AppLog.debug("InventoryController");

    $scope.terms = termListPromise;
	$scope.items = inventoryListPromise;
	
	$scope.modalItem = {
			title: "my modal"
	}
}]);

