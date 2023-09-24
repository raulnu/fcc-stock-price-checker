const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .set("content-type", "application/json")
      .query({ stock: "TSLA" })
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'TSLA')
        assert.equal(res.status, 200)
        assert.exists(res.body.stockData.price, 'TSLA has a price')
      })
    done();
  })
  test('Viewing one stock and liking it', function(done) {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .set("content-type", "application/json")
      .query({ stock: "GOLD", like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData.stock, 'GOLD')
        assert.equal(res.body.stockData.likes, 1)
        assert.exists(res.body.stockData.price, 'GOLD has a price')
      })
    done();
  })
  test('Viewing the same stock and liking it again', function(done) {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .set("content-type", "application/json")
      .query({ stock: "GOLD", like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData.stock, 'GOLD')
        assert.equal(res.body.stockData.likes, 1)
        assert.exists(res.body.stockData.price, 'GOLD has a price')
      })
    done();
  })
  test('Viewing two stocks', function(done) {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .set("content-type", "application/json")
      .query({ stock: ["AMZN", "T"] })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData[0].stock, 'AMZN')
        assert.equal(res.body.stockData[1].stock, 'T')
        assert.exists(res.body.stockData[0].price, 'AMZN has a price')
        assert.exists(res.body.stockData[1].price, 'T has a price')
      })
    done();
  })
  test('Viewing two stocks and liking them', function(done) {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .set("content-type", "application/json")
      .query({ stock: ["AMZN", "T"], like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData[0].stock, 'AMZN')
        assert.equal(res.body.stockData[1].stock, 'T')
        assert.exists(res.body.stockData[0].price, 'TSLA has a price')
        assert.exists(res.body.stockData[1].price, 'T has a price')
        assert.exists(res.body.stockData[0].rel_likes, 'has rel_likes')
        assert.exists(res.body.stockData[1].rel_likes, 'has rel_likes')
      })
    done();
  })
})
