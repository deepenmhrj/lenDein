(function () {
  'use strict';

  angular
    .module('housings')
    .controller('HousingsListController', HousingsListController);

  HousingsListController.$inject = ['HousingsService'];

  function HousingsListController(HousingsService) {
    var vm = this;

    vm.housings = HousingsService.query();
  }
})();
