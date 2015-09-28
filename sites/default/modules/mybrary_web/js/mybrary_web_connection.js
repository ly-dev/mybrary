'use strict';

angular.module('app_mybrary')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('connection-list', {
		url: "/connection-list",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/connection-list',
    	controller: 'ConnectionListController'
    })
    .state('connection-view', {
		url: "/connection-view/:uid",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/connection-view',
    	controller: 'ConnectionViewController'
    });
}])

.controller('ConnectionListController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', '$q',
    function(AppLog, AppHelper, AppApi, $state, $scope, $q) {
    AppLog.debug("ConnectionListController");
    
	var refreshList = function() {
	    AppHelper.showLoading();

	    $q.all({
			'frds': AppApi.connectionList(),
			'fofs': AppApi.connectionList({uid: 'frd'})
		}).then(function (data) {
			$scope.frds = _.values(data['frds']);
			$scope.frdsMeta = {
				count: $scope.frds.length
			};
			
			// fofs omit members in frds and self
			var user = AppApi.getUser();
			$scope.fofs = _.chain(data['fofs']).omit(_.keys(data['frds'])).omit(user.uid).values().value();
			$scope.fofsMeta = {
				count: $scope.fofs.length
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
	};
	
	$scope.viewConnection = function (frd) {
		$state.go('connection-view', {uid: frd.uid});
	};
}])

.controller('ConnectionViewController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$stateParams', '$scope', 
    function(AppLog, AppHelper, AppApi, $state, $stateParams, $scope) {
    AppLog.debug("ConnectionViewController");
    
	var refreshView = function() {
	    AppHelper.showLoading();

	    AppApi.connectionView({uid:$stateParams.uid, 'feedback_as_borrower_summary': true, 'feedback_as_borrower': true, 'feedback_as_owner_summary': true, 'feedback_as_owner': true}).then(function(user) {
			$scope.user = user;
			var feedback_default = {
				uid: user.uid, 
				negative: 0, 
				neutral: 0, 
				positive: 0, 
				negative_percent: 0, 
				neutral_percent: 0, 
				positive_percent: 0
			};
			
			if ($scope.user['feedback_as_borrower_summary']) {
				var tempSum = parseInt($scope.user['feedback_as_borrower_summary']['negative']) + parseInt($scope.user['feedback_as_borrower_summary']['neutral']) + parseInt($scope.user['feedback_as_borrower_summary']['positive']);
				$scope.user['feedback_as_borrower_summary']['negative_percent'] = Math.round(parseInt($scope.user['feedback_as_borrower_summary']['negative']) / tempSum * 100);
				$scope.user['feedback_as_borrower_summary']['neutral_percent'] = Math.round(parseInt($scope.user['feedback_as_borrower_summary']['neutral']) / tempSum * 100);
				$scope.user['feedback_as_borrower_summary']['positive_percent'] = Math.round(parseInt($scope.user['feedback_as_borrower_summary']['positive']) / tempSum * 100);
				
			} else {
				$scope.user['feedback_as_borrower_summary'] = feedback_default;
	    	}
			
			if ($scope.user['feedback_as_owner_summary']) {
				var tempSum = parseInt($scope.user['feedback_as_owner_summary']['negative']) + parseInt($scope.user['feedback_as_owner_summary']['neutral']) + parseInt($scope.user['feedback_as_owner_summary']['positive']);
				$scope.user['feedback_as_owner_summary']['negative_percent'] = Math.round(parseInt($scope.user['feedback_as_owner_summary']['negative']) / tempSum * 100);
				$scope.user['feedback_as_owner_summary']['neutral_percent'] = Math.round(parseInt($scope.user['feedback_as_owner_summary']['neutral']) / tempSum * 100);
				$scope.user['feedback_as_owner_summary']['positive_percent'] = Math.round(parseInt($scope.user['feedback_as_owner_summary']['positive']) / tempSum * 100);
			} else {
				$scope.user['feedback_as_owner_summary'] = feedback_default;
	    	}
			
			if ($scope.user['feedback_as_borrower']) {
				$scope.user['feedback_as_borrower'] = _.values($scope.user['feedback_as_borrower']);
			}
			
			if ($scope.user['feedback_as_owner']) {
				$scope.user['feedback_as_owner'] = _.values($scope.user['feedback_as_owner']);
			}

			AppHelper.hideLoading();
		});
	}
	refreshView();
	
	$scope.allowToAddFriend = function () {
		return ($scope.user && !$scope.user.isFriend && !_.isEmpty($scope.user.commonFriends));
	};

	$scope.requestToAddFriend = function(user) {
		AppHelper.showLoading();
		
		AppApi.connectionRequestToAdd({uid: user.uid}).then(function(response) {
			AppHelper.showAlert(response.message, response.status);
			
			refreshView();
		});
	};
	
	var responseToAddFriend = function (user, status) {
		AppHelper.showLoading();
		
		AppApi.connectionResponseToAdd({uid: user.uid, status: status}).then(function(response) {
			AppHelper.showAlert(response.message, response.status);
			
			refreshView();
		});
	};
	
	$scope.confirmToAddFriend = function (user) {
		responseToAddFriend(user, AppHelper.CONST.MYBRARY_USER_RELATIONSHIP_STATUS_CONFIRMED);
	};
	
	$scope.rejectToAddFriend = function (user) {
		responseToAddFriend(user, AppHelper.CONST.MYBRARY_USER_RELATIONSHIP_STATUS_REJECTED);
	};

}]);