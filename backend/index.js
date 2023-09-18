const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
// http://localhost:3001/
app.get('/', function (req, res) {
  res.send('Hello World')
})
// http://localhost:3001/api
app.use('/api', require('./routes/api'))


app.listen(3001, () => console.log('Server running on port 3001'))