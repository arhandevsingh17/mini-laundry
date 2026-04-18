const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

app.post("/orders", (req, res) => {
  const { name, phone, items, total } = req.body;

  if (!name || !phone || !items || total <= 0) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const order = {
    id: uuid(),
    name,
    phone,
    items,
    total,
    status: "RECEIVED",
    createdAt: new Date(),
  };

  orders.push(order);
  res.json(order);
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.patch("/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Not found" });

  order.status = status;
  res.json(order);
});

app.get("/dashboard", (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const statusCount = {};
  orders.forEach((o) => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  });

  res.json({ totalOrders, totalRevenue, statusCount });
});

app.listen(5000, () => console.log("Server running on port 5000"));