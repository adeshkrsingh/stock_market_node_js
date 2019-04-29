const express = require('express');
const router = express.Router();
const stocksController = require('../app/api/controllers/stocks');


router.get('/', stocksController.test);
router.get('/getAllStocksArchieved', stocksController.getAllStocksArchieved);
router.get('/getAllStocks', stocksController.getAllStocks);
router.get('/companySearch', stocksController.companySearch);
router.get('/timeFrame', stocksController.timeFrame);
router.get('/stocksInTime', stocksController.stocksInTime);
router.get('/tickerSearch', stocksController.tickerSearch);




module.exports = router;