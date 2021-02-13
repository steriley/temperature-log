/* eslint-disable no-console */
// const fs = require('fs');
// const path = require('path');
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
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  const data = {
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    pressure: parseFloat(pressure),
  };

  console.info(uri);

  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);
    const collection = database.collection(room || 'boxroom');
    const result = await collection.insertOne(data);

    // fs.writeFileSync(path.join(process.cwd(), 'json', 'data.json'), JSON.stringify([data]));

    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data, null, 2),
  };
};
