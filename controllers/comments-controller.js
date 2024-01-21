const { removeComment } = require('../models/comments-model.js')
const { checkCommentId} = require('../models/utils/comments-util.js')

function deleteComment(req, res, next) {
    const { comment_id } = req.params

    const checkComment = checkCommentId(comment_id)
    const commentRemoved = removeComment(comment_id)
    Promise.all([checkComment, commentRemoved])
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { deleteComment }