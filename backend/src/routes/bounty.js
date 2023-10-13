const { Router } = require('express');
const { getUser, setUser } = require('../user');
const { createBounty, getRecentBounties, getBounties, getSingleBounty, cancelBounty, closeBounty } = require('../bounty');
const { createWork, getWorks, getWork, submitWork, countSubmissions, approveWork, rejectWork } = require('../work');

const router = Router();
// var fs = require('fs');
// var path = require('path');

// var multer = require('multer');

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.wallet + '.bin')
//     }
// });

// var upload = multer({ storage: storage });


router.get('/get_user', async (request, response) => {
    const query = request.query;
    
    const user = await getUser(query.wallet); // wallet is the main identifier
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    response.send({ status: 'success', 
        details: `${user.name ? user.name : user.wallet}: successfully got info`, 
        user });
});

router.post('/set_user', async (request, response) => {
    const query = request.body;

    try {
        const res = await setUser(query.wallet, 
            query.name, 
            query.github, 
            query.discord, 
            query.avatar);
        response.send({ status: 'success', 
            details: `${query.name ? query.name : query.wallet} ${res === true ? 'successfully set' : 'failed to set'} info` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});


router.post('/create_bounty', async (request, response) => {
    const query = request.body;
    
    const creator = await getUser(query.wallet);
    if (creator === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const startDate = Date.now();
        const added = await createBounty(creator._id, 
            query.bountyId, query.title, query.payAmount, 
            startDate, startDate + query.duration * 1000, 
            query.type, query.difficulty, query.topic, 
            query.description, query.gitHub, 
            query.block, query.status);
        response.send({ status: 'success', 
            details: `${creator.name ? creator.name : creator.wallet} ${added === true ? 'successfully created' : 'failed to create'} bounty` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/get_recent_bounties', async (request, response) => {
    try {
        const bounties = await getRecentBounties();
        response.send({ status: 'success', details: `${bounties?.length} recent bounties`, bounties: bounties });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/get_bounties', async (request, response) => {
    const query = request.query;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `Invalid wallet` });
        return;
    }

    try {
        const bounties = await getBounties(query.filter, query.param, user);
        response.send({ status: 'success', details: `${bounties?.length} bounties`, bounties: bounties });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/get_single_bounty', async (request, response) => {
    try {
        const bounty = await getSingleBounty(request.query.bountyId);
        if (bounty === null) throw new Error('Not found');
        response.send({ status: 'success', details: `Found`, bounty: bounty });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.post('/cancel_bounty', async (request, response) => {
    const query = request.body;

    const creator = await getUser(query.wallet);
    if (creator === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const res = await cancelBounty(query.bountyId);
        response.send({ status: 'success', 
            details: `${creator.name ? creator.name : creator.wallet} ${res === true ? 'successfully cancelled' : 'failed to cancel'} bounty${query.bountyId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.post('/close_bounty', async (request, response) => {
    const query = request.body;

    const creator = await getUser(query.wallet);
    if (creator === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const res = await closeBounty(query.bountyId);
        response.send({ status: 'success', 
            details: `${creator.name ? creator.name : creator.wallet} ${res === true ? 'successfully closed' : 'failed to close'} bounty${query.bountyId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});


router.post('/create_work', async (request, response) => {
    const query = request.body;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    const bounty = await getSingleBounty(query.bountyId);
    if (bounty === null) {
        response.send({ status: 'failed', error: `Invalid bounty id!` });
        return;
    }

    try {
        const applyDate = Date.now();
        const res = await createWork(user, bounty, query.workId, applyDate, query.status);
        response.send({ status: 'success', 
            details: `${user.name ? user.name : user.wallet} ${res === true ? 'successfully created' : 'failed to created'} work${query.workId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/get_works', async (request, response) => {
    const bounty = await getSingleBounty(request.query.bountyId);
    if (bounty === null) {
        response.send({ status: 'failed', error: `Invalid bounty id!` });
        return;
    }

    try {
        const works = await getWorks(bounty._id);
        response.send({ status: 'success', details: `${works?.length} works`, works: works });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/get_work', async (request, response) => {
    const query = request.query;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    const bounty = await getSingleBounty(query.bountyId);
    if (bounty === null) {
        response.send({ status: 'failed', error: `Invalid bounty id!` });
        return;
    }

    try {
        const work = await getWork(user, bounty);
        if (work === null) throw new Error('Not found');
        response.send({ status: 'success', details: `Found`, work: work });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.post('/submit_work', async (request, response) => {
    const query = request.body;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const res = await submitWork(user, query.workId, query.title, query.description, query.workRepo, Date.now(), query.status);
        response.send({ status: 'success', 
            details: `${user.name ? user.name : user.wallet} ${res === true ? 'successfully submitted' : 'failed to submit'} work${query.workId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.get('/count_submissions', async (request, response) => {
    const query = request.query;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    const bounty = await getSingleBounty(query.bountyId);
    if (bounty === null) {
        response.send({ status: 'failed', error: `Failed to get bounty` });
        return;
    }

    try {
        const count = await countSubmissions(bounty._id, query.status);
        response.send({ status: 'success', count: count });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.post('/approve_work', async (request, response) => {
    const query = request.body;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const res = await approveWork(user, query.workId, query.status);
        response.send({ status: 'success', 
            details: `${user.name ? user.name : user.wallet} ${res === true? 'successfully approved': 'failed to approve'} work${query.workId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

router.post('/reject_work', async (request, response) => {
    const query = request.body;

    const user = await getUser(query.wallet);
    if (user === null) {
        response.send({ status: 'failed', error: `You didn't login or you're an invalid user!` });
        return;
    }

    try {
        const res = await rejectWork(user, query.workId, query.status);
        response.send({ status: 'success', 
            details: `${user.name ? user.name : user.wallet} ${res === true ? 'successfully rejected' : 'failed to reject'} work${query.workId}` });
    } catch (err) {
        response.send({ status: 'failed', error: err.message });
    }
});

module.exports = router;
