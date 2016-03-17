'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Community Schema
 */
var CommunitySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Community name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Community', CommunitySchema);
