'use strict';

/**
 * Module dependencies
 */
var housingsPolicy = require('../policies/housings.server.policy'),
  housings = require('../controllers/housings.server.controller');

module.exports = function(app) {
  // Housings Routes
  app.route('/api/housings').all(housingsPolicy.isAllowed)
    .get(housings.list)
    .post(housings.create);

  app.route('/api/housings/:housingId').all(housingsPolicy.isAllowed)
    .get(housings.read)
    .put(housings.update)
    .delete(housings.delete);

  // Finish by binding the Housing middleware
  app.param('housingId', housings.housingByID);
};
