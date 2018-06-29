const mongoose  = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const keys = require('./config/keys')

//Routes list
const users = require('./routes/api/users')


const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// DB Config
mongoose.connect(keys.mongoURI)
        .then(()=> console.log("MongoDB Connected"))
        .catch(err => console.log(err))

// Passport middleware

app.use(passport.initialize())

// passport Config
require('./config/passport')(passport)

// Use Routes
app.use("/api/users", users)


let PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
  console.log(`Listen on port ${PORT}`)
})





