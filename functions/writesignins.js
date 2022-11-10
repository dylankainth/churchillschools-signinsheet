// ./lambda_functions/pokemon.js
const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = 'mongodb+srv://dbuser:dbpass@cluster0.z9gcycs.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'DIGITALSIGNIN';

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const pushToDatabase = async (db, data) => {
  data.timestamp = new Date();
  await db.collection("signinrecord").insertOne(data);

  console.log(data)

  await db.collection("users").updateOne({ "name": data.surname }, { $push: { "signins": data } });

  return { statusCode: 201 };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);

  return pushToDatabase(db, JSON.parse(event.body));

};