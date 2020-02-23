const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
  type: String,
  date: Date,
  note: String
})

const athleteSchema = new mongoose.Schema({
  name: String,
  workouts: [workoutSchema]
})



athleteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.athleteId = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Athlete', athleteSchema)
  