'use strict';

angular.module('app_mybrary')

.factory('AppHelper', [
    function () {

        var service = {};
        
        service.CONST = {
    		'MYBRARY_TRANSACTION_STATUS_UNKNOWN'   : 0,
    		'MYBRARY_TRANSACTION_STATUS_REQUESTED' : 1,
    		'MYBRARY_TRANSACTION_STATUS_CONFIRMED' : 2,
    		'MYBRARY_TRANSACTION_STATUS_DECLINED'  : 3,
    		'MYBRARY_TRANSACTION_STATUS_RECEIVED'  : 4,
    		'MYBRARY_TRANSACTION_STATUS_RETURNED'  : 5,
    		'MYBRARY_TRANSACTION_STATUS_CANCELLED' : 6,
    		'MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED' : 7,
    		'MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED' : 8,
    		'MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED' : 9,
    		'MYBRARY_TRANSACTION_STATUS_CLOSED' : 10,
    		'MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN' : 0,
    		'MYBRARY_TRANSACTION_FEEDBACK_NEGATIVE': 1,
    		'MYBRARY_TRANSACTION_FEEDBACK_NEUTRAL' : 2,
    		'MYBRARY_TRANSACTION_FEEDBACK_POSITIVE': 3
        };
        
        service.getTimestamp = function () {
            if (!Date.now) {
                Date.now = function () {
                    return new Date().getTime();
                }
            }
            return Date.now();
        };

        service.getTimestampLabel = function (t) {
            var d;
            if (t && typeof t == 'number') {
                d = new Date(t);
            } else {
                d = new Date();
            }

            return d.toLocaleString();
        };

        service.labelWithTimestamp = function (message) {
            return '[' + service.getTimestampLabel() + '] ' + message;
        };

        service.htmlToPlaintext = function (html) {
            return String(html).replace(/<[^>]+>/gm, '');
        };

        service.prepareErrorMessage = function (errors) {
            var message = '';

            angular.forEach(errors, function (value, key) {
            	if (value) {
            		message += service.htmlToPlaintext(value);
            	}
            });

            return message;
        };

        // type: success, info, warning, danger or error (= danger)
        service.showAlert = function (message, type, needEmpty, domId) {
        	
        	if (typeof type == 'undefined' || (type != 'success' && type != 'info' && type != 'warning' && type != 'danger')) {
        		if (type == 'error') {
        			type = 'danger';
        		} else {
        			type = 'info';        			
        		}
        	}
        	
        	if (typeof needEmpty == 'undefined' || needEmpty == null) {
        		needEmpty = true;
        	}
        	
        	if (typeof domId == 'undefined' || domId == null) {
        		domId = 'app-alert-container';
        	}
        	
        	var element = document.getElementById(domId);
        	
        	if (element) {
        		var html ='<div class="alert alert-' + type +' alert-dismissible" role="alert">'
        			+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        			+ message
        			+ '</div>',
        			$element = angular.element(element); 

        		
        		if (needEmpty) {
        			$element.empty();
        		}
        		
        		$element.append(html);
        	}
        };
        
        service.dismissAlert = function (domId) {
        	if (typeof domId == 'undefined' || domId == null) {
        		domId = 'app-alert-container';
        	}
        	
        	var element = document.getElementById(domId);
        	
        	if (element) {
        		angular.element(element).empty();
        	}
        };
        
        service.showLoading = function (message) {
        	if (typeof message == 'undefined' || message == null) {
        		message = 'Loading ...';
        	}

        	var element = document.getElementById('app-loading');
        	
        	if (element == null) {
        		angular.element(document.body).append('<div id="app-loading" class="app-loading-backdrop"><div class="app-loading-content"><span id="app-loading-message"></span></div></div>');
        		element = document.getElementById('app-loading');
        	}
        	
       		angular.element(document.getElementById('app-loading-message')).html(message);
        	
			angular.element(element).addClass('active');
        };
        
        service.hideLoading = function () {
        	var element = document.getElementById('app-loading');
        	
        	if (element) {
        		angular.element(element).removeClass('active');
        	}
        };
        
        return service;
}]);