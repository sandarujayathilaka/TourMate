const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
    index: true,
    },
    
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
      },
    roles: {
        type: Schema.Types.Mixed, // Allow any data type for the roles field
        required: true,
      },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);