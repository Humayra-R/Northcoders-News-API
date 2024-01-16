const { fetchEndpoints } = require('../models/all-endpoints-model')


function getAllEndpoints(req, res, next) {
    return fetchEndpoints(req, res, next)
    .then((endpoints) => {
        res.status(200).send( { endpoints })
    })
    .catch((err) => {
        next(err)
    })
    
}

module.exports = { getAllEndpoints }