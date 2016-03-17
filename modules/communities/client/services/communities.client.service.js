//Communities service used to communicate Communities REST endpoints
(function () {
  'use strict';

  angular
    .module('communities')
    .factory('CommunitiesService', CommunitiesService);

  CommunitiesService.$inject = ['$resource'];

  function CommunitiesService($resource) {
    return $resource('api/communities/:communityId', {
      communityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
