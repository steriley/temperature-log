/* eslint-disable no-console */
const client = require('..')();

exports.handler = async (event) => {
  const { room } = event.queryStringParameters;
  let results;

  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);
    const collection = database.collection(room || 'boxroom');

    results = await collection.find({}).toArray();

    results = results.map((document) => ({
      t: document.temperature,
      h: document.humidity,
      p: document.pressure,
      d: document.date,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
