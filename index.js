//import the express package into the program
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
//creates a variable 'app' to use the express library.
const app = express()

app.use(express.json())
app.use(cors())
//new token for morgan to make the JSON request into a string.
morgan.token('body', req => {
    return JSON.stringify(req.body)
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
    //made to fetch the notes path of the application.
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

    //defines an event handler that handles HTTP GET requests
    //made to fetch the note matching the ID number.
  app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    //if the note is found return the note, else return status 404
    if(person){
      response.json(person)
    } else {
        //set status to 404(not found) and end the process without sending data.
      response.status(404).end()
    }
  })

    //defines an event handler that handles HTTP DELETE requests
    //made to remove the note matching the ID number.
  app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)


    response.status(204).end()
  })

  // tot generate id for new entries.
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }


  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    //if body does not contain firstname and phoneNumber throw error.
    if (!body.firstName || !body.phoneNumber) {
      return response.status(400).json({ 
        error: 'name or number are missing' 
      })
    }

    //checks if a name is arleady in existence and returns a error if true.
    const existingName = persons.find((p) => p.name === body.firstName)
    if(existingName){
        response.status(400).json({ error: 'name must be unique' })
    }

  
    const person = {
      name: body.firstName,
      number: body.phoneNumber,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(persons)
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


  const PORT = process.env.PORT || 3001 // using port defined in the enviromental variable.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
