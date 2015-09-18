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
				
				// prepare form
				$scope.formTransactionData['start'] = $filter('date')(parseInt(result.transaction.start) * 1000, 'fullDate');
				$scope.formTransactionData['end'] = $filter('date')(parseInt(result.transaction.end) * 1000, 'fullDate');
				
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case 0: // status unknown
							break;
						case 1: // requested
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case 0: // status unknown
							break;
						case 1: // requested
							// show alert for existing transaction found
							if ($scope.transaction.transaction_id > 0) {
								AppHelper.showAlert('You have an open request on current item', 'success', false);
							}
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
		
		// Form
		$scope.formTransactionData = {};
		$scope.formTransactionErrors = {};
		
		$scope.showFormElement = function(elementId) {
			var visibleElements = [];
			
			// role and status based process
			if ($scope.userRole == 'owner') { // owner role
				switch (parseInt($scope.transaction.status)) {
					case 0: // status unknown
						break;
				}
			} else { // borrower role
				switch (parseInt($scope.transaction.status)) {
					case 0: // status unknown
						visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text'];
						break;
					case 1: // status unknown
						visibleElements = ['form-transactio-start', 'form-transactio-end', 'form-transaction-text'];
						break;
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
					case 0: // status unknown
						break;
				}
			} else { // borrower role
				switch (parseInt($scope.transaction.status)) {
					case 0: // status unknown
						break;
				}
			}
			
			return result;
		};
		
		$scope.submitForm = function (newStatus) {
			if ($scope.validFormTransaction()) {
				var data = angular.copy($scope.transaction);
				
				// fill form data
				var temp = new Date($scope.formTransactionData['start']);
				data['start'] = Math.round(temp.getTime() / 1000);
				
				temp = new Date($scope.formTransactionData['end']);
				data['end'] = Math.round(temp.getTime() / 1000);
				
				// role and status based process
				if ($scope.userRole == 'owner') { // owner role
					switch (parseInt($scope.transaction.status)) {
						case 0: // status unknown
							break;
					}
				} else { // borrower role
					switch (parseInt($scope.transaction.status)) {
						case 0: // status unknown
							data['new_status'] = 1; // requested
							break;
						case 1: // status unknown
							data['new_status'] = 1; // requested
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

