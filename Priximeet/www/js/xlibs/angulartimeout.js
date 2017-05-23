/**
 * @name ngx$httpTimeoutModule
 * @description Decorates AngularJS $http service to set timeout for each
 * Ajax request.
 *
 * Implementation notes: replace this with correct approach, once migrated to Angular 1.1.5+
 *
 * @author Manikanta G
 */
;(function () {
    'use strict';

    var ngx$httpTimeoutModule = angular.module('ngx$httpTimeoutModule', []);

    ngx$httpTimeoutModule.provider('ngx$httpTimeout', function () {
        var self = this;
        this.config = {
            timeout: 1000 // default - 1 sec, in millis
        };

        this.$get = function () {
            return {
                config: self.config
            };
        };
    });

    /**
     * AngularJS $http service decorator to add timeout
     */
    ngx$httpTimeoutModule.config(['$provide',  function($provide) {

        // configure $http provider to convert 'PUT', 'DELETE' methods to 'POST' requests
        $provide.decorator('$http', ['$delegate', 'ngx$httpTimeout', function($http, ngx$httpTimeout) {
            // create function which overrides $http function

            var _$http = $http;

            $http = function (config) {
                config.timeout = ngx$httpTimeout.config.timeout;
                return _$http(config);
            };
            $http.pendingRequests = _$http.pendingRequests;
            $http.defaults = _$http.defaults;

            // code copied from angular.js $HttpProvider function
            createShortMethods('get', 'delete', 'head', 'jsonp');
            createShortMethodsWithData('post', 'put');

            function createShortMethods(names) {
                angular.forEach(arguments, function(name) {
                    $http[name] = function(url, config) {
                        return $http(angular.extend(config || {}, {
                            method : name,
                            url : url
                        }));
                    };
                });
            }

            function createShortMethodsWithData(name) {
                angular.forEach(arguments, function(name) {
                    $http[name] = function(url, data, config) {
                        return $http(angular.extend(config || {}, {
                            method : name,
                            url : url,
                            data : data
                        }));
                    };
                });
            }

            return $http;
        }]);

    }]);

})();