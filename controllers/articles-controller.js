const { responseAllArticles, responseArticle, updateArticle, responseComments, insertComment } = require('../models/articles-model')
const { checkUser } = require('../models/utils/users-util')
const { checkTopic } = require('../models/utils/topics-util')
const { checkArticleId } = require('../models/utils/articles-util')

function getAllArticles(req, res, next) {
    const { topic } = req.query
    
    if (!topic) { 
        responseAllArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err)
        })
    }
    else if (topic) {
        const topicCheck = checkTopic(topic)
        const selectedArticles = responseAllArticles(topic)
        Promise.all([selectedArticles, topicCheck])    
    .then((rows) => {
        const articles = rows[0]
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
    }
}

function getArticle(req, res, next) {
    const { article_id } = req.params
    
    const checkArticle = checkArticleId(article_id)
    const selectedArticle = responseArticle(article_id)
    Promise.all([selectedArticle, checkArticle])
    .then((rows) => {
        const article = rows[0]
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

function patchArticle(req, res, next) {
    const { article_id } = req.params
    const  inc_votes  = req.body

    const checkArticle = checkArticleId(article_id)
    const articlePatched = updateArticle(inc_votes, article_id)
    Promise.all([articlePatched, checkArticle])
    .then((rows) => {
        const updatedArticle = rows[0]
        res.status(200).send({ updatedArticle })
    })
    .catch((err) => {
        next(err)
    })
}

function getComments(req, res, next) {
    const { article_id } = req.params

    const checkArticle = checkArticleId(article_id)
    const selectedComments = responseComments(article_id)
    
    Promise.all([selectedComments, checkArticle])
    .then((rows) => {
        const comments = rows[0]
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
} 

function postComment(req, res, next) {
   
    const { article_id } = req.params
    const comment = req.body

    const checkArticle = checkArticleId(article_id)
    const userQuery = checkUser(comment)
    const uploadComment = insertComment(comment, article_id)
    Promise.all([uploadComment, userQuery, checkArticle])
    .then((result) => {
        const comment = result[0]
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getAllArticles, getArticle, patchArticle, getComments, postComment }