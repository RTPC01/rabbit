const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ProfileImageSchema = new Schema({
    url: String,
    filename: String
});

ProfileImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: [ProfileImageSchema]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);