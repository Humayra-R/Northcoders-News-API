const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controller')
const { getAllEndpoints } = require('./controllers/all-endpoints-controller')
const { getArticle, getAllArticles, getComments, postComment, patchArticle } = require('./controllers/article-controller')
const { deleteComment } = require('./controllers/comments-controller')
const { getUsers } = require('./controllers/users-controller')

app.use(express.json())

app.get('/api', getAllEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticle)

app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)

app.delete('/api/comments/:comment_id', deleteComment)

app.get('/api/users', getUsers)

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

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' })

  })

module.exports = app