const db = require('../../db/connection')


function checkCommentId(comment_id) {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment does not exist'})
        }
    })
}

module.exports = { checkCommentId }