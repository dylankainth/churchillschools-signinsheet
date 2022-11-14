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

const queryDatabase = async (db) => {
  // read the reasons from the database
  const reasons = await db.collection("reasons").find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reasons),
  };
};


module.exports.handler = async (event, context) => {

  const db = await connectToDatabase(MONGODB_URI)
  // decode the JWT token in the Authorization header

  if (event.headers.authorization) {
    const token = event.headers.authorization.split(' ')[1]
    console.log(token)
    const decoded = jwt.decode(token, { complete: true })
    console.log(decoded)

    // check if the user's email ends with harrowschool.org.uk
    if (decoded.payload.upn.endsWith('harrowschool.org.uk')) {
      return queryDatabase(db)
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
