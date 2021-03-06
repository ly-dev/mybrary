'use strict';

angular.module('app_mybrary')
				
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('transaction-list', {
		url: "/transaction-list",
		templateUrl: Drupal.settings.angularjsApp.basePath + 'tpl/transaction-list',
    	controller: 'TransactionListController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
                return AppApi.getTerms();
            }]
        }
    })
    
    .state('transaction', {
		url: "/transaction/:transaction_id/:nid",
		templateUrl: Drupal.settings.angularjsApp.basePath + 'tpl/transaction',
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
		
		$scope.openTransaction = function (transaction) {
			$state.go('transaction', {transaction_id: transaction.transaction_id});
		};
		
		refreshList();
}])


.controller('TransactionResultController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$stateParams', '$scope', '$filter', 'termListPromise',
    function(AppLog, AppHelper, AppApi, $state, $stateParams, $scope, $filter, termListPromise) {
	    AppLog.debug("TransactionResultController");
		
		$scope.terms = termListPromise;
		$scope.noActionMessage = null;
		$scope.formTransactionData = {};
		
		var user = AppApi.getUser(),
			refreshTransaction = function() {
		    AppHelper.showLoading();

		    (function() {
		    	return AppApi.transactionView({transaction_id: $stateParams.transaction_id, entity_id: $stateParams.nid, uid_borrower: user.uid});
			})().then(function(result) {
				
				// redirectory if open transaction found
				if ($stateParams.transaction_id == 0 && result.transaction.transaction_id > 0) {
					$state.go('transaction', {transaction_id: result.transaction.transaction_id, nid: null});
					return;
				}
				
				// prepare item
				$scope.item = result.item;
				angular.forEach($scope.item.not_available, function (v, k) {
					if ($scope.item.notAvailableMessage == null) {
						$scope.item.notAvailableMessage = 'Not available: ';
					}
					
					$scope.item.notAvailableMessage += $filter('date')(v.start * 1000, 'dd/MM/yyyy') + ' - ' + $filter('date')(v.end * 1000, 'dd/MM/yyyy') + ' ';
				});
				
				// prepare transaction
				$scope.transaction = result.transaction;
				if (user.uid == $scope.transaction.uid_borrower) {
					$scope.userRole = 'borrower';
					$scope.owner = result.users[$scope.item.uid];
					$scope.borrower = result.users[user.uid];
					$scope.currentUser = $scope.borrower;
				} else {
					$scope.userRole = 'owner';
					$scope.owner = result.users[user.uid];
					$scope.borrower = result.users[$scope.transaction.uid_borrower];
					$scope.currentUser = $scope.owner;
				}
				
				// prepare items
				var detectClosedStatus = {
						owner: false,
						borrower: false
				};
				angular.forEach($scope.transaction.items, function(v, k) {
					var t = v.text;
					
					switch (parseInt(v.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:							
							v.text = '(' + $filter('date')(t.start * 1000, 'dd/MM/yyyy') + ' - ' + $filter('date')(t.end * 1000, 'dd/MM/yyyy') + ') ' + t.text;
							v['user'] = $scope.borrower;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CONFIRMED']:
							v.text = null;
							v['user'] = $scope.owner;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_DECLINED']:
							v.text = t.text;
							v['user'] = $scope.owner;
							detectClosedStatus['owner'] = true;
							detectClosedStatus['borrower'] = true;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED']:
							v.text = null;
							v['user'] = $scope.owner;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CANCELLED']:
							v.text = null;
							v['user'] = $scope.owner;
							detectClosedStatus['owner'] = true;
							detectClosedStatus['borrower'] = true;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED']:
							v.text = '[' + t.feedback_label + ']: ' + t.text;
							v['user'] = $scope.owner;
							detectClosedStatus['owner'] = true;
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED']:
							v.text = '[' + t.feedback_label + ']: ' + t.text;
							v['user'] = $scope.borrower;
							detectClosedStatus['borrower'] = true;
							break;
						default:
							// remove the invalid status for legacy
							delete $scope.transaction.items[k];
							break;
					}
				});
				
				// marked the transaction as closed
				if (detectClosedStatus['owner'] &&  detectClosedStatus['borrower']) {
					$scope.transaction.status = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CLOSED'];
					$scope.noActionMessage = 'The transaction is closed.';
				} else {
					$scope.noActionMessage = null;
				}
				
				// prepare form
				$scope.formTransactionData['start'] = $filter('date')(parseInt(result.transaction.start) * 1000, 'fullDate');
				$scope.formTransactionData['end'] = $filter('date')(parseInt(result.transaction.end) * 1000, 'fullDate');
				$scope.formTransactionData['text'] = '';
				$scope.formTransactionData['feedback'] =  AppHelper.CONST['MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN'];
				
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED']:
							$scope.noActionMessage = 'Wait for the feedback from borrower.';
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:							
							// show alert for existing open request found
							AppHelper.showAlert('You have an open request on current item. You may revise it.', 'success', false);
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CONFIRMED']:
							$scope.noActionMessage = 'Owner has confirmed. Please get and return the item on time.';
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED']:
							$scope.noActionMessage = 'Wait for the feedback from owner.';
							break;
					}
				}

				AppHelper.hideLoading();
			});
		};
		refreshTransaction();
		
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
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:
							visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text', 'form-transaction-submit-confirmed', 'form-transaction-submit-declined'];
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CONFIRMED']:
							visibleElements = ['form-transaction-text', 'form-transaction-submit-remind-return', 'form-transaction-submit-declined', 'form-transaction-submit-returned'];
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED']:
							visibleElements = ['form-transaction-feedback', 'form-transaction-text', 'form-transaction-submit-feedback'];
							break;
							
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
							visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text', 'form-transaction-submit-requested'];
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:
							visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text', 'form-transaction-submit-request-changed', 'form-transaction-submit-cancelled'];
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED']:
							visibleElements = ['form-transaction-feedback', 'form-transaction-text', 'form-transaction-submit-feedback'];
							break;
					}
				}
			}

			return (visibleElements.indexOf(elementId) >= 0);
		}
		
		$scope.validFormTransaction = function(submitType) {
			var result = true;
			
			if ($scope.showFormElement('form-transaction-start') && _.isEmpty($scope.formTransactionData['start'] )) {
				$scope.formTransactionErrors['start'] = "Please select start date.";
				result = false;
			} else {
				$scope.formTransactionErrors['start'] = null;
			}
			
			if ($scope.showFormElement('form-transaction-end') && _.isEmpty($scope.formTransactionData['end'] )) {
				$scope.formTransactionErrors['end'] = "Please select end date.";
				result = false;
			} else {
				$scope.formTransactionErrors['end'] = null;
			}

			// check availability before request or confirm
			if ($scope.transaction && ( $scope.transaction.status == AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']
					|| $scope.transaction.status == AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']
					|| $scope.transaction.status == AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED'])
				&& (submitType == 'requested' || submitType == 'request_changed' || submitType == 'confirmed')) {
				
				var tempStart = new Date($scope.formTransactionData['start']);
				tempStart = Math.round(tempStart.getTime() / 1000) ;
				
				var tempEnd = new Date($scope.formTransactionData['end']);
				tempEnd = Math.round(tempEnd.getTime() / 1000);
				
				angular.forEach($scope.item.not_available, function (v, k) {
					if ((tempStart <= v.end) && (tempEnd >= v.start)) {
						$scope.formTransactionErrors['start'] = "Not availabe in " + $filter('date')(v.start * 1000, 'dd/MM/yyyy') + ' - ' + $filter('date')(v.end * 1000, 'dd/MM/yyyy');
						result = false;
					}
				});			
			}

			if ($scope.showFormElement('form-transaction-text') && _.isEmpty($scope.formTransactionData['text'] )) {
				switch (submitType) {
					case 'declined':
						$scope.formTransactionErrors['text'] = "Please explain the reason to decline.";
						result = false;
						break;
					case 'requested':
					case 'request_changed':
					case 'feedback':
						$scope.formTransactionErrors['text'] = "Please make a decent explanation.";
						result = false;
						break;
					default:
						// not check for other instance
						break;
				}
			} else {
				$scope.formTransactionErrors['text'] = null;
			}

			if ($scope.showFormElement('form-transaction-feedback') && _.isEmpty($scope.formTransactionData['feedback'] )) {
				$scope.formTransactionErrors['feedback'] = "Please select a feedback.";
				result = false;
			} else {
				$scope.formTransactionErrors['feedback'] = null;
			}
			
			return result;
		};
		
		$scope.submitForm = function (submitType) {
			if ($scope.validFormTransaction(submitType)) {
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
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:							
							if (submitType == 'confirmed') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CONFIRMED'];
							} else if (submitType == 'declined') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_DECLINED'];
							}
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CONFIRMED']:
							if (submitType == 'declined') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_DECLINED'];
							} else if (submitType == 'returned') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED'];
							}
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED']:
							if (submitType == 'feedback') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED'];
								data['feedback_owner'] = parseInt($scope.formTransactionData['feedback']);
							}
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_UNKNOWN']:
							if (submitType == 'requested') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED'];
							}
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUESTED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED']:
							if (submitType == 'request_changed') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED'];
							} else if (submitType == 'cancelled') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_CANCELLED'];
							}
							break;
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_RETURNED']:
						case AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED']:
							if (submitType == 'feedback') {
								data['new_status'] = AppHelper.CONST['MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED'];
								data['feedback_borrower'] = parseInt($scope.formTransactionData['feedback']);
							}
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
		
		$scope.remindReturn = function (transaction) {
			AppApi.transactionRemindReturn({transaction_id: transaction['transaction_id']}).then(function(response) {
				AppHelper.showAlert(response.message, response.statue);
			});
		};
}]);

