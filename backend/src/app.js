const express = require("express");
const path = require('path');

const PORT = process.env.PORT | 8080;
const app = express();

var boardService = require('./board');
var issueService = require('./issue');
var bodyParser = require('body-parser');

app.use('/', express.static( path.join(__dirname, '../public')));
app.use(bodyParser.json()); // for parsing application/json
app.use('/api/boards', boardService);
app.use('/api/issues', issueService);

app.listen(PORT, () => console.log("Listening on port "+PORT));