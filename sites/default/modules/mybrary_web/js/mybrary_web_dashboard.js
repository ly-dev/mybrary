'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('dashboard', {
		url: "/dashboard",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/dashboard',
    	controller: 'DashboardController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.getTerms();
            }]
        }
    });
}])

.controller('DashboardController', ['AppLog', 'AppHelper', 'AppApi', '$scope', '$q', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $scope, $q, termListPromise) {
	
	    AppLog.debug("DashboardController");
	
		$scope.terms = termListPromise;
		var refreshList = function() {
			AppHelper.showLoading();
			
			$q.all({
				'friends': AppApi.connectionList(),
				'items': AppApi.inventoryList(),
				'transactionCollection': AppApi.transactionList()
			}).then(function (data) {
				
				$scope.friends = data['friends'];
				$scope.friendsMeta = {
					count: _.values($scope.friends).length
				};
	
				$scope.items = data['items'];
				$scope.itemsMeta = {
					count: _.values($scope.items).length
				};
				
				
				var user = AppApi.getUser();
				$scope.transactions = {
						'owner': [],
						'borrower': []
				};
				
				// expand transaction with full data
				angular.forEach(data['transactionCollection']['transactions'], function(v, k) {
					v['item'] = data['transactionCollection']['items'][v['entity_id']];
					v['owner'] = data['transactionCollection']['users'][v['item']['uid']];
					v['borrower'] = data['transactionCollection']['users'][v['uid_borrower']];

					if (user.uid == v['uid_borrower']) {
						$scope.transactions['borrower'].push(v);
					} else {
						$scope.transactions['owner'].push(v);
					}
				});
			
				$scope.transactionsMeta = {
					countAsOwner: $scope.transactions['owner'].length,
					countAsBorrower: $scope.transactions['borrower'].length 
				};
				
				$scope.transactionsMeta['count'] = $scope.transactionsMeta['countAsOwner'] + $scope.transactionsMeta['countAsBorrower'];
				
				AppHelper.hideLoading();
			});
		}
		refreshList();
}]);

