const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const {
  DB_USER, DB_PASS, DB_URL, DB_NAME,
} = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;
const client = () => new MongoClient(uri, { useUnifiedTopology: true });

module.exports = client;
