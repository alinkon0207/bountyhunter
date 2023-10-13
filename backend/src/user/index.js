const UserModel = require("../models/user");

async function setUser(wallet, name, github, discord, avatar) {
    if (0 < await UserModel.countDocuments({wallet: wallet})) {
        // throw new Error(`${wallet} already in use, Please use another wallet address`);
        await UserModel.updateOne({wallet: wallet}, { name: name, github: github, discord: discord, avatar: avatar });
    } else {
        const newUser = new UserModel({
            wallet: wallet,
            name: name,
            github: github,
            discord: discord,
            avatar: avatar
        });
    
        await newUser.save();
    }

    return true;
}

async function getUser(wallet) {
    return await UserModel.findOne({wallet: wallet});
}

module.exports = { setUser, getUser };
