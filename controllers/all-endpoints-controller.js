const endpoints = require('../endpoints.json')

function getAllEndpoints(req, res, next) {
    res.status(200).send( { endpoints } )
    .catch((err) => {
        next(err)
    })
    
}

module.exports = { getAllEndpoints }