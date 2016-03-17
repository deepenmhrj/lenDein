//Housings service used to communicate Housings REST endpoints
(function () {
  'use strict';

  angular
    .module('housings')
    .factory('HousingsService', HousingsService);

  HousingsService.$inject = ['$resource'];

  function HousingsService($resource) {
    return $resource('api/housings/:housingId', {
      housingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
