var express = require('express');
var router = express.Router();
var ProductModel = require('./../models/product').ProductModel

/* GET home page. */
router.get('/products/:name/:limit?', function(req, res, next) {

  var Crawler = require("crawler")
    products = [],
    cheapest = false,
    fullUrl = 'https://lista.mercadolivre.com.br/' + req.params.name,
    limit = req.params.limit || 10

  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    /*callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
      }
      done();
    }*/
  });

  // Queue URLs with custom callbacks & parameters
  c.queue([{
    uri: fullUrl,
    jQuery: true,

    // The global callback won't be called
    callback: function (error, crawlerRes, done) {

      res.setHeader('Content-Type', 'application/json');

      if (error) {

        res.end(JSON.stringify({
          Application: 'Mundiale Crawler API test',
          Error: error
        }))

      } else {
        var $ = crawlerRes.$

        var itemBlock = Array.from($('.item__info '))

        products = itemBlock.map(p => {

          var parent = Array.from($(p).parent())

          var price = $(p).find('.item__price ')
            .text()
            .trim()
            .replace('R$ ', '')
            .replace(' ', ',')

          cheapest = (!cheapest)? price
            : (price < cheapest)?
              price
              : cheapest

          return {
            'Name': $(p).find('.item__title').text().trim(),
            'Link': parent.filter(p => p.type === 'tag' && p.name === 'a').map(p => p.attribs.href),
            'State': $(p).find('.item__status').text().trim(),
            'Price': 'R$ ' + price
          }
        })

        res.end(JSON.stringify({
          Application: 'Mundiale Crawler API test',
          CheapestProduct: cheapest? `R$ ${cheapest}` : '' || '',
          Products: products || []
        }))

      }
      done();
    }
  }]);



});

module.exports = router;
