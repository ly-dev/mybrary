'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('search', {
		url: "/search/:key",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/search',
    	controller: 'SearchResultController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }]
        }
    });
}])

.controller('SearchResultController', ['AppLog', 'AppHelper', 'AppApi', '$stateParams', '$scope', '$q', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $stateParams, $scope, $q, termListPromise) {
	    AppLog.debug("SearchResultController");
		
		$scope.terms = termListPromise;
	
		var refreshList = function() {
			AppHelper.showLoading();

			$q.all({
				'frdItems': AppApi.inventoryList({owner: 'frd', key: $stateParams.key}),
				'fofItems': AppApi.inventoryList({owner: 'fof', key: $stateParams.key})
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

