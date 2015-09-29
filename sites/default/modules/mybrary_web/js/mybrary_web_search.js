'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('search', {
		url: "/search/:key",
		templateUrl: Drupal.settings.angularjsApp.basePath + 'tpl/search',
    	controller: 'SearchResultController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.getTerms();
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
		
		$scope.fofMessage = function(item) {
			AppHelper.showAlert('You can\'t borrow from friends of friends. You may <a href="#/connection-view/' + item.uid + '.">request to add friend</a>', 'warning');
		}
}])

.controller('SearchBarController', ['AppLog', 'AppHelper', 'AppApi', '$state', 
    function(AppLog, AppHelper, AppApi, $state) {
	    AppLog.debug("SearchBarController");
	    
	    this.searchParams = AppApi.searchParams;
		this.goSearch = function() {
			$state.go('search', AppApi.searchParams);
		};	    
}]);

