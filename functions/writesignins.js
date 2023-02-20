const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI_CHURCHILLSCHOOLS;
const DB_NAME = 'DIGITALSIGNIN';

let cachedDb = null;

//import jwt
const jwt = require('jsonwebtoken')


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

  const db = await connectToDatabase(MONGODB_URI)
  // decode the JWT token in the Authorization header

  if (event.headers.authorization) {
    const token = event.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token, { complete: true })

    // check if a signin with identical timestamp and name already exists
    const searchresult = await db.collection('signinrecord').find({ "timestamp": JSON.parse(event.body).timestamp, "name": JSON.parse(event.body).name }).toArray()

    // if it does, return 200 and do nothing
    if (searchresult.length > 0) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Already exists' }),
      }
    }
    
    // check if the user's email ends with harrowschool.org.uk
    if (decoded.payload.upn.endsWith('harrowschool.org.uk')) {
      // get query string parameter called 'name'
      const name = event.queryStringParameters.name

      return pushToDatabase(db, JSON.parse(event.body));
    } else {
      // return 403
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Forbidden' }),
      }
    }
  } else {
    // return 403
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Forbidden' }),
    }
  }
}
