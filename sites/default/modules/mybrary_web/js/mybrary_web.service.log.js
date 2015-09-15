'use strict';

angular.module('app_mybrary')

.factory('AppLog', ['$log',
    function ($log) {

        var service = {};

        service.shallowStringify = function (obj, depth, onlyProps, skipTypes) {
            if (typeof (depth) == 'undefined') {
                depth = 0;
            } else {
                depth++;
            }

            var objType = typeof (obj);

            if (['function', 'undefined'].indexOf(objType) >= 0) {
                return objType;
            } else if (['string', 'number', 'boolean'].indexOf(objType) >= 0) {
                return obj; // will toString
            }

            // objType == 'object'
            var res = '{';
            for (var p in obj) { // property in object
                if (typeof (onlyProps) !== 'undefined' && onlyProps) {
                    // Only show property names as values may show too much noise.
                    // After this you can trace more specific properties to debug
                    res += p + ', ';
                } else {
                    var valType = typeof (obj[p]);
                    if (typeof (skipTypes) == 'undefined') {
                        skipTypes = ['function'];
                    }
                    if (skipTypes.indexOf(valType) >= 0) {
                        res += p + ': ' + valType + ', ';
                    } else {
                        res += p + ': '

                        // max allow 7 levels
                        if (depth < 7) {
                            res += service.shallowStringify(obj[p], depth);
                        } else {
                            res += obj[p];
                        }
                        
                        res += ', ';
                    }
                }
            }
            res += '}';
            return res;
        };

        service.toMessage = function (obj) {
            var objType = typeof (obj),
                msg = '';

            if (['function', 'undefined'].indexOf(objType) >= 0) {
                msg = objType;
            } else if (['string', 'number', 'boolean'].indexOf(objType) >= 0) {
                msg = obj;
            } else {
                if (!angular.isArray(obj)) {
                    obj = [obj];
                }

                for (var i in obj) {
                    msg = msg + service.shallowStringify(obj[i]);
                }
            }

            return msg;
        };

        service.log = function (obj) {
            $log.log(service.toMessage(obj));
        };

        service.info = function (obj) {
            $log.info(service.toMessage(obj));
        };

        service.warn = function (obj) {
            $log.warn(service.toMessage(obj));
        };

        service.error = function (obj) {
            $log.error(service.toMessage(obj));
        };

        service.debug = function (obj) {
            $log.debug(service.toMessage(obj));
        };

        return service;
}]);