const mongoose = require('mongoose');
const { Schema } = mongoose; // imported mongoose Schema

const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // this is created so we can diferenciate the users by getting their unique user id, and accoring to that id, we will give their own data.
        ref:'user' // this 'user' is from the User.js //const User = mongoose.model('user', UserSchema);
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('notes', NoteSchema); // that 'notes' is the new collection of the Mongodb.