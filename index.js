require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Athlete = require('./models/athlete')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('reqData', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[header] :reqData'))

app.get('/', (req, res) => {
  Athlete.find({}).then(athletes => {
    res.json(athletes)
  })
})

//Get athletes
app.get('/api/athletes', (req, res) => {
  Athlete.find({}).then(athletes => {
    res.json(athletes)
  })
})

// Get specific Athlete
app.get('/api/athletes/:athleteId', (req, res, next) => {
  Athlete.findById(req.params.athleteId)
    .then(athlete => {
      if (athlete) {
        console.log(athlete)
      res.json(athlete.toJSON())
      } else {
        res.status(404).end()
      }
  })
  .catch(error => next(error))
})

// Get workout list for Athlete
app.get('/api/athletes/:athleteId/workouts', (req, res, next) => {
  Athlete.findById(req.params.athleteId)
    .then(athlete => {
      if (athlete) {
        res.json(athlete.workouts)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Get specific Workout
app.get('/api/athletes/:athleteId/workouts/:workoutId', (req, res, next) => {
  console.log('WorkoutID', req.params.workoutId)
  Athlete.findById(req.params.athleteId)
    .then(athlete => {
      if (athlete) {
        let workout = athlete.workouts.filter((workout) => {
          return workout._id.toString() === req.params.workoutId
      }) 
      res.json(workout.shift())
      } else {
        res.status(404).end()
      }
  })
    .catch(error => next(error))
})

// Delete specific Athlete
app.delete('/api/athletes/:athleteId', (req, res, next) => {
  Athlete.findByIdAndRemove(req.params.athleteId)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Delete specific Workout
app.delete('/api/athletes/:athleteId/workouts/:workoutId', (req, res, next) => {
  Athlete.findById(req.params.athleteId)
  .then(workout => {
    workout.workouts.id(req.params.workoutId).remove()
    workout.save()
    res.status(204).end()
  })
    .catch(error => next(error))
})  

// Add Athlete
app.post('/api/athletes', (req, res) => {
  const body = req.body

  console.log('Workouts: ', body)
  console.log('Params:', req.params)
  console.log('Name:', body.name)

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  const athlete = new Athlete({
    name: body.name,
    workouts: [],
  })

  console.log('Schema:', athlete)

  athlete.save().then(savedAthlete => {
    res.json(savedAthlete.toJSON())
  })
})

// Add Workout
app.post('/api/athletes/:athleteId', (req, res, next) => {
  const body = req.body

  console.log('Workouts: ', body)
  console.log('Params:', req.params)
  console.log('Name:', body.name)

  const workout = {
    type: body.type,
    date: body.date,
    note: body.note
  }

  console.log('Schema:', workout)

  Athlete.findByIdAndUpdate(req.params.athleteId, {$push: {workouts: workout}})
    .then(updatedAthlete => {
      res.json(updatedAthlete.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
