const express = require('express');
const router = express.Router({ mergeParams: true });
const Board = require('../models/board');
const Comment = require('../models/comment');
const { commentSchema } = require('../schemas.js');
const { isLoggedIn, validateComment, checkCommentAuthor } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const board = await Board.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    board.comments.push(comment);
    await comment.save();
    await board.save();
    req.flash('success', 'Comment has been registered.')
    res.redirect(`/rabbits/${board._id}`);
}))

router.delete('/:commentId', isLoggedIn, checkCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Board.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'The comment has been deleted.')
    res.redirect(`/rabbits/${id}`)
}))

module.exports = router;