const { responseAllArticles, responseArticle, responseComments, insertComment } = require('../models/article-model')

function getAllArticles(req, res, next) {
    responseAllArticles(req, res, next)
    .then((articles) => {
        res.status(200).send(articles)
    })
    .catch((err) => {
        next(err)
    })
}

function getArticle(req, res, next) {
    const { article_id } = req.params

    responseArticle(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

function getComments(req, res, next) {
    const { article_id } = req.params
    responseComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
} 

function postComment(req, res, next) {
    const { article_id } = req.params
    const comment = req.body

    insertComment(comment, article_id)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getAllArticles, getArticle, getComments, postComment }