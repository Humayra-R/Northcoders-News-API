const express = require('express')
const app = express()

const { getTopics } = require('./controllers/topics-controller')
const { getAllEndpoints } = require('./controllers/all-endpoints-controller')

app.use(express.json())

app.get('/api', getAllEndpoints)

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Internal Server Error' })
  })

module.exports = app