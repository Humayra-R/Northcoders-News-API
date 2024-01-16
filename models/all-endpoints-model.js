const fs = require('fs/promises')

function fetchEndpoints() {
    return fs.readFile('./endpoints.json')
    .then((fileContents) => {
        const parsedFile = JSON.parse(fileContents)
        return parsedFile
    })
}


module.exports = { fetchEndpoints }