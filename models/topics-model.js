const db = require('../db/connection')

function responseTopics() {
    return db.query(`SELECT * FROM topics`)
}

module.exports = { responseTopics }