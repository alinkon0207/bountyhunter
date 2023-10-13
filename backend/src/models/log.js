const { Schema, model } = require('mongoose');

const logSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
        date: { type: Date, default: Date.now }, 
        action: { type: String }, 
        bountyId: { type: Schema.Types.ObjectId, ref: 'Bounty'}, 
        workId: { type: Schema.Types.ObjectId, ref: 'Work' }, 
        note: { type: String }
    }
);

module.exports = model('Log', logSchema);
