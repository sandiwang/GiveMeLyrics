const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const db = require('./firebase/db')
const config = require('./config')
const errorLogger = require('./helpers/appErrorLogger')

//routes
const auth = require('./routes/auth')
const lyrics = require('./routes/lyrics')

// get environment variables
require('dotenv').config({ path: '.env.default' })

const app = express()
const NODE_ENV = process.env.NODE_ENV

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}

errorLogger.generalLogging(app, NODE_ENV)

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.get('/login/:app', auth.login)
app.get('/callback/:app', auth.callback)
app.get('/refreshToken/:app', auth.refreshToken)
app.get('/track', lyrics.getTrack)
app.get('/lyrics', lyrics.getLyrics)


app.get('/posts', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
})


app.listen(process.env.PORT || 8081)