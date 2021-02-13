/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const client = require('..')();

const write = async () => {
  const DATA_DIR = 'public';

  async function writeCollection(db, name) {
    const collection = db.collection(name);
    let result = await collection.find({}).toArray();

    result = result.map((document) => ({
      t: document.temperature,
      h: document.humidity,
      p: document.pressure,
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
