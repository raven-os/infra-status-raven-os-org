const express = require('express');
const expressEdge = require('express-edge');
const sc = require('status-check');
const url = require('url');

const app = express();
app.use(express.static('public'));
app.use(expressEdge);
app.set('views', `${__dirname}/views`);

app.get('/', (request, response) => {
    sc.testLinkStatus("infra.csv", function (data) {
    //console.log(JSON.stringify(data));
    const status = data;
    for (i = 0; i < status.length; ++i) {
      var url = new URL(status[i].url);
      status[i]["hostname"] = url.hostname;
    }
    console.log(JSON.stringify(status));
    response.render('index', {
      status
    });
  }, true);
});



app.listen(3000, () => {
  console.log("* Running on http://localhost:3000");
});