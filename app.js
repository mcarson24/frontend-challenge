const express = require('express');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/getAddress/:address', async (req, response) => {
  let addressData = '';
  https.get(
    `https://api.geocod.io/v1.4/geocode?api_key=${process.env.GEOCODIOAPIKEY}&fields=&q=${req.params.address},+Philadelphia,+PA`,
    res => {
      res
        .on("data", chunk => {
          addressData += chunk;
        })
        .on("end", () => {
          response.json(JSON.parse(addressData));
        })
        .on("error", err => {
          console.error(err.message);
        });
    }
  );
})

app.listen(3030, () => console.log('http://localhost:3030'));
