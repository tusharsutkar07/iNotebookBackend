const connectToMongo = require('./db') // imported connectToMongo named function from the db.js
var cors = require('cors') // imported cors because of some policy issues.

const express = require('express')

// used the connectToMongo() named function.
connectToMongo();
const app = express()
const port = process.env.PORT || 5000 

app.use(cors()) // used cors because of some policy issues.

app.use(express.json()) // it is need to send the request.

// bellow code is the available routes
app.use('/api/auth', require('./routes/auth')) //this comes from auth.js
app.use('/api/notes', require('./routes/notes')) //this comes from notes.js

app.listen(port, () => { // this is a function that will listen the events
  console.log(`iNotebook backend listening on port ${port}`)
})
