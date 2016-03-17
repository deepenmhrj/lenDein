'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Housing = mongoose.model('Housing'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Housing
 */
exports.create = function(req, res) {
  var housing = new Housing(req.body);
  housing.user = req.user;

  housing.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(housing);
    }
  });
};

/**
 * Show the current Housing
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var housing = req.housing ? req.housing.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  housing.isCurrentUserOwner = req.user && housing.user && housing.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(housing);
};

/**
 * Update a Housing
 */
exports.update = function(req, res) {
  var housing = req.housing ;

  housing = _.extend(housing , req.body);

  housing.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(housing);
    }
  });
};

/**
 * Delete an Housing
 */
exports.delete = function(req, res) {
  var housing = req.housing ;

  housing.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(housing);
    }
  });
};

/**
 * List of Housings
 */
exports.list = function(req, res) { 
  Housing.find().sort('-created').populate('user', 'displayName').exec(function(err, housings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(housings);
    }
  });
};

/**
 * Housing middleware
 */
exports.housingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Housing is invalid'
    });
  }

  Housing.findById(id).populate('user', 'displayName').exec(function (err, housing) {
    if (err) {
      return next(err);
    } else if (!housing) {
      return res.status(404).send({
        message: 'No Housing with that identifier has been found'
      });
    }
    req.housing = housing;
    next();
  });
};
