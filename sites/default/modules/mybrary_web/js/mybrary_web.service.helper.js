'use strict';

angular.module('app_helper', [])

.factory('AppHelper', [
    function () {

        var service = {};

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
                message += service.htmlToPlaintext(value);
            });

            return message;
        };

        return service;
}]);