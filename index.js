//import the express package into the program
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/personDB')


//creates a variable 'app' to use the express library.
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


//new token for morgan to make the JSON request into a string.
morgan.token('body', request => {
    return JSON.stringify(request.body)
  })

  app.use(morgan(':method :url :body'))

//data for the persons API.
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


  // defines an event handler that is used 
  //to handle HTTP GET requests made to the application's / root.
  app.get('/', (request, response) =>{

    response.send('<h1>Hello World!</h1>')
  })

    //defines an event handler that handles HTTP GET requests
    //made to fetch the person path of the application.
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
  })

    //defines an event handler that handles HTTP GET requests
    //made to fetch the person matching the ID number.
  app.get('/api/persons/:id', (request,response,next) => {
    Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
    })

    //defines an event handler that handles HTTP DELETE requests
    //made to remove the person matching the ID number.
  app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch((error) => next(error))
  })


  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    //if body does not contain firstname and phoneNumber throw error.
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ 
        error: 'name or number are missing' 
      })
    }

    //checks if a name is arleady in existence and returns a error if true.
    const existingName = persons.find((p) => p.name === body.name)
    if(existingName){
        response.status(400).json({ error: 'name must be unique' })
    }

  
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)

    })
    .catch(error => next(error))

  })

  //updates the phone number if the name is already in the database
  app.put('/api/persons/:id', async (request, response, next) =>{
    const body  = request.body

    const person = {
      name: body.name,
      number: body.number
    }

    await Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      if(updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
  })

  //returns the info from the phonebook
  app.get('/info', async (request,response) => {
    const requestTime = new Date()
    const count = await Person.countDocuments()
    response.send(`<p>Phonebook has info for ${count} people</p> <br/>
                    ${requestTime}`)
    console.log(requestTime)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === "ValidationError"){
      return response.status(400).json({error: error.message})
    } else if(error.name === "CastError") {
      return response.status(400).json({error: error.message})
    }

    next(error)
  }

  app.use(errorHandler)


  const PORT = process.env.PORT // using port defined in the enviromental variable.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
