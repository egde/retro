const express = require("express");

const PORT = process.env.PORT;
const app = express();

var boardService = require('./board');
var issueService = require('./issue');
var bodyParser = require('body-parser');

app.use('/', express.static('../public'));
app.use(bodyParser.json()); // for parsing application/json
app.use('/api/boards', boardService);
app.use('/api/issues', issueService);

app.listen(PORT, () => console.log("Listening on port "+PORT));