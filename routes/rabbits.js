const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { boardSchema } = require('../schemas.js');
const { isLoggedIn, validateBoard, checkBoardAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');

const Board = require('../models/board');

router.get('/',  catchAsync(async (req, res) => {
    const boards = await Board.find({});
    res.render('rabbits/index', { boards })
}));

router.get('/new', (req, res) => {
    res.render('rabbits/new');
})

router.post('/', validateBoard, catchAsync(async (req, res, next) => {
    const board = new Board(req.body.board);
    board.author = req.user._id;
    await board.save();
    req.flash('success', 'Successfully made a new board')
    res.redirect(`/rabbits/${board._id}`)
}))


router.get('/:id',  catchAsync(async (req, res,) => {
    const board = await Board.findById(req.params.id).populate({
        path : 'comments',
        populate : {
            path: 'author'
        }
    }).populate('author');
    if (!board) {
        req.flash('error', 'Cannot find that board!');
        return res.redirect('/rabbits');
    } 
    res.render('rabbits/show', { board });
}));

router.get('/:id/edit', isLoggedIn, checkBoardAuthor, catchAsync(async (req, res) => {
    const { id } =req.params;
    const board = await Board.findById(id)
    if (!board) {
        req.flash('error', 'Cannot find that board!');
        return res.redirect('/rabbits');
    }
    res.render('rabbits/edit', { board });
}))

router.put('/:id', isLoggedIn, checkBoardAuthor, validateBoard, catchAsync(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/rabbits/${board._id}`)
}));

router.delete('/:id', isLoggedIn, checkBoardAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    req.flash('success', 'The post has been deleted.')
    res.redirect('/rabbits');
}))


module.exports = router;