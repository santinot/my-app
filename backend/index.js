const express = require('express')
var router = express.Router();
const cors = require('cors')

const app = express()
const apiRouter = require('./routes/api')

app.use(cors())
app.use('/api', apiRouter)

app.get('/', function (req, res) {
  res.send('Hello World')
})



app.listen(3001, () => console.log('Server running on port 3001'))