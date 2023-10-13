const dotenv = require('dotenv');
const express = require('express');
const app = express();
const { connect } = require('./db');
const cors = require('cors');
const path = require('path');

dotenv.config();
if (process.env.NODE_ENV == ('development' || 'development ')) {
    dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
    dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
    dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

app.use(express.json());
app.use(cors({origin: '*'}));

app.use('/api/', require('./routes/app.routes'));

app.get('/api/', (request, response) => {
    response.send('BountyHunter Alive Check');
});

app.use('/api/bounty', require('./routes/bounty'));

app.listen(process.env.PORT, async function () {
    console.log(`Ready to go. listening on port:[${process.env.PORT}] on pid:[${process.pid}]`);
    await connect();
});
