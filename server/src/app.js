const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')// client hosting
// const cors = require('cors')
// const routes = require('./routes')

const app = express()
// app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// app.use(cors())

require('./routes')(app)
// app.use('/', routes)

const port = 8081;
/* app.listen(port, () => {
  console.log('App listening on port ' + port)
}) */
(async () => {
  app.listen(port)
  console.log(`Server started on port ${port}`)
})()
