const express = require("express");
const router = express.Router();
const axios = require("axios");
const Transaction = require("../models/Transaction");

// Initialize Database
router.get("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    console.log("Database initialized successfully");
    res.json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Error initializing database" });
  }
});

// Get Transactions
router.get("/transactions", async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;

  const startDate = new Date(`${month}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const query = { dateOfSale: { $gte: startDate, $lt: endDate } };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: isNaN(search) ? null : parseFloat(search) },
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Get Statistics
router.get("/statistics", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const query = { dateOfSale: { $gte: startDate, $lt: endDate } };

  try {
    const [totalSaleAmount] = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const soldItems = await Transaction.countDocuments({
      ...query,
      sold: true,
    });
    const notSoldItems = await Transaction.countDocuments({
      ...query,
      sold: false,
    });

    const statistics = {
      totalSaleAmount: totalSaleAmount ? totalSaleAmount.total : 0,
      soldItems,
      notSoldItems,
    };
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
});

// Get Bar Chart Data
router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const query = { dateOfSale: { $gte: startDate, $lt: endDate } };
  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {
    const barChartData = await Promise.all(
      ranges.map(async (range) => {
        const count = await Transaction.countDocuments({
          ...query,
          price: { $gte: range.min, $lte: range.max },
        });
        return {
          range: `${range.min} - ${range.max === Infinity ? "above" : range.max
            }`,
          count,
        };
      })
    );
    res.json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Error fetching bar chart data" });
  }
});

// Get Pie Chart Data
router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const query = { dateOfSale: { $gte: startDate, $lt: endDate } };

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);
    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Error fetching pie chart data" });
  }
});

// Get Combined Data
router.get("/combined-data", async (req, res) => {
  const { month } = req.query;
  try {
    const [transactions, statistics, barChartData, pieChartData] =
      await Promise.all([
        Transaction.find({
          dateOfSale: {
            $gte: new Date(`${month}-01T00:00:00.000Z`),
            $lt: new Date(
              new Date(`${month}-01T00:00:00.000Z`).setMonth(
                new Date(`${month}-01T00:00:00.000Z`).getMonth() + 1
              )
            ),
          },
        }).limit(10),
        axios
          .get(
            `http://localhost:${process.env.PORT || 4000
            }/api/statistics?month=${month}`
          )
          .then((response) => response.data),
        axios
          .get(
            `http://localhost:${process.env.PORT || 4000
            }/api/bar-chart?month=${month}`
          )
          .then((response) => response.data),
        axios
          .get(
            `http://localhost:${process.env.PORT || 4000
            }/api/pie-chart?month=${month}`
          )
          .then((response) => response.data),
      ]);

    const combinedData = {
      transactions,
      statistics,
      barChartData,
      pieChartData,
    };
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: "Error fetching combined data" });
  }
});

module.exports = router;
