/* eslint-disable no-console */
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

exports.handler = async (event) => {
  const {
    temperature, humidity, pressure, room,
  } = event.queryStringParameters;
  const {
    DB_USER, DB_PASS, DB_URL, DB_NAME,
  } = process.env;
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });

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
