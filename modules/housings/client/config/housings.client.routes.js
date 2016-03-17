(function () {
  'use strict';

  angular
    .module('housings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('housings', {
        abstract: true,
        url: '/housings',
        template: '<ui-view/>'
      })
      .state('housings.list', {
        url: '',
        templateUrl: 'modules/housings/client/views/list-housings.client.view.html',
        controller: 'HousingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Housings List'
        }
      })
      .state('housings.create', {
        url: '/create',
        templateUrl: 'modules/housings/client/views/form-housing.client.view.html',
        controller: 'HousingsController',
        controllerAs: 'vm',
        resolve: {
          housingResolve: newHousing
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Housings Create'
        }
      })
      .state('housings.edit', {
        url: '/:housingId/edit',
        templateUrl: 'modules/housings/client/views/form-housing.client.view.html',
        controller: 'HousingsController',
        controllerAs: 'vm',
        resolve: {
          housingResolve: getHousing
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Housing {{ housingResolve.name }}'
        }
      })
      .state('housings.view', {
        url: '/:housingId',
        templateUrl: 'modules/housings/client/views/view-housing.client.view.html',
        controller: 'HousingsController',
        controllerAs: 'vm',
        resolve: {
          housingResolve: getHousing
        },
        data:{
          pageTitle: 'Housing {{ articleResolve.name }}'
        }
      });
  }

  getHousing.$inject = ['$stateParams', 'HousingsService'];

  function getHousing($stateParams, HousingsService) {
    return HousingsService.get({
      housingId: $stateParams.housingId
    }).$promise;
  }

  newHousing.$inject = ['HousingsService'];

  function newHousing(HousingsService) {
    return new HousingsService();
  }
})();
