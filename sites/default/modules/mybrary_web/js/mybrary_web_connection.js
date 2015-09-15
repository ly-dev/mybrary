'use strict';

angular.module('app_mybrary')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('connection', {
		url: "/connection",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/connection',
    	controller: 'ConnectionController'
    });
}])

.controller('ConnectionController', ['AppLog', 'AppHelper', 'AppApi', '$scope', function(AppLog, AppHelper, AppApi, $scope) {
    AppLog.debug("ConnectionController");
    AppHelper.showLoading();
    
	var refreshList = function() {
		AppApi.connectionList().then(function(data) {
			$scope.friends = data;
			$scope.friendsMeta = {
				count: _.values($scope.friends).length
			};
			
			AppHelper.hideLoading();
		});
	}
	refreshList();
	
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

