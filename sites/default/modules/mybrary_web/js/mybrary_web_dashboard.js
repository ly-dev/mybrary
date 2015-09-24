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

.controller('DashboardController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', '$q', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $state, $scope, $q, termListPromise) {
	
	    AppLog.debug("DashboardController");
	
		$scope.terms = termListPromise;
		var refreshList = function() {
			AppHelper.showLoading();
			
			$q.all({
				'friends': AppApi.connectionList(),
				'items': AppApi.inventoryList(),
				'transactionCollection': AppApi.transactionList()
			}).then(function (data) {
				
				$scope.friends = _.values(data['friends']);
				$scope.friendsMeta = {
					count: $scope.friends.length
				};
	
				$scope.items = _.values(data['items']);
				$scope.itemsMeta = {
					count: $scope.items.length
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
		};
		refreshList();
		
		$scope.editInventory = function (item) {
			$state.go('inventory-edit', {nid: item.nid});
		};
		
		$scope.openTransaction = function (transaction) {
			$state.go('transaction', {transaction_id: transaction.transaction_id});
		};
}]);

