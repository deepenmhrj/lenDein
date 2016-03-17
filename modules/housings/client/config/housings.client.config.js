(function () {
  'use strict';

  angular
    .module('housings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Housings',
      state: 'housings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'housings', {
      title: 'List Housings',
      state: 'housings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'housings', {
      title: 'Create Housing',
      state: 'housings.create',
      roles: ['user']
    });
  }
})();
