'use strict';

angular.module('app_connection', ['ui.router', 'app_log', 'app_helper',  'app_api'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /
	$urlRouterProvider.otherwise("/main");
	
	// Now set up the states
	$stateProvider
    .state('main', {
		url: "/main",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/connection/main',
    	controller: 'ConnectionController',
    	resolve:{
            friendsPromise:  ['AppApi', function(AppApi) {
               return AppApi.connectionList();
            }]
        }
    });
}])

.controller('ConnectionController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'friendsPromise', function(AppLog, AppHelper, AppApi, $scope, friendsPromise) {
    AppLog.debug("ConnectionController");

    
	$scope.friends = friendsPromise;
	
	$scope.postItForm = {
			message: 'Just updated my personal DIY tools inventory to share among friends.'
	};
	
	$scope.postIt = function() {
		if ($scope.postItForm && $scope.postItForm.message.length > 0) {
			var data = {
					channel: 'facebook',
					message: $scope.postItForm.message
			};
			AppApi.connectionInvite(data).then(function(response) {
				AppLog.debug(response);
			});
		} else {
			AppLog.debug('empty message');
		}
	}
}]);

