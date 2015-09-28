'use strict';

angular.module('app_mybrary')

.factory('AppApi', ['AppLog', 'AppHelper', '$q', '$http',
    function (AppLog, AppHelper, $q, $http) {
	
	var serviceUrlBase = Drupal.settings.mybrary_web.service_base_url + '/api/v1',
		cachedTerms = null,
		cachedUser = Drupal.settings.mybrary_web.user,
		cancelRestApiQs = {},
		service = {};
	
	
	service.callRestApi = function (method, uri, data) {
        if (data == null) {
            data = {};
        }

        var cancelKey = AppHelper.getTimestamp(),
            cancelQ = $q.defer(),
            config = {
            'method': method,
            'url': serviceUrlBase + uri,
            'data': data,
            timeout: cancelQ.promise // set timeout promise
        };

        // store cancel q for external use
        cancelRestApiQs[cancelKey] = cancelQ;
        AppLog.debug(['Calling backend: ', config]);

        var q = $q.defer();

        $http(config).then(function (response) {
            AppLog.debug(['Call backend success: ', response]);
            q.resolve(response);
            delete cancelRestApiQs[cancelKey];
        }, function (response) {
            AppLog.debug(['Call backend error: ', response]);
            q.reject(response);
            delete cancelRestApiQs[cancelKey];
        });

        return q.promise;
    };
    
    service.cancelAllCallRestApi = function() {
        angular.forEach(cancelRestApiQs, function(q, k) {
            cancelRestApiQs[k].resolve('cancel rest api call');
            delete cancelRestApiQs[k];
        });
    };
	
	service.connectionInvite = function(data) {
        return service.callRestApi('POST', '/connection/invite', data).then(function(response) {
        	return response.data;
        });
	};

	service.connectionRequestToAdd = function(data) {
        return service.callRestApi('POST', '/connection/request-to-add', data).then(function(response) {
        	return response.data;
        });
	};

	service.connectionResponseToAdd = function(data) {
        return service.callRestApi('POST', '/connection/response-to-add', data).then(function(response) {
        	return response.data;
        });
	};

	service.connectionList = function(data) {
        return service.callRestApi('POST', '/connection/list', data).then(function(response) {
        	return response.data;
        });
	};

	service.connectionView = function(data) {
        return service.callRestApi('POST', '/connection/view', data).then(function(response) {
        	return response.data;
        });
	};
	
	service.termList = function(data) {
        return service.callRestApi('POST', '/term/list', data).then(function(response) {
        	return response.data;
        });
	};
	
	service.inventoryList = function(data) {
        return service.callRestApi('POST', '/inventory/list', data).then(function(response) {
        	return response.data;
        });
	};

	service.inventoryView = function(data) {
        return service.callRestApi('POST', '/inventory/view', data).then(function(response) {
        	return response.data;
        });
	};

	service.inventoryUpdate = function(data) {
        return service.callRestApi('POST', '/inventory/update', data).then(function(response) {
        	return response.data;
        });
	};

	service.transactionList = function(data) {
        return service.callRestApi('POST', '/transaction/list', data).then(function(response) {
        	return response.data;
        });
	};

	service.transactionView = function(data) {
        return service.callRestApi('POST', '/transaction/view', data).then(function(response) {
        	return response.data;
        });
	};

	service.transactionUpdate = function(data) {
        return service.callRestApi('POST', '/transaction/update', data).then(function(response) {
        	return response.data;
        });
	};

	service.searchParams = {
	    key: ''
	};
	
	service.getTerms = function() {
		var q =$q.defer();
		
		if (cachedTerms == null) {
			service.termList().then(function(result) {
				cachedTerms = result;
				q.resolve(cachedTerms);
			});
		} else {
			q.resolve(cachedTerms);			
		};
		
		return q.promise;
	};
	
	service.prepareTermOptionsByType = function(allTerms, type) {
		return _.chain(allTerms).values().filter(function (o) {
			return o.type == type;
		}).value();
	};

	service.getUser = function() {
		return cachedUser;
	};
	
	return service;
}]);
