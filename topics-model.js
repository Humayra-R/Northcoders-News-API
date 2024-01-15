const db = require('./db/connection')

function responseTopics(req, res, next) {
    return db.query(`SELECT * FROM topics`)
}

module.exports = { responseTopics }