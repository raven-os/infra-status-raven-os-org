const express = require('express');
const expressEdge = require('express-edge');
const sc = require('./controllers/status-check-override');

const app = express();
app.use(express.static('public'));
app.use(expressEdge);
app.set('views', `${__dirname}/views`);

function checkStatus(callback) {
  sc.testLinkStatus("infra.csv", function (data) {
    for (i = 0; i < data.length; ++i) {
      var url = new URL(data[i].url);
      data[i]["hostname"] = url.hostname;
    }
    console.log(JSON.stringify(data));
    return callback(data);
  });
}

app.get('/', (request, response) => {
  checkStatus(function (data) {
    response.render('index', {
      data
    });
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/*process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node docs)
})*/


app.listen(3000, () => {
  console.log("* Running on http://localhost:3000");
});