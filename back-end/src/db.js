const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.CONNECTION_STRING;
let client;

const initializeDbConnection = async () => {
    client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const getDbConnection = dbName => {
    const db = client.db(dbName);
    return db;
}

module.exports.initializeDbConnection = initializeDbConnection;
module.exports.getDbConnection = getDbConnection;