//import the express package into the program
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/personDB')


//creates a variable 'app' to use the express library.
const app = express()

app.use(express.json())
app.use(express.static('dist'))
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
  app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

    //defines an event handler that handles HTTP DELETE requests
    //made to remove the note matching the ID number.
  app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)


    response.status(204).end()
  })


  app.post('/api/persons', (request, response) => {
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

  })

  //returns the info from the phonebook
  app.get('/info', (request,response) => {
    const requestTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/>
                    ${requestTime}`)
    console.log(requestTime)
  })

  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


  const PORT = process.env.PORT // using port defined in the enviromental variable.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
