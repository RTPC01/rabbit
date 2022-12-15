const Board = require('../models/board');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const boards = await Board.find({});
    res.render('rabbits/index', { boards });
}

module.exports.renderNewForm = (req, res) => {
    res.render('rabbits/new');
}

module.exports.createRabbit = async (req, res, next) => {
    const board = new Board(req.body.board);
    board.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    board.author = req.user._id;
    await board.save();
    req.flash('success', 'Successfully made a new board')
    res.redirect(`/rabbits/${board._id}`)
}

module.exports.showRabbit = async (req, res,) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } =req.params;
    const board = await Board.findById(id)
    if (!board) {
        req.flash('error', 'Cannot find that board!');
        return res.redirect('/rabbits');
    }
    res.render('rabbits/edit', { board });
}

module.exports.updateRabbit = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    board.images.push(...imgs);
    await board.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await board.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Rabbit!');
    res.redirect(`/rabbits/${board._id}`)
}

module.exports.deleteRabbit = async (req, res) => {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    req.flash('success', 'The post has been deleted.')
    res.redirect('/rabbits');
}