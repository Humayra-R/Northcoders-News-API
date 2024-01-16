const { responseArticle } = require('../models/article-model')


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

module.exports = { getArticle }