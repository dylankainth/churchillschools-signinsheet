const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI_CHURCHILLSCHOOLS;
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

  await db.collection("users").updateOne({ "name": data.surname }, { $push: { "signins": data } });

  // increment the count for the reason
  await db.collection("reasons").updateOne({ "name": data.visitReason }, { $inc: { "count": 1 } });

  // add the timestamp of the signin to an array of the reason
  await db.collection("reasons").updateOne({ "name": data.visitReason }, { $push: { "signins": {"timestamp": data.timestamp, "duration": data.duration } } });

  return { statusCode: 201 };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);

  return pushToDatabase(db, JSON.parse(event.body));

};