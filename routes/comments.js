const express = require('express');
const router = express.Router({ mergeParams: true });
const Board = require('../models/board');
const Comment = require('../models/comment');
const comments = require('../controllers/comments');
const { isLoggedIn, validateComment, checkCommentAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, checkCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;