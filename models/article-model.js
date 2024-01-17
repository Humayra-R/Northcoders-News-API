const db = require('../db/connection')

function responseAllArticles(res, req, next) {
    
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
    ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
        return rows
    })
}

function responseArticle(article_id) {
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status:404, msg: 'article does not exist' })
    }
    return rows
})
}

module.exports = { responseAllArticles, responseArticle }