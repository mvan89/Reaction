var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  content: String,
  type: String,
  location_Lat: String,
  location_Lon: String,
  imageUrl: String,
  created_at: { type: Date, default: Date.now }
})
mongoose.model('Post', postSchema);
