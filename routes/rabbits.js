const express = require('express');
const router = express.Router();//
const rabbits = require('../controllers/rabbits');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateBoard, checkBoardAuthor } = require('../middleware');
const multer = require('multer'); //
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const Board = require('../models/board');

router.route('/')
    .get(catchAsync(rabbits.index))
    .post(isLoggedIn, upload.array('image'), validateBoard, catchAsync(rabbits.createRabbit));

router.get('/new', isLoggedIn, rabbits.renderNewForm)

router.route('/:id')
    .get(catchAsync(rabbits.showRabbit))
    .put(isLoggedIn, checkBoardAuthor, upload.array('image'), validateBoard, catchAsync(rabbits.updateRabbit))
    .delete(isLoggedIn, checkBoardAuthor, catchAsync(rabbits.deleteRabbit));

router.get('/:id/edit', isLoggedIn, checkBoardAuthor, catchAsync(rabbits.renderEditForm))



module.exports = router;