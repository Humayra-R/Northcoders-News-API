const { responseTopics } = require('./topics-model')

function getTopics(req, res, next) {
    responseTopics(req, res, next)
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics }