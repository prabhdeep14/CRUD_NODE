const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

// Create the model from the schema
module.exports = mongoose.model('User', UserSchema);
