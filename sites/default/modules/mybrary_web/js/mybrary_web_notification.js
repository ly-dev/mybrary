'use strict';

angular.module('app_mybrary')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('notification-list', {
		url: "/notification-list",
		templateUrl: Drupal.settings.angularjsApp.basePath + 'tpl/notification-list',
    	controller: 'NotificationListController',
    });
}])

.controller('NotificationListController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', '$sce',
    function(AppLog, AppHelper, AppApi, $state, $scope, $sce) {
    AppLog.debug("NotificationListController");
    
    var statusFilter = [AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_NEW, AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_READ];
    var refreshList = function() {
		AppHelper.showLoading();

		AppApi.notificationList({status: statusFilter}).then(function(data) {
			$scope.users = data['users'];
			$scope.notifications = _.values(data['notifications']);
			$scope.notificationsMeta = {
				count: $scope.notifications.length
			};
			
			AppHelper.hideLoading();
		});
	}
	refreshList();
	
	$scope.toggleArchive = function() {
		var i = _.indexOf(statusFilter, AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_ARCHIVED);
		
		if (i > -1) {
			statusFilter.splice(i, 1);
		} else {
			statusFilter.push(AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_ARCHIVED);
		}
		
		refreshList();
    };
    
    $scope.isArchiveVisible = function () {
    	return (_.indexOf(statusFilter, AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_ARCHIVED) > -1);
    };
    
    $scope.archive = function (notification) {
		AppApi.notificationUpdate({nid: notification.nid, field_status: AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_ARCHIVED}).then(function(response) {
			if (response.status == 'success') {
				$scope.notifications = _.filter($scope.notifications, function(v) {return v.nid != notification.nid;});
				$scope.notificationsMeta = {
					count: $scope.notifications.length
				};
			} else {
				AppHelper.showAlert(response.message, response.status);
			}
		});
    };
    
    $scope.gotoUri = function (notification) {
    	AppApi.notificationUpdate({nid: notification.nid, field_status: AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_READ});
    	
    	if (notification.field_uri) {
    		var uri = JSON.parse(notification.field_uri);
    		$state.go(uri.state, uri.params)
    	}
    };    
}])

.controller('NotificationReminderController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$interval',
    function(AppLog, AppHelper, AppApi, $state, $interval) {
	    AppLog.debug("NotificationReminderController");
	    
	    var self = this;
	    
	    self.notifications = {};
	    var notificationInterval = $interval(function() {
	    	if (!$state.includes("notification-list")) {
		    	AppApi.notificationList({status: AppHelper.CONST.MYBRARY_NOTIFICATION_STATUS_NEW, range: {start: 0, length: 1}}).then(function(data) {
		    		self.users = data['users'];
		    		self.notifications = _.values(data['notifications']);
		    		angular.forEach(self.notifications, function(v) {
		    			v.body = AppHelper.htmlToPlaintext(v.body);
		    		});
		    		
		    	});
	    	} else {
	    		self.notifications = [];
	    	}
	    }, 30000);
	    
	    self.openNotificationList = function() {
	    	self.notifications = [];
	    	$state.go('notification-list');
	    };
}]);

