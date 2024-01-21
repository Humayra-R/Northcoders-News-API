const db = require('../../db/connection')

function checkTopic(topic) {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Topic does not exist'})
        }
    })
}

module.exports = { checkTopic }