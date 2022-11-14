const MongoClient = require('mongodb').MongoClient

const MONGODB_URI = process.env.MONGODB_URI_CHURCHILLSCHOOLS
const DB_NAME = 'DIGITALSIGNIN'

//import jwt
const jwt = require('jsonwebtoken')

let cachedDb = null

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  })

  cachedDb = client.db(DB_NAME)

  return cachedDb
}

const queryDatabase = async (db) => {
  // in the users collection, in the signins array, sum the duration key of each signin object for each user and sort
  const searchresult = await db
    .collection('users')  
    .aggregate([
      {
        $project: {
          name: 1,
          duration: {
            $sum: '$signins.duration',
          },
        },
      },
      {
        $sort: {
          duration: -1,
        },
      },
    ])
    .limit(15)
    .toArray()

    // remove users from searchresult who have a duration of zero
    const filtered = searchresult.filter(function (el) {
      return el.duration != 0;
    });

  

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filtered),
  }
  
}

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
