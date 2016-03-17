(function () {
  'use strict';

  // Communities controller
  angular
    .module('communities')
    .controller('CommunitiesController', CommunitiesController);

  CommunitiesController.$inject = ['$scope', '$state', 'Authentication', 'communityResolve'];

  function CommunitiesController ($scope, $state, Authentication, community) {
    var vm = this;

    vm.authentication = Authentication;
    vm.community = community;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Community
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.community.$remove($state.go('communities.list'));
      }
    }

    // Save Community
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.communityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.community._id) {
        vm.community.$update(successCallback, errorCallback);
      } else {
        vm.community.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('communities.view', {
          communityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
