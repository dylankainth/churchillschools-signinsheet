// const MongoClient = require('mongodb').MongoClient

// const MONGODB_URI = process.env.MONGODB_URI_CHURCHILLSCHOOLS
// const DB_NAME = 'DIGITALSIGNIN'

// //import jwt
// const jwt = require('jsonwebtoken')

// let cachedDb = null

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

// const queryDatabase = async (db) => {
//   // query the database for signins today
//   const signinrecord = await db
//     .collection('signinrecord')
//     .find()
//     .toArray()

//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(signinrecord),
//   }
// }

// module.exports.handler = async (event, context) => {

//   const db = await connectToDatabase(MONGODB_URI)
//   // decode the JWT token in the Authorization header

//   if (event.headers.authorization) {
//     const token = event.headers.authorization.split(' ')[1]

//     const decoded = jwt.decode(token, { complete: true })

//     // check if the user's email ends with harrowschool.org.uk
//     if (decoded.payload.upn.endsWith('harrowschool.org.uk')) {
//       return queryDatabase(db)
//     } else {
//       // return 403
//       return {
//         statusCode: 403,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: 'Forbidden' }),
//       }
//     }
//   } else {
//     // return 403
//     return {
//       statusCode: 403,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ message: 'Forbidden' }),
//     }
//   }
// }

const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI_CHURCHILLSCHOOLS;
const DB_NAME = 'DIGITALSIGNIN';

let cachedDb = null;

//import jwt
const jwt = require('jsonwebtoken')

const JSZip = require('jszip')

//import json2csv
const json2csv = require('json2csv')

exports.handler = async (event, context) => {
  // parse the query string parameters
  const params = event.queryStringParameters

  const db = await connectToDatabase(MONGODB_URI)

  if (params) {
    
	// decode the authkey using jwt after removing the 'Bearer ' prefix
	const decoded = jwt.decode(params.authkey.substring(7), { complete: true })

    // check if the user's email ends with harrowschool.org.uk
    if (decoded.payload.upn.endsWith('harrowschool.org.uk')) {
      // Create archive
      const zip = new JSZip()

      // convert the date string to a date object
      const startdate = new Date(params.startdate)
      const enddate = new Date(params.enddate)

      // get all data from signinrecord collection between startdate and enddate and convert to csv, then add to archive
      const signinrecord = await db.collection('signinrecord').find({timestamp: {$gte: startdate, $lte: enddate}}).toArray()
      const csv = json2csv.parse(signinrecord)
      zip.file('signinrecord.csv', csv)

      // Build the Zip file
      let zipFile = await zip.generateAsync({ type: 'base64' })

      // Return the Zip file with `zipfile_[DATE]` as the filename
      return {
        headers: {
          'Content-Type': 'application/zip, application/octet-stream',
          'Content-disposition': `attachment; filename=${`zipfile_${new Date().toJSON()}.zip`}`,
        },
        body: zipFile,
        statusCode: 200,
        isBase64Encoded: true,
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
