const { responseUsers } = require('../models/users-model')

function getUsers(req, res, next) {
    responseUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
}

module.exports = { getUsers }