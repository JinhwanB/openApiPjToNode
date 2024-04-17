const db = require('./database/connect/mariaDBConn');
const path = require('path');
const express = require('express');
const wifiService = require('./service/WifiService');
const app = express();
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', async (req: any, res: any) => {
  const cnt = await wifiService();
  console.log(cnt);
});

app.listen(port, () => {
  console.log('server open', port);
});
