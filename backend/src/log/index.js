const LogModel = require('../models/log');

async function addLog(userId, time, action, bountyId, workId, note) {
    const newLog = new LogModel({
        userId: userId, 
        time: time, 
        action: action, 
        bountyId: bountyId, 
        workId: workId, 
        note: note
    });

    await newLog.save();

    return true;
}

async function getLogs(filter, param, user) {
    
}

module.exports = { addLog, getLogs };
