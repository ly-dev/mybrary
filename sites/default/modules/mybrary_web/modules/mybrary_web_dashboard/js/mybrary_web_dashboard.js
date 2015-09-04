'use strict';

angular.module('app_dashboard', ['ngRoute','app_api'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
    	templateUrl: Drupal.settings.angularjsApp.basePath + '/dashboard/main',
    	controller: 'DashboardController', 
    })
	.otherwise({redirectTo:'/'});
}])

.controller('DashboardController', ['AppApi', '$scope', function(AppApi, $scope) {
    $scope.myTitle = "DashboardController";
}]);

