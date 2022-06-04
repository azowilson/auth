const express = require('express');
const session = require('express-session');
const { MongoClient } = requrire('mongodb');
const app = express();
const PORT = 3000;
const connectionString = 'mongodb://localhost:27017/auth';
//const dbName = 'auth';

const client = new MongoClient(connectionString);
await client.connect();
console.log('database connected successfully');

const store = '';
app.listen(PORT, () => console.log(`listen port ${PORT}`));
app.use(session({
    secret: 'test auth',
    store: store
}));
app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>');
})