require('dotenv').config()
const { Database, aql } = require('arangojs')

const host = process.env.ARANGODB_HOST
const port = process.env.ARANGODB_PORT
const database = process.env.ARANGODB_DB
const dbUsername = process.env.ARANGODB_USERNAME
const dbPassword = process.env.ARANGODB_PASSWORD

const testDb = async (db) => {
  try {
    const arango = new Database({
      url: `http://${dbUsername}:${dbPassword}@${host}:${port}`
    });

    //console.log('test db')
    let dbnames = await arango.listDatabases();
    if (dbnames.indexOf(db) == -1) {
      await arango.createDatabase(db).then(() => {
        console.log("Database created successfully: ", db);
      });
    }
    arango.useDatabase(db);
    return arango;
  } catch (err) { console.log(err) }//{info(err)}	
}

const query = async (aq) => {
  try {
    //console.log('start')
    let dbready = await testDb(database);
    let cursor = await dbready.query(aq);
    let res = await cursor.all();
    //console.log('res:', res.length)

    //info(cursor._result);
    return res;
  } catch (err) {
    console.log(err)
  }
}


module.exports = {
  aql,
  query,
}
