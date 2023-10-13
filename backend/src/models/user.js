const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        wallet: { type: String, unique: true }, 
        name: { type: String }, 
        github: { type: String }, 
        discord: { type: String }, 
        avatar: { type: String }
    }
);

module.exports = model('User', userSchema);
