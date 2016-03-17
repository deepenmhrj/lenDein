(function () {
  'use strict';

  angular
    .module('communities')
    .controller('CommunitiesListController', CommunitiesListController);

  CommunitiesListController.$inject = ['CommunitiesService'];

  function CommunitiesListController(CommunitiesService) {
    var vm = this;

    vm.communities = CommunitiesService.query();
  }
})();
