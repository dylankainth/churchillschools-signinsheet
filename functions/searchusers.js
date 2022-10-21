const MongoClient = require('mongodb').MongoClient

const MONGODB_URI =
  'mongodb+srv://dbuser:dbpass@cluster0.z9gcycs.mongodb.net/?retryWrites=true&w=majority'
const DB_NAME = 'DIGITALSIGNIN'

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

const queryDatabase = async (db,name) => {

  // const searchresult = await db
    // .collection('users')
    // .find({ $text: { $search: name } })
    // .toArray()

  // const searchresult = await db.collection('users').find({"name" :  /^ka/i }).toArray();
  
  query = {name:{'$regex' : '^'+name, '$options' : 'i'}}
  const searchresult = await db.collection('users').find(query).toArray();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchresult),
  }
}

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false

  const db = await connectToDatabase(MONGODB_URI)

  // get query string parameter called 'name'
  const name = event.queryStringParameters.name

  return queryDatabase(db,name)
}
