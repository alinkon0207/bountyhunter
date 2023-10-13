const { Schema, model } = require('mongoose');

const bountySchema = new Schema(
    {
        bountyId: { type: Number, required: true }, 
        creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
        title: { type: String, required: true }, 
        payAmount: { type: Number, required: true }, 
        description: { type: String }, 
        startDate: { type: Date, default: Date.now }, 
        endDate: { type: Date, default: Date.now }, 
        type: { type: Number }, 
        topic: { type: Number }, 
        difficulty: { type: Number }, 
        block: { type: Number }, 
        gitRepo: { type: String }, 
        status: { type: Number }
    }
);

module.exports = model('Bounty', bountySchema);
