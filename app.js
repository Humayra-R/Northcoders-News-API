const express = require('express')
const app = express()

const { getTopics } = require('./controllers/topics-controller')
const { getAllEndpoints } = require('./controllers/all-endpoints-controller')
const { getArticle, getAllArticles } = require('./controllers/article-controller')

app.use(express.json())

app.get('/api', getAllEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  }
  next(err)
})

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({msg: 'Bad request'})
  }
  next(err)
})

app.use((err, req, res, next) => {S
    res.status(500).send({ msg: 'Internal Server Error' })

  })

module.exports = app