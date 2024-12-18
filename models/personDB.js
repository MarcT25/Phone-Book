const mongoose = require('mongoose')
require('dotenv').config()

//allows for querying of fields not define in the schema.
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)

.then(result => {
    console.log('connected to MongoDB')
})
.catch(error => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
      type:String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      required: true,
      validate:{
        validator: function(v){
          return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
        },
        message: (props) => `${props.value} is not a valid phone number. format **-****** or ***-*****`
      }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Person', personSchema)

