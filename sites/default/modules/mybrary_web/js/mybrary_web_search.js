'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('search', {
		url: "/search/:key",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/search',
    	controller: 'SearchController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }]
        }
    });
}])

.controller('SearchController', ['AppLog', 'AppHelper', 'AppApi', '$stateParams', '$scope', '$q', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $stateParams, $scope, $q, termListPromise) {
	    AppLog.debug("SearchController");
		
		$scope.terms = termListPromise;

		// search
		$scope.searchParams = {
			key: $stateParams.key	
		};
		
		$scope.goSearch = function() {
			refreshList();
		}
	
		var refreshList = function() {
			AppHelper.showLoading();

			$q.all({
				'frdItems': AppApi.inventoryList({owner: 'frd', key: $scope.searchParams.key}),
				'fofItems': AppApi.inventoryList({owner: 'fof', key: $scope.searchParams.key})
			}).then(function (data) {
				
				$scope.frdItems = data['frdItems'];
				$scope.frdItemsMeta = {
					count: _.values($scope.frdItems).length
				};
				
				$scope.fofItems = data['fofItems'];
				$scope.fofItemsMeta = {
					count: _.values($scope.fofItems).length
				};

				AppHelper.hideLoading();
			});
		}
		refreshList();
		
		
}]);

