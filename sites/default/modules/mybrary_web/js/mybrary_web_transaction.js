'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('transaction-list', {
		url: "/transaction-list",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/transaction-list',
    	controller: 'TransactionListController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
                return AppApi.getTerms();
            }]
        }
    })
    
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

.controller('TransactionListController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', '$q', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $state, $scope, $q, termListPromise) {
	
	    AppLog.debug("TransactionListController");
	
		$scope.terms = termListPromise;
		var refreshList = function() {
			AppHelper.showLoading();
			
			$q.all({
				'transactionCollection': AppApi.transactionList()
			}).then(function (data) {
				
				var user = AppApi.getUser();
				$scope.transactions = {
						'owner': {},
						'borrower': {}
				};
				
				// expand transaction with full data
				angular.forEach(data['transactionCollection']['transactions'], function(v, k) {
					v['item'] = data['transactionCollection']['items'][v['entity_id']];
					v['owner'] = data['transactionCollection']['users'][v['item']['uid']];
					v['borrower'] = data['transactionCollection']['users'][v['uid_borrower']];

					if (user.uid == v['uid_borrower']) {
						$scope.transactions['borrower'][k] = v;
					} else {
						$scope.transactions['owner'][k] = v;
					}
				});
			
				$scope.transactionsMeta = {
					countAsOwner: _.values($scope.transactions['owner']).length,
					countAsBorrower: _.values($scope.transactions['borrower']).length 
				};
				
				$scope.transactionsMeta['count'] = $scope.transactionsMeta['countAsOwner'] + $scope.transactionsMeta['countAsBorrower'];
				
				AppHelper.hideLoading();
			});
		}
		
		$scope.openTransaction = function (id) {
			$state.go('transaction', {transaction_id: id});
		};
		
		refreshList();
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
				$scope.transaction = result.transaction;
				if (user.uid == $scope.transaction.uid_borrower) {
					$scope.userRole = 'borrower';
					$scope.owner = result.users[$scope.item.uid];
					$scope.borrower = result.users[user.uid];
				} else {
					$scope.userRole = 'owner';
					$scope.owner = result.users[user.uid];
					$scope.borrower = result.users[$scope.transaction.uid_borrower];
				}
				
				// prepare form
				$scope.formTransactionData['start'] = $filter('date')(parseInt(result.transaction.start) * 1000, 'fullDate');
				$scope.formTransactionData['end'] = $filter('date')(parseInt(result.transaction.end) * 1000, 'fullDate');
				
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
							$scope.formTransactionData['text'] = ''
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							// show alert for existing open request found
							if ($scope.transaction.transaction_id > 0) {
								AppHelper.showAlert('You have an open request on current item. You may revise it.', 'success', false);
							}
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
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
		
		// Form processing
		$scope.formTransactionData = {};
		$scope.formTransactionErrors = {};
		
		$scope.showFormElement = function(elementId) {
			var visibleElements = [];
			
			if ($scope.transaction) { // do nothing before list refreshed
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text', 'form-transaction-submit-requested'];
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
				}
			}

			return (visibleElements.indexOf(elementId) >= 0);
		}
		
		$scope.validFormTransaction = function() {
			var result = true;
			
			if (_.isEmpty($scope.formTransactionData['start'] )) {
				$scope.formTransactionErrors['start'] = "Please select start date.";
				result = false;
			} else {
				$scope.formTransactionErrors['start'] = null;
			}
			
			if (_.isEmpty($scope.formTransactionData['end'] )) {
				$scope.formTransactionErrors['end'] = "Please select end date.";
				result = false;
			} else {
				$scope.formTransactionErrors['end'] = null;
			}

			if (_.isEmpty($scope.formTransactionData['text'] )) {
				$scope.formTransactionErrors['text'] = "Please enter a reason.";
				result = false;
			} else {
				$scope.formTransactionErrors['text'] = null;
			}

			// role and status based check
			if ($scope.userRole == 'owner') { // owner role
				switch (parseInt($scope.transaction.status)) {
					case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						break;
					default:
						AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
						break;
				}
			} else { // borrower role
				switch (parseInt($scope.transaction.status)) {
					case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
					case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						break;
					default:
						AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
						break;
				}
			}
			
			return result;
		};
		
		$scope.submitForm = function (submitType) {
			if ($scope.validFormTransaction()) {
				var data = angular.copy($scope.transaction);
				
				// fill form data
				var temp = new Date($scope.formTransactionData['start']);
				data['start'] = Math.round(temp.getTime() / 1000);
				
				temp = new Date($scope.formTransactionData['end']);
				data['end'] = Math.round(temp.getTime() / 1000);
				
				data['text'] = $scope.formTransactionData['text'];
				
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
							data['new_status'] = 1; // requested
							break;
						default:
							AppLog.error([$scope.userRole, "should not be here", $scope.transaction.status]);
							break;
					}
				}
				
				AppHelper.showLoading();
				AppApi.transactionUpdate(data).then(function(response) {
					AppHelper.showAlert(response.message, response.statue);
					
					refreshTransaction();
				});
			} else {
				AppHelper.showAlert(AppHelper.prepareErrorMessage($scope.formTransactionErrors));
			}
		};
		
		refreshTransaction();
}]);

