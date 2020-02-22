const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
  type: String,
  date: Date,
  note: String
})

workoutSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.workoutId = returnedObject.__id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Workout', workoutSchema)