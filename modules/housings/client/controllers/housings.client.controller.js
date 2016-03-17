(function () {
  'use strict';

  // Housings controller
  angular
    .module('housings')
    .controller('HousingsController', HousingsController);

  HousingsController.$inject = ['$scope', '$state', 'Authentication', 'housingResolve'];

  function HousingsController ($scope, $state, Authentication, housing) {
    var vm = this;

    vm.authentication = Authentication;
    vm.housing = housing;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Housing
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.housing.$remove($state.go('housings.list'));
      }
    }

    // Save Housing
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.housingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.housing._id) {
        vm.housing.$update(successCallback, errorCallback);
      } else {
        vm.housing.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('housings.view', {
          housingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
