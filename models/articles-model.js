const db = require('../db/connection')

function responseAllArticles(topic = null) {
    
    let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `
 
   const paramArr = []
    if (topic) {
        queryStr += `WHERE topic = $1 `
        paramArr.push(topic)
    }

    queryStr += `GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
    ORDER BY articles.created_at DESC`

    return db.query(queryStr, paramArr)
    .then(({ rows }) => {
        return rows
    })
}

function responseArticle(article_id) {
    
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.author, title, articles.article_id, topic, articles.body, articles.created_at, articles.votes, article_img_url ORDER BY articles.created_at DESC`, [article_id])

    .then(({ rows }) => {
    return rows
})
}

function updateArticle({ inc_votes }, article_id) {
    
    if (!inc_votes) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
    .then(({rows}) => {
        return rows
    })
}

function responseComments(article_id) {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

function insertComment(comment, article_id) {
    const { user_name, body } = comment

    if (!user_name || !body) {
        return Promise.reject({
            status: 400, msg: 'Bad request'
        })
    }
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, [body, user_name, article_id])
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { responseAllArticles, responseArticle, updateArticle, responseComments, insertComment }