const mongoose = require('mongoose')

const athleteSchema = new mongoose.Schema({
  name: String,
  workouts: Array
})

athleteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.athleteId = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Athlete', athleteSchema)
  