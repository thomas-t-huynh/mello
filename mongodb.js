// CRUD Ops - Create Reuse Updatee Delete

// const mongodb = require('mongodb');
const {MongoClient } = require('mongodb');

const databaseName = 'mello';

MongoClient.connect(connectionURL, {  useUnifiedTopology: true  }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database: ' + error)
    }
    const db = client.db(databaseName);
})