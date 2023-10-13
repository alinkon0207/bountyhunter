const BountyModel = require("../models/bounty");
const WorkModel = require("../models/work");
const { addLog } = require('../log');

async function createBounty(creatorId, bountyId, 
    title, payAmount, startDate, endDate, 
    type, difficulty, topic, 
    description, gitHub, 
    block, status
) {
    // check existence
    const oldBounty = await BountyModel.findOne({bountyId: bountyId});
    if (oldBounty !== null) {
        await oldBounty.populate('creator');
        throw new Error(`${oldBounty.creator.name ? oldBounty.user.name: oldBounty.user.wallet} has already added the bounty`);
    }
    
    // create new
    const newBounty = new BountyModel({
        creator: creatorId, 
        bountyId: bountyId, 
        title: title, 
        payAmount: payAmount, 
        startDate: startDate, 
        endDate: endDate, 
        type: type, 
        topic: topic, 
        difficulty: difficulty, 
        description: description, 
        gitHub: gitHub, 
        block: block, 
        status: status
    });
    await newBounty.save();

    await addLog(creatorId, startDate, 'Create', newBounty._id, null, '');

    return true;
}

async function getRecentBounties() {
    const posts = await BountyModel.find({}, {}, {sort: {createdAt: -1}, limit: 10, skip: 0}).populate('creator');
    return posts;
}

async function searchBounties(param) {
    const allBounties = await BountyModel.find({}, {}, {sort: {createdAt: -1}, skip: 0});
    
    param = (param || '').toLowerCase();
    if (param === '')
        return allBounties;
    else
        return allBounties.filter((p) => {
            return p.title.toLowerCase().includes(param)
                || (p.description || '').toLowerCase().includes(param);
        });
}

async function getAppliedBounties(user) {
    const works = await WorkModel.find({participant: user._id}).populate('bounty');
    const bounties = works.map(b => b.bounty);
    return bounties;
}

async function getBounties(filter, param, user) {
    if (filter === 'search') {
        return await searchBounties(param);
    } else if (filter === 'applied') {
        return await getAppliedBounties(user);
    } else if (filter === 'created') {
        return await BountyModel.find({creator: user._id});
    } else {
        throw new Error('Unknown filter');
    }
}

async function getSingleBounty(bountyId) {
    return await BountyModel.findOne({bountyId: bountyId}).populate('creator');
}

async function cancelBounty(bountyId, newStatus) {
    const bounty = await BountyModel.findOne({bountyId: bountyId});
    if (bounty === null) {
        throw new Error('Invalid Bounty');
    }

    bounty.status = newStatus;
    bounty.save();

    await addLog(bounty.creator, Date.now(), 'Cancel', bounty._id, null, '');

    return true;
}

async function closeBounty(bountyId, newStatus) {
    const bounty = await BountyModel.findOne({bountyId: bountyId});
    if (bounty === null) {
        throw new Error('Invalid Bounty');
    }

    bounty.status = newStatus;
    bounty.save();

    await addLog(bounty.creator, Date.now(), 'Close', bounty._id, null, '');

    return true;
}

module.exports = { createBounty, getRecentBounties, getBounties, getSingleBounty, cancelBounty, closeBounty };
