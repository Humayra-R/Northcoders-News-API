const db = require('../../db/connection')
const { responseAllArticles } = require('../article-model')

function checkTopic(filter) {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [filter])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 400, msg: 'Bad request'})
        }
        return checkArticles(filter)
    })
}

function checkArticles(filter) {
    return db.query(`SELECT * FROM articles 
    WHERE topic = $1`, [filter])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'no article found'})
        }
        return responseAllArticles(filter)
    })
}

module.exports = { checkTopic }