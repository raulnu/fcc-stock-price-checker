"use strict";
const StockModel = require("../models").Stock;

async function createStock(stock, like, ip) {
  const newStock = new StockModel({
    stock: String(stock),
    likes: like === "true" ? [ip] : [],
  });
  const savedNew = await newStock.save();
  return savedNew;
}

async function findStock(stock) {
  return await StockModel.findOne({ stock }).exec();
}

async function saveStock(stock, like, ip) {
  let saved = {};
  const foundStock = await findStock(stock);
  if (!foundStock) {
    const createsaved = await createStock(stock, like, ip);
    saved = createsaved;
    return saved;
  } else {
    if (like && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}

async function getStock(stock) {
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const { stockName, latestPrice } = await response.json();
  return { stock, latestPrice };
}

module.exports = function (app) {
  //https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote

  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    if (Array.isArray(stock)) {
      const stockInfo1 = await getStock(stock[0]);
      const stockInfo2 = await getStock(stock[1]);

      const firstStock = await saveStock(stock[0], like, req.ip);
      const secondStock = await saveStock(stock[1], like, req.ip);

      let stocks = [];
      if (!stockInfo1.stock) {
        stocks.push({
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      } else {
        stocks.push({
          stock: stockInfo1.stock,
          price: stockInfo1.latestPrice,
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      }

      if (!stockInfo2.stock) {
        stocks.push({
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      } else {
        stocks.push({
          stock: stockInfo2.stock,
          price: stockInfo2.latestPrice,
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      }
      res.json({ stockData: stocks });
      return;
    }
    const stockInfo = await getStock(stock);
    if (!stockInfo.stock) {
      res.json({ stockData: { likes: like ? 1 : 0 } });
      return;
    }
    const oneStockData = await saveStock(stockInfo.stock, like, req.ip);
    res.json({
      stockData: {
        stock: stockInfo.stock,
        price: stockInfo.latestPrice,
        likes: oneStockData.likes.length,
      },
    });
  });
};
