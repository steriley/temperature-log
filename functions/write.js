/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const write = async () => {
  const {
    DB_USER, DB_PASS, DB_URL, DB_NAME,
  } = process.env;

  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const DATA_DIR = 'public';

  async function writeCollection(db, name) {
    const collection = db.collection(name);
    let result = await collection.find({}).toArray();

    result = result.map((document) => ({
      t: document.temperature,
      h: document.humidity,
      p: document.pressure,
      l: document.lux,
      d: document.date,
    }));

    fs.writeFileSync(path.join(process.cwd(), DATA_DIR, `${name}.json`), JSON.stringify(result));
  }

  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);
    const collections = await database.listCollections().toArray();
    const writeQueue = collections.map(({ name }) => writeCollection(database, name));

    await Promise.all(writeQueue);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }

  return {
    statusCode: 200,
    body: `data successfully wrote to ./${DATA_DIR}`,
  };
};

exports.handler = write;

write();
