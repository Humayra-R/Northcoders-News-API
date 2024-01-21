const db = require('../../db/connection')

function checkUser({ user_name }) {
    return db.query(`SELECT * FROM users
    WHERE username = $1`, [user_name])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, msg: 'User not found'})
        }
    })
}

module.exports = { checkUser }