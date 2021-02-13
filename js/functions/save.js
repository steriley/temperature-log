/* eslint-disable no-console */
const client = require('..')();

exports.handler = async (event) => {
  const {
    temperature, humidity, pressure, room,
  } = event.queryStringParameters;

  const data = {
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    pressure: parseFloat(pressure),
    date: new Date(),
  };

  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);
    const collection = database.collection(room || 'boxroom');

    await collection.insertOne(data);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data, null, 2),
  };
};
