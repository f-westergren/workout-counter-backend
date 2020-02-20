const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(cors())

morgan.token('reqData', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[header] :reqData'))


const generateRandomId = (max) => Math.floor(Math.random() * Math.floor(max))

let athletes = [
  {
    "athleteId": 1,
    "name": "Folke Westergren",
    "workouts": [
      {
        "type": "Crossfit",
        "date": "2020-02-03",
        "note": "Folkes hard workout!",
        "workoutId": 1896
      },
      {
        "type": "Crossfit",
        "date": "2020-03-03",
        "note": "Folkes even harder workout!",
        "workoutId": 2546
      },
      {
        "type": "Styrketräning",
        "date": "2020-02-04",
        "note": "Pass 3",
        "workoutId": 3234
      },
      {
        "type": "Gym",
        "date": "2020-02-05",
        "note": "Beefcake!",
        "workoutId": 4234
      },
      {
        "type": "Styrketräning",
        "date": "2020-02-18",
        "note": "Testing again",
        "workoutId": 5876
      },
      {
        "type": "Testgin",
        "date": "2020-02-19",
        "note": "Ajemen",
        "workoutId": 6087
      }
    ]
  },
  {
    "athleteId": 2,
    "name": "Linda Holm",
    "workouts": [
      {
        "type": "Crossfit",
        "date": "2020-02-03",
        "note": "Lindas hard workout!",
        "workoutId": 1435
      },
      {
        "type": "Crossfit",
        "date": "2020-03-03",
        "note": "Lindas even harder workout!",
        "workoutId": 2756
      },
      {
        "type": "Yoga",
        "date": "2020-02-04",
        "note": "Morgonyoga! Gravidyoga!",
        "workoutId": 3199
      },
      {
        "type": "Yoga",
        "date": "2020-02-05",
        "note": "Mera yoga idag :)",
        "workoutId": 4388
      },
      {
        "type": "Hot Yoga",
        "date": "2020-02-20",
        "note": "Because I'm pregnant!",
        "workoutId": 5251
      },
      {
        "type": "Hot Yoga",
        "date": "2020-02-13",
        "note": "Hon e ball",
        "workoutId": 6222
      }
    ]
  },
  {
    "name": "Niklas Emmelkamp",
    "workouts": [
      {
        "type": "Bygga",
        "date": "2020-02-16",
        "note": "Stark som fan!",
        "workoutId": 1333
      }
    ],
    "athleteId": 3
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

//Get athletes
app.get('/api/athletes', (req, res) => {
  res.json(athletes)
})

// Get specific Athlete
app.get('/api/athletes/:athleteId', (req, res) => {
  const id = Number(req.params.athleteId)
  const athlete = athletes.find(athlete => athlete.athleteId === id)
  
  if (athlete) {
    res.json(athlete)
  } else {
    res.status(404).end()
  }
})

// Get workout list for Athlete
app.get('/api/athletes/:athleteId/workouts', (req, res) => {
  const id = Number(req.params.athleteId)
  const athlete = athletes.find(athlete => athlete.athleteId === id)

  if (athlete) {
    res.json(athlete.workouts)
  } else {
    res.status(404).end()
  }
})

// Get specific Workout
app.get('/api/athletes/:athleteId/workouts/:workoutId', (req, res, next) => {
  const athleteId = Number(req.params.athleteId)
  const workoutId = Number(req.params.workoutId)

  const athlete = athletes.find(athlete => athlete.athleteId === athleteId)
  const workout = athlete.workouts.find(workout => workout.workoutId === workoutId)

  if (athlete && workout) {
    res.json(workout)
  } 
  else {
    res.status(404).end()
  }
})

// Delete specific Athlete
app.delete('/api/athletes/:athleteId', (req, res) => {
  const id = Number(req.params.athleteId)
  athletes = athletes.filter(athlete => athlete.athleteId !== id)

  res.status(204).end()
})

// Delete specific Workout
app.delete('/api/athletes/:athleteId/workouts/:workoutId', (req, res) => {
  const athleteId = Number(req.params.athleteId)
  const workoutId = Number(req.params.workoutId)

  const athlete = athletes.find(athlete => athlete.athleteId === athleteId)

  athlete.workouts = athlete.workouts.filter(workout => workout.workoutId !== workoutId)

  res.status(204).end()
})

// Add Athlete
app.post('/api/athletes', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  const athlete = {
    name: body.name,
    workouts: [],
    athleteId: generateRandomId(10000),
  }

  athletes = athletes.concat(athlete)
  
  res.json(athlete)
})

// Add Workout
app.put('/api/athletes/:athleteId/workouts', (req, res) => {
  const body = req.body
  const athleteId = Number(req.params.athleteId)
  const athlete = athletes.find(athlete => athlete.athleteId === athleteId)

  if (!body.type) {
    return res.status(400).json({
      error: 'type missing'
    })
  }

  const workout = {
    type: body.type,
    date: body.date,
    note: body.note,
    workoutId: generateRandomId(10000),
  }

  athlete.workouts = athlete.workouts.concat(workout)

  res.json(workout)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
