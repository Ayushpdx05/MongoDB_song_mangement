//songs.js file 
//schema for the songs file 
const mongoose = require('mongoose');

//consists of title artist genre popularity and releaseDate
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  popularity: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  releaseDate: {
    type: Date,
    required: true
  }
});

//song which is a schema model
const Song = mongoose.model('Song', songSchema);

module.exports = Song;
