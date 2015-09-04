'use strict';

angular.module('app_api', ['ngResource'])

.factory('AppApi', ['$resource',
    function ($resource) {
	
	var service = {};
	
	service.test = function() {
		return {msg: 'Hello world!'};
	};
	
	return service;
}])

.config(["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = Drupal.settings.angularjsApp.restws_csrf_token;
	$httpProvider.defaults.headers.common['X-ANGULARJS'] = 1;
}]);
