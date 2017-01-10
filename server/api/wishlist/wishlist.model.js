'use strict';

// grab the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: String,
  public: {type: Boolean, default: true},
  items: []
});


var Wishlist = mongoose.model('Wishlist', wishlistSchema);


module.exports = Wishlist;
