const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const subject = event.queryStringParameters.name || 'World';

  const data = [];
  const randomAmount = (x) => Math.floor(Math.random() * x) + 1;
  const randomDate = (start, end) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );

  const amountOfData = randomAmount(10);

  for (let i = 0; i < amountOfData; i++) {
    data.push({
      temp: randomAmount(100),
      hum: randomAmount(100),
      date: randomDate(new Date(2020, 0, 1), new Date()),
    });
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'json', 'data.json'),
    JSON.stringify(data),
  );

  return {
    statusCode: 200,
    body: `Hello ${subject}!`,
  };
};
