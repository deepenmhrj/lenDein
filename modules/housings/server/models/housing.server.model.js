'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Housing Schema
 */
var HousingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Housing name',
    trim: true
  },
  location:{ 
    type: String,
    default: '',
    trim: true,
    required :'Location cannot be blank'
  },
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Housing', HousingSchema);
