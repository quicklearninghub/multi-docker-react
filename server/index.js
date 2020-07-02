const keys = require('./keys');

// EXPRESS APP SETUP
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POSTGRES CLIENT SETUP
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPORT
});

pgClient.on('connect', () => {
    pgClient
      .query('CREATE TABLE IF NOT EXISTS VALUES (number INT)')
      .catch((err) => console.log(err));
  });

// REDIS CLIENT SETUP
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// EXPRESS ROUTE HANDLER
app.get('/', (req, res) => {
    res.send("HI");
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM VALUES');
    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 20) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO VALUES(number) VALUES($1)', [index]);
    res.send({ working: true });
})

app.listen(5000, err=> {
    console.log('Listening');
})