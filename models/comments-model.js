const db = require('../db/connection')


function removeComment(comment_id) {
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1 RETURNING*`, [comment_id])
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { removeComment }