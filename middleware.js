const ExpressError = require('./utils/ExpressError');
const Board = require('./models/board');
const Comment = require('./models/comment');
const { boardSchema, commentSchema } = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBoard = (req, res, next) => {
    const { error } = boardSchema.validate(req.body);
    if(error) {
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.checkBoardAuthor = async(req, res, next) => {
    const { id } =req.params;
    const board = await Board.findById(id)
    if (!board.author.equals(req.user._id)) {
        req.flash('error', 'Do not have permission.')
        return res.redirect(`/rabbits/${id}`);
    }
    next();
}

module.exports.checkCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'Only the author of the comment can modify it.');
        return res.redirect(`/rabbits/${id}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

