const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
if (process.env.NODE_ENV == ('development' || 'development ')) {
    dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
    dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
    console.log(`environment [${process.env.NODE_ENV}]`);
    dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

async function connect() {
    const dbUri = process.env.DB_URI;

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(dbUri, {
            retryWrites: true, w: 'majority'
        });
        console.log('Connected To Db');
    } catch (error) {
        console.log('Could not connect to db');
        console.error(error);
        process.exit(1);
    }
}

module.exports = { connect };
