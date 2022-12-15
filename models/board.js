const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});


const BoardSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

BoardSchema.post('findOneAndDelete', async function(doc){
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Board', BoardSchema);