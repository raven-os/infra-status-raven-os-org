const express = require('express');
const expressEdge = require('express-edge');
const sc = require('./controllers/status-check-override');

const app = express();
app.use(express.static('public'));
app.use(expressEdge);
app.set('views', `${__dirname}/views`);

function checkStatus(callback) {
  sc.testLinkStatus("./csv/community.csv", function (community) {
    for (i = 0; i < community.length; ++i) {
      var url = new URL(community[i].url);
      community[i]["hostname"] = url.hostname;
    }
    sc.testLinkStatus("./csv/nest.csv", function (nest) {
      for (i = 0; i < nest.length; ++i) {
        var url = new URL(nest[i].url);
        nest[i]["hostname"] = url.hostname;
      }
      sc.testLinkStatus("./csv/dev.csv", function (dev) {
        for (i = 0; i < dev.length; ++i) {
          var url = new URL(dev[i].url);
          dev[i]["hostname"] = url.hostname;
        }
        return callback(community, nest, dev);
      });
    });
  });
}

app.get('/', (request, response) => {
  checkStatus(function (community, nest, dev) {
    response.render('index', {
      community,
      nest,
      dev
    });
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log("* Running on http://localhost:3000");
});