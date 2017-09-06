let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');

let app = express();

// define conf before defining routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
});
const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
