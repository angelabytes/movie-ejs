const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      maxlength: 50
    },
    director: {
      type: String,
      required: [true, 'Please provide a name for the director'],
      maxlength: 50
    },
    year: {
      type: Number,
      required: true,
      validate: {
        validator: function (inputYear) {
          if (inputYear === null || inputYear === undefined) {
            return 'A year is needed.'
          }
          const earliestMovieYear = 1888
          const maxYear = new Date().getFullYear() + 5
          return inputYear >= earliestMovieYear && inputYear <= maxYear
        },
        message:
          'The year must between 1888 and at most 5 years from the current year for movies in production.'
      }
    },
    plot: {
      type: String,
      minlength: 10,
      maxlength: 500,
      required: [true, 'Please enter the plot']
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user']
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Movie', MovieSchema)
