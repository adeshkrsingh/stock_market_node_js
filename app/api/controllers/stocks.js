const stocksModel = require('../models/stocks');
const stocksArchievesModel = require('../models/stocks_archieves');
var moment = require('moment');
moment().format();


module.exports = {
    test: function (req, res, next) {
    },
    getAllStocksArchieved: function (req, res, next) {

        var sort = req.query.sort;
        if (sort === undefined) { sort = -1; }

        var limit = req.query.limit;
        if (limit === undefined) { limit = 0; }

        var start = req.query.start;
        if (start === undefined) { start = 0; }


        stocksArchievesModel.find(
            {},
            {},
            { sort: { '_id': sort }, skip: Number(start), limit: Number(limit) }, function (err, rowData) {
                if (err) {
                    console.log(err)
                    res.json({ status: "failled", message: "Error Encountered", data: null });
                }
            })
            .then(function (result) {
                res.json({ status: "success", message: "success message", data: result });
            })
            .catch(function (err) {
                res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                return [];
            });
    },
    getAllStocks: function (req, res, next) {
        var sort = req.query.sort;
        if (sort === undefined) { sort = -1; }

        var limit = req.query.limit;
        if (limit === undefined) { limit = 0; }

        var start = req.query.start;
        if (start === undefined) { start = 0; }


        stocksModel.find(
            {},
            {},
            { sort: { '_id': sort }, skip: Number(start), limit: Number(limit) }, function (err, rowData) {
                if (err) {
                    console.log(err)
                    res.json({ status: "failled", message: "Error Encountered", data: null });
                }
            })
            .then(function (result) {
                res.json({ status: "success", message: "success message", data: result });
            })
            .catch(function (err) {
                res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                return [];
            });
    },
    companySearch: function (req, res, next) {

        var Name = req.query.Name;
        if (Name === undefined) { Name = 0; }

        // var querry = {
        //     Name: 'Willis Towers Watson Public Limited Company'
        // }

        var querry = {
            Name: Name
        }

        stocksModel.aggregate([
            { $match: querry, },

            {
                $lookup: {
                    from: "stocks_archieves",
                    localField: "Symbol",
                    foreignField: "symbol",
                    as: "details"
                },
            },
            
        ],
            function (err, result) {

                if (err) {
                    return reject(err);
                }
                if (!result) { return reject(false); }
                else {
                    res.json({ status: "success", message: "success message", data: result });
                }
            }
        );
    },
    timeFrame: function (req, res, next) {
        var startDate = req.query.startDate;
        if (startDate === undefined) {
            startDate = moment('1980-01-01').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        } else {
            startDate = moment(startDate).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }


        var endDate = req.query.endDate;
        if (endDate === undefined) {
            endDate = moment('2030-01-01').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        } else {
            endDate = moment(endDate).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }

        var limit = req.query.limit;
        if (limit === undefined) { limit = 10; }

        stocksArchievesModel.find(
            {
                "date": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate)
                }
            },
            {  },
            { sort: { 'volume': -1 }, limit: Number(limit) }, function (err, rowData) {
                if (err) {
                    console.log(err)
                    res.json({ status: "failled", message: "Error Encountered", data: null });
                }
            })
            .then(function (top10High) {
                stocksArchievesModel.find(
                    {}, {},
                    { sort: { 'volume': 1 }, limit: Number(limit) }, function (err, rowData) {
                        if (err) {
                            console.log(err)
                            res.json({ status: "failled", message: "Error Encountered", data: null });
                        }
                    })
                    .then(function (top10Low) {
                        res.json({
                            status: "success",
                            message: "success message",
                            data: [{
                                top10High: top10High,
                                top10Low: top10Low
                            }]
                        });
                    })
                    .catch(function (err) {
                        res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                        return [];
                    });
            })
            .catch(function (err) {
                res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                return [];
            });
    },
    stocksInTime: function (req, res, next) {
        var startDate = req.query.startDate;
        if (startDate === undefined) {
            startDate = moment('1980-01-01').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        } else {
            startDate = moment(startDate).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }


        var endDate = req.query.endDate;
        if (endDate === undefined) {
            endDate = moment('2030-01-01').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        } else {
            endDate = moment(endDate).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }

        var limit = req.query.limit;
        if (limit === undefined) { limit = 10; }

        var listArray = ['AEP', 'WLTW'];

        stocksArchievesModel.find(
            {
                "date": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate)
                },
                "symbol" : {
                    $in : listArray,
                }
            },
            {  },
            { sort: { 'volume': -1 }, limit: Number(limit) }, function (err, rowData) {
                if (err) {
                    console.log(err)
                    res.json({ status: "failled", message: "Error Encountered", data: null });
                }
            })
            .then(function (top10High) {
                stocksArchievesModel.find(
                    {
                        "date": {
                            $gt: new Date(startDate),
                            $lt: new Date(endDate)
                        },
                        "symbol" : {
                            $in : listArray,
                        }
                    }, {},
                    { sort: { 'volume': 1 }, limit: Number(limit) }, function (err, rowData) {
                        if (err) {
                            console.log(err)
                            res.json({ status: "failled", message: "Error Encountered", data: null });
                        }
                    })
                    .then(function (top10Low) {
                        res.json({
                            status: "success",
                            message: "success message",
                            data: [{
                                top10High: top10High,
                                top10Low: top10Low
                            }]
                        });
                    })
                    .catch(function (err) {
                        res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                        return [];
                    });
            })
            .catch(function (err) {
                res.json({ status: "failled", message: "Error Encountered...Catched" + err, data: null });
                return [];
            });
    },
    tickerSearch: function (req, res, next) {
        //
    }
}
