const express = require('express');
const http = require ('http');
const bodyParser = require('body-parser');
const logger = require ('morgan');
const app = express();
const router = require('./router');
const mongoose = require ('mongoose');
const config = require ('./config');

//DB setup
  var options = {
    authMechanism: 'SCRAM-SHA-1'
  }

  var url = 'mongodb://'+config.mongoUser+':'+config.mongoPassword+'@'+config.mongoIp+':'+config.mongoPort+'/'+config.db, options;

mongoose.connect(url, function(err) {
  if(err) {
      console.log('Unable to connect to mongodb. Error:', err);
  	} 
  else {
      console.log('Connected to mongodb!');
    }
});

//App Setup
app.use(logger('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);

//Sever Setup
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
