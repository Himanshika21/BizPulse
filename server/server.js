const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// DASHBOARD API
// ===============================

app.get("/api/dashboard", async (req, res) => {
  try {

    // Get total completed revenue
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS revenue
      FROM transactions
      WHERE status = 'Completed'
    `);

    // Get total customers
    const customerResult = await pool.query(`
      SELECT COUNT(*) AS customers
      FROM customers
    `);

    // Get average transaction
    const averageResult = await pool.query(`
      SELECT COALESCE(AVG(amount), 0) AS average_transaction
      FROM transactions
      WHERE status = 'Completed'
    `);

    // Get monthly revenue
    const monthlyResult = await pool.query(`
      SELECT
        TO_CHAR(transaction_date, 'Mon') AS month,
        SUM(amount) AS revenue
      FROM transactions
      WHERE status = 'Completed'
      GROUP BY
        DATE_TRUNC('month', transaction_date),
        TO_CHAR(transaction_date, 'Mon')
      ORDER BY DATE_TRUNC('month', transaction_date)
    `);

    // Get recent transactions
    const transactionResult = await pool.query(`
      SELECT
        c.name,
        t.category,
        t.amount,
        TO_CHAR(t.transaction_date, 'DD Mon YYYY') AS date,
        t.status
      FROM transactions t
      JOIN customers c
        ON t.customer_id = c.id
      ORDER BY t.transaction_date DESC
    `);

    const revenue = Number(revenueResult.rows[0].revenue);

    const customers = Number(
      customerResult.rows[0].customers
    );

    const averageTransaction = Number(
      averageResult.rows[0].average_transaction
    );


    // Send data to React
    res.json({

      revenue: revenue,

      // Temporary earnings calculation
      earnings: revenue * 0.138,

      customers: customers,

      averageTransaction: averageTransaction,

      // Temporary values
      healthScore: 87,
      revenueGrowth: 12.8,
      earningsGrowth: 8.4,
      customerGrowth: 15.2,


      // Monthly revenue
      monthlyRevenue: monthlyResult.rows.map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
      })),


      // Transactions
      transactions: transactionResult.rows.map((row) => ({
        name: row.name,
        category: row.category,
        amount: Number(row.amount),
        date: row.date,
        status: row.status,
      })),

    });

  } catch (error) {

    console.error("Dashboard error:", error);

    res.status(500).json({
      error: "Failed to load dashboard data",
    });

  }
});


// ===============================
// TRANSACTIONS API
// ===============================

app.get("/api/transactions", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        t.id,
        c.name,
        t.category,
        t.amount,
        TO_CHAR(t.transaction_date, 'DD Mon YYYY') AS date,
        t.status
      FROM transactions t
      JOIN customers c
        ON t.customer_id = c.id
      ORDER BY t.transaction_date DESC
    `);


    res.json(
      result.rows.map((row) => ({

        id: row.id,

        name: row.name,

        category: row.category,

        amount: Number(row.amount),

        date: row.date,

        status: row.status,

      }))
    );


  } catch (error) {

    console.error(
      "Error fetching transactions:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch transactions",
    });

  }

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;
// =================================
// CREATE TRANSACTION
// =================================

app.post("/api/transactions", async (req, res) => {
  try {
    const {
      customerId,
      category,
      amount,
      transactionDate,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO transactions
      (customer_id, category, amount, transaction_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        customerId,
        category,
        amount,
        transactionDate,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create transaction error:", error);

    res.status(500).json({
      error: "Failed to create transaction",
    });
  }
});


// =================================
// DELETE TRANSACTION
// =================================

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM transactions WHERE id = $1",
      [id]
    );

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    res.status(500).json({
      error: "Failed to delete transaction",
    });
  }
});
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      category,
      amount,
      transactionDate,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE transactions
      SET
        customer_id = $1,
        category = $2,
        amount = $3,
        transaction_date = $4,
        status = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        customerId,
        category,
        amount,
        transactionDate,
        status,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({
      error: "Failed to update transaction",
    });
  }
});
// Serve React frontend in production
const frontendPath = path.join(__dirname, "..", "dist");

app.use(express.static(frontendPath));

// React SPA fallback
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`BizPulse server running on port ${PORT}`);
});