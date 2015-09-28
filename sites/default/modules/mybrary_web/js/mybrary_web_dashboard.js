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
				'frds': AppApi.connectionList(),
				'fofs': AppApi.connectionList({uid: 'frd'}),
				'items': AppApi.inventoryList(),
				'transactionCollection': AppApi.transactionList()
			}).then(function (data) {
				
				$scope.frds = _.values(data['frds']);
				$scope.frdsMeta = {
					count: $scope.frds.length
				};
	
				var user = AppApi.getUser();
				AppLog.debug(user);
				$scope.fofs = _.chain(data['fofs']).omit(_.keys(data['frds'])).omit(user.uid).values().value();
				$scope.fofsMeta = {
					count: $scope.fofs.length
				};

				$scope.items = _.values(data['items']);
				$scope.itemsMeta = {
					count: $scope.items.length
				};
				
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
		
		$scope.viewConnection = function (user) {
			$state.go('connection-view', {uid: user.uid});
		};

		$scope.editInventory = function (item) {
			$state.go('inventory-edit', {nid: item.nid});
		};
		
		$scope.openTransaction = function (transaction) {
			$state.go('transaction', {transaction_id: transaction.transaction_id});
		};
}]);

