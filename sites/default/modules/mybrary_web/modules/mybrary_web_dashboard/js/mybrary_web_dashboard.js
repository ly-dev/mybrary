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
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }]
        }
    });
}])

.controller('DashboardController', ['AppLog', 'AppHelper', 'AppApi', '$scope', '$q', 'termListPromise', function(AppLog, AppHelper, AppApi, $scope, $q, termListPromise) {
    AppLog.debug("DashboardController");
	AppHelper.showLoading();

	$scope.terms = termListPromise;
	var refreshList = function() {
		$q.all({
			'friends': AppApi.connectionList(),
			'items': AppApi.inventoryList()
		}).then(function (data) {
			
			$scope.friends = data['friends'];
			$scope.friendsMeta = {
				count: _.values($scope.friends).length
			};

			$scope.items = data['items'];
			$scope.itemsMeta = {
				count: _.values($scope.items).length
			};
			
			$scope.transactions = {};
			$scope.transactionsMeta = {
				count: _.values($scope.transactions).length
			};
			
			AppHelper.hideLoading();
		});
	}
	refreshList();
}]);

