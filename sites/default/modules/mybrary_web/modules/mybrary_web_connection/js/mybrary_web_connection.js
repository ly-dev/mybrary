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
            connectionListPromise:  ['AppApi', function(AppApi) {
               return AppApi.connectionList();
            }]
        }
    });
}])

.controller('ConnectionController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'connectionListPromise', function(AppLog, AppHelper, AppApi, $scope, connectionListPromise) {
    AppLog.debug("ConnectionController");

    
	$scope.friends = connectionListPromise;
	
	$scope.postItForm = {
			message: 'Just updated my personal DIY tools inventory to share among friends.'
	};
	
	$scope.validPostItForm = function() {
		return 	($scope.postItForm && $scope.postItForm.message.length > 0);
	};
	
	$scope.postIt = function() {
		if ($scope.validPostItForm) {
			AppHelper.showLoading();
			
			var data = {
					channel: 'facebook',
					message: $scope.postItForm.message
			};
			
			AppApi.connectionInvite(data).then(function(response) {
				AppHelper.hideLoading();

				AppHelper.showAlert(response.message, response.status);
				jQuery('#modalInviteFriend button[data-dismiss=modal]').click();
			});
		}
	}
}]);

