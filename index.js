'use strict';
const PORT = 9090;
const HOST = '0.0.0.0';

const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});