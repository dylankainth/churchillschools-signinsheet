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

const pushToDatabase = async (db, body) => {
  console.log(body.data)

  // duration time is timestamp now - timestamp of sign in
  body.data.duration = new Date() - new Date(body.data.timestamp);

  buffer = (Math.floor(body.data.duration/(1000*60))).toString() 

  console.log(buffer)
  console.log(body.data._id)

  // edit signinrecord with id _id
  await db.collection("signinrecord").updateOne({"_id": ObjectId(body.data._id) }, { $set: { "duration": buffer} });



  return { statusCode: 201 };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false

  const db = await connectToDatabase(MONGODB_URI)
  // decode the JWT token in the Authorization header

  if (event.headers.authorization) {
    const token = event.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token, { complete: true })


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
