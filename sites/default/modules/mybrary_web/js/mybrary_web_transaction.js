'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('transaction', {
		url: "/transaction/:transaction_id/:nid",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/transaction',
    	controller: 'TransactionResultController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
                return AppApi.getTerms();
            }]
        }
    });
}])

.controller('TransactionResultController', ['AppLog', 'AppHelper', 'AppApi', '$stateParams', '$scope', '$filter', 'termListPromise',
    function(AppLog, AppHelper, AppApi, $stateParams, $scope, $filter, termListPromise) {
	    AppLog.debug("TransactionResultController");
		
		$scope.terms = termListPromise;
		$scope.formTransactionData = {};
		
		var user = AppApi.getUser(),
			refreshTransaction = function() {
		    AppHelper.showLoading();

		    (function() {
		    	return AppApi.transactionView({transaction_id: $stateParams.transaction_id, entity_id: $stateParams.nid, uid_borrower: user.uid});
			})().then(function(result) {
				$scope.item = result.item;
				$scope.owner = result.owner;
				$scope.borrower = result.borrower;
				$scope.transaction = result.transaction;
				$scope.userRole = (user.uid == result.owner.uid ? 'owner' : 'borrower');
				
				$scope.formTransactionData['start'] = $filter('date')(parseInt(result.transaction.start) * 1000, 'fullDate');
				$scope.formTransactionData['end'] = $filter('date')(parseInt(result.transaction.end) * 1000, 'fullDate');

				switch (result.transaction.status) {
					case 0:
						$scope.formTransactionData['text'] = '';
						break;
				}
				
				// show alert for existing transaction found
				if (result.transaction.transaction_id > 0 && $stateParams.transaction_id == 0) {
					AppHelper.showAlert('Open transaction found on current item', 'success');					
				}

				AppHelper.hideLoading();
			});
		};
		
		$scope.validateBorrowPeriod = function(source) {
			var start = new Date($scope.formTransactionData['start']),
			    end = new Date($scope.formTransactionData['end']);
			
			if (end < start) {
				if (source == 'start') {
					$scope.formTransactionData['end'] = $scope.formTransactionData['start'];
				} else {
					$scope.formTransactionData['start'] = $scope.formTransactionData['end'];
				}
			}
		};
		
		refreshTransaction();
		
		$scope.requestToBorrow = function () {
		}
}]);

