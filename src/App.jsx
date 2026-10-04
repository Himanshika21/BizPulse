import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

import { Bar as ChartBar } from "react-chartjs-2";
import {
  LayoutDashboard,
  BarChart3,
  WalletCards,
  Users,
  FileText,
  Settings,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  Download,
  CalendarDays,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 145000 },
  { month: "Feb", revenue: 168000 },
  { month: "Mar", revenue: 156000 },
  { month: "Apr", revenue: 198000 },
  { month: "May", revenue: 221000 },
  { month: "Jun", revenue: 245000 },
  { month: "Jul", revenue: 268000 },
  { month: "Aug", revenue: 291000 },
  { month: "Sep", revenue: 278000 },
  { month: "Oct", revenue: 324000 },
];

const categoryData = [
  { name: "Business", value: 42 },
  { name: "Investments", value: 28 },
  { name: "Services", value: 18 },
  { name: "Other", value: 12 },
];

const performanceData = [
  { name: "Business", value: 82 },
  { name: "Investment", value: 67 },
  { name: "Services", value: 91 },
  { name: "Other", value: 54 },
];

const transactions = [
  {
    name: "Aarav Enterprises",
    category: "Business",
    amount: "₹82,000",
    date: "04 Oct 2026",
    status: "Completed",
  },
  {
    name: "Sharma Traders",
    category: "Services",
    amount: "₹64,500",
    date: "03 Oct 2026",
    status: "Completed",
  },
  {
    name: "Verma & Co.",
    category: "Investment",
    amount: "₹1,20,000",
    date: "02 Oct 2026",
    status: "Pending",
  },
  {
    name: "Nova Solutions",
    category: "Business",
    amount: "₹48,750",
    date: "01 Oct 2026",
    status: "Completed",
  },
  {
    name: "Rajput Industries",
    category: "Services",
    amount: "₹95,000",
    date: "30 Sep 2026",
    status: "Completed",
  },
];
function AnalyticsPage({ dashboardData }) {
  const totalRevenue = dashboardData.revenue;
  const totalEarnings = dashboardData.earnings;

  return (
    <section className="content">
      <div className="welcome">
        <div>
          <p className="eyebrow">BUSINESS ANALYTICS</p>
          <h1>Analytics</h1>
          <p className="subtitle">
            Understand your business performance and growth.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Revenue</span>
          <h2>₹{(totalRevenue / 100000).toFixed(2)} L</h2>
          <small>↑ 12.8% from last month</small>
        </div>

        <div className="stat-card">
          <span>Net Earnings</span>
          <h2>₹{(totalEarnings / 100000).toFixed(2)} L</h2>
          <small>↑ 8.4% from last month</small>
        </div>

        <div className="stat-card">
          <span>Customers</span>
          <h2>{dashboardData.customers}</h2>
          <small>↑ 15.2% growth</small>
        </div>

        <div className="stat-card">
          <span>Business Health</span>
          <h2>{dashboardData.healthScore}/100</h2>
          <small>Excellent performance</small>
        </div>
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h2>Monthly Revenue Performance</h2>
        <p className="subtitle" style={{ marginTop: "6px" }}>
          Interactive revenue visualization powered by Chart.js.
        </p>

        <div style={{ height: "360px", marginTop: "24px" }}>
          <RevenueBarChart data={dashboardData.monthlyRevenue || []} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        <div className="card">
          <h2>Performance Insights</h2>

          <div style={{ marginTop: "20px", lineHeight: "2" }}>
            <p>
              <strong>Revenue Growth:</strong>{" "}
              {dashboardData.revenueGrowth}%
            </p>
            <p>
              <strong>Customer Growth:</strong>{" "}
              {dashboardData.customerGrowth}%
            </p>
            <p>
              <strong>Earnings Growth:</strong>{" "}
              {dashboardData.earningsGrowth}%
            </p>
          </div>
        </div>

        <div className="card">
          <h2>Business Summary</h2>

          <div style={{ marginTop: "20px", lineHeight: "2" }}>
            <p>
              The business currently has{" "}
              <strong>{dashboardData.customers}</strong> customers.
            </p>
            <p>
              Average transaction value is{" "}
              <strong>
                ₹
                {dashboardData.averageTransaction.toLocaleString("en-IN")}
              </strong>.
            </p>
            <p>
              Overall business health is{" "}
              <strong>{dashboardData.healthScore}/100</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    customerId: "1",
    category: "Business",
    amount: "",
    transactionDate: "2026-10-05",
    status: "Completed",
  });

  const loadTransactions = () => {
    fetch("http://localhost:5000/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading transactions:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const saveTransaction = async (event) => {
    event.preventDefault();

    const transactionData = {
      customerId: Number(form.customerId),
      category: form.category,
      amount: Number(form.amount),
      transactionDate: form.transactionDate,
      status: form.status,
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/api/transactions/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/transactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          }
        );
      }

      if (response.ok) {
        setShowAddForm(false);
        setEditingId(null);

        setForm({
          customerId: "1",
          category: "Business",
          amount: "",
          transactionDate: "2026-10-05",
          status: "Completed",
        });

        loadTransactions();
      } else {
        alert("Could not save transaction.");
      }
    } catch (error) {
      console.error("Save transaction error:", error);
      alert("Something went wrong.");
    }
  };

  const deleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadTransactions();
      } else {
        alert("Could not delete transaction.");
      }
    } catch (error) {
      console.error("Delete transaction error:", error);
      alert("Something went wrong.");
    }
  };

  const editTransaction = (transaction) => {
    let formattedDate = "2026-10-05";

    try {
      const parsedDate = new Date(transaction.date);

      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toISOString().split("T")[0];
      }
    } catch (error) {
      console.error("Date conversion error:", error);
    }

    setEditingId(transaction.id);

    setForm({
      customerId: "1",
      category: transaction.category,
      amount: transaction.amount.toString(),
      transactionDate: formattedDate,
      status: transaction.status,
    });

    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="content">
        Loading transactions...
      </div>
    );
  }

  return (
    <section className="content">

      <div className="welcome">
        <div>
          <p className="eyebrow">TRANSACTION MANAGEMENT</p>

          <h1>Transactions</h1>

          <p className="subtitle">
            View and manage your business transactions.
          </p>
        </div>

        <button
          className="export-button"
          onClick={() => {
            setShowAddForm(!showAddForm);

            if (showAddForm) {
              setEditingId(null);

              setForm({
                customerId: "1",
                category: "Business",
                amount: "",
                transactionDate: "2026-10-05",
                status: "Completed",
              });
            }
          }}
        >
          + Add Transaction
        </button>
      </div>


      {showAddForm && (
        <div
          className="card"
          style={{ marginBottom: "24px" }}
        >
          <h2>
            {editingId
              ? "Edit Transaction"
              : "Add New Transaction"}
          </h2>

          <form
            onSubmit={saveTransaction}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginTop: "20px",
            }}
          >

            <select
              value={form.customerId}
              onChange={(e) =>
                setForm({
                  ...form,
                  customerId: e.target.value,
                })
              }
              style={{ padding: "12px" }}
            >
              <option value="1">
                Aarav Enterprises
              </option>

              <option value="2">
                Sharma Traders
              </option>

              <option value="3">
                Verma & Co.
              </option>

              <option value="4">
                Nova Solutions
              </option>

              <option value="5">
                Rajput Industries
              </option>
            </select>


            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              style={{ padding: "12px" }}
            >
              <option value="Business">
                Business
              </option>

              <option value="Services">
                Services
              </option>

              <option value="Investment">
                Investment
              </option>
            </select>


            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              required
              style={{ padding: "12px" }}
            />


            <input
              type="date"
              value={form.transactionDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  transactionDate: e.target.value,
                })
              }
              required
              style={{ padding: "12px" }}
            />


            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              style={{ padding: "12px" }}
            >
              <option value="Completed">
                Completed
              </option>

              <option value="Pending">
                Pending
              </option>
            </select>


            <button
              type="submit"
              className="export-button"
            >
              {editingId
                ? "Update Transaction"
                : "Save Transaction"}
            </button>

          </form>
        </div>
      )}


      <div className="card">

        <h2>Recent Transactions</h2>

        <div
          style={{
            overflowX: "auto",
            marginTop: "20px",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>

              <tr>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Customer
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Amount
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {transactions.map((transaction) => (

                <tr key={transaction.id}>

                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {transaction.name}
                  </td>


                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {transaction.category}
                  </td>


                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ₹
                    {transaction.amount.toLocaleString(
                      "en-IN"
                    )}
                  </td>


                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {transaction.date}
                  </td>


                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {transaction.status}
                  </td>


                  <td
                    style={{
                      padding: "14px",
                    }}
                  >

                    <button
                      onClick={() =>
                        editTransaction(transaction)
                      }
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        deleteTransaction(
                          transaction.id
                        )
                      }
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

const pieColors = ["#635bff", "#22c55e", "#f59e0b", "#ec4899"];
function CustomersPage({ dashboardData }) {
  const customers = [
    {
      name: "Aarav Enterprises",
      category: "Business",
      transactions: 12,
      value: 82000,
      status: "Active",
    },
    {
      name: "Sharma Traders",
      category: "Services",
      transactions: 9,
      value: 64500,
      status: "Active",
    },
    {
      name: "Verma & Co.",
      category: "Investment",
      transactions: 7,
      value: 120000,
      status: "Active",
    },
    {
      name: "Nova Solutions",
      category: "Business",
      transactions: 6,
      value: 48750,
      status: "Active",
    },
    {
      name: "Rajput Industries",
      category: "Business",
      transactions: 8,
      value: 95000,
      status: "Active",
    },
  ];

  return (
    <section className="content">
      <div className="welcome">
        <div>
          <p className="eyebrow">CUSTOMER MANAGEMENT</p>
          <h1>Customers</h1>
          <p className="subtitle">
            Manage your business customers and their activity.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Customers</span>
          <h2>{dashboardData.customers}</h2>
          <small>↑ 15.2% growth</small>
        </div>

        <div className="stat-card">
          <span>Active Customers</span>
          <h2>{dashboardData.customers}</h2>
          <small>Currently active</small>
        </div>

        <div className="stat-card">
          <span>Top Customer</span>
          <h2>Verma & Co.</h2>
          <small>₹1,20,000 value</small>
        </div>

        <div className="stat-card">
          <span>Customer Health</span>
          <h2>87%</h2>
          <small>Excellent</small>
        </div>
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h2>Customer Directory</h2>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px" }}>
                  Customer
                </th>
                <th style={{ textAlign: "left", padding: "14px" }}>
                  Category
                </th>
                <th style={{ textAlign: "left", padding: "14px" }}>
                  Transactions
                </th>
                <th style={{ textAlign: "left", padding: "14px" }}>
                  Total Value
                </th>
                <th style={{ textAlign: "left", padding: "14px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name}>
                  <td style={{ padding: "14px", fontWeight: "600" }}>
                    {customer.name}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {customer.category}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {customer.transactions}
                  </td>

                  <td style={{ padding: "14px", fontWeight: "600" }}>
                    ₹{customer.value.toLocaleString("en-IN")}
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "#e8f8ef",
                        color: "#16a34a",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
function ReportsPage({ dashboardData }) {
  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", dashboardData.revenue],
      ["Net Earnings", dashboardData.earnings],
      ["Active Customers", dashboardData.customers],
      ["Average Transaction", dashboardData.averageTransaction],
      ["Business Health", dashboardData.healthScore],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bizpulse-business-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="content">
      <div className="welcome">
        <div>
          <p className="eyebrow">BUSINESS REPORTING</p>
          <h1>Reports</h1>
          <p className="subtitle">
            Generate and export business performance reports.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Revenue</span>
          <h2>₹{(dashboardData.revenue / 100000).toFixed(2)} L</h2>
        </div>

        <div className="stat-card">
          <span>Net Earnings</span>
          <h2>₹{(dashboardData.earnings / 100000).toFixed(2)} L</h2>
        </div>

        <div className="stat-card">
          <span>Customers</span>
          <h2>{dashboardData.customers}</h2>
        </div>

        <div className="stat-card">
          <span>Health Score</span>
          <h2>{dashboardData.healthScore}/100</h2>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: "24px",
          padding: "30px",
        }}
      >
        <h2>Business Performance Report</h2>

        <p style={{ marginTop: "10px", color: "#718096" }}>
          Download a CSV report containing the latest BizPulse business
          performance metrics.
        </p>

        <button
          className="export-button"
          onClick={exportCSV}
          style={{ marginTop: "24px" }}
        >
          <Download size={17} />
          Download CSV Report
        </button>
      </div>
    </section>
  );
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);
function RevenueBarChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.map((item) => item.revenue),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <ChartBar data={chartData} options={options} />;
}
function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

useEffect(() => {
  fetch("http://localhost:5000/api/dashboard")
    .then((response) => response.json())
    .then((data) => {
      setDashboardData(data);
    })
    .catch((error) => {
      console.error("Error loading dashboard:", error);
    });
}, []);
  if (!dashboardData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "Inter, sans-serif",
          color: "#635bff",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading BizPulse...
      </div>
    );
  }
  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>BizPulse</h2>
            <span>Business Intelligence</span>
          </div>
        </div>

        <div className="menu-label">MAIN MENU</div>

        <nav>
          
           <a
  className="nav-item active"
  onClick={() => setActivePage("dashboard")}
>
  <LayoutDashboard size={19} />
  Dashboard
</a>

         <a
  className="nav-item"
  onClick={() => setActivePage("analytics")}
>
  <BarChart3 size={19} />
  Analytics
</a>

          <a
  className="nav-item"
  onClick={() => setActivePage("transactions")}
>
            <WalletCards size={19} />
            Transactions
          </a>

          
            <a
  className="nav-item"
  onClick={() => setActivePage("customers")}
>
  <Users size={19} />
  Customers
</a>

         <a
  className="nav-item"
  onClick={() => setActivePage("reports")}
>
  <FileText size={19} />
  Reports
</a>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item">
            <Settings size={19} />
            Settings
          </a>

          <div className="profile">
            <div className="avatar">HG</div>
            <div>
              <strong>Admin User</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* HEADER */}
        <header className="topbar">
          <div className="mobile-brand">BizPulse</div>

          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search anything..." />
            <span className="shortcut">⌘ K</span>
          </div>

          <div className="top-actions">
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="date-button">
              <CalendarDays size={17} />
              <span>Oct 2026</span>
            </div>
          </div>
        </header>
        {/* PAGE CONTENT */}
{activePage === "transactions" ? (
  <TransactionsPage />
) : activePage === "analytics" ? (
  <AnalyticsPage dashboardData={dashboardData} />
) : activePage === "customers" ? (
  <CustomersPage dashboardData={dashboardData} />
) : activePage === "reports" ? (
  <ReportsPage dashboardData={dashboardData} />
) : (
  <section className="content">
         
          <div className="welcome">
            <div>
              <p className="eyebrow">BUSINESS OVERVIEW</p>
              <h1>Good afternoon 👋</h1>
              <p className="subtitle">
                Here's what's happening with your business today.
              </p>
            </div>

            <button className="export-button">
              <Download size={17} />
              Export Report
            </button>
          </div>

          {/* KPI CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Revenue</span>
                <div className="stat-icon purple">
                  <WalletCards size={19} />
                </div>
              </div>

              <h2>₹{(dashboardData.revenue / 100000).toFixed(2)} L</h2>

              <div className="stat-change positive">
                <TrendingUp size={15} />
                {dashboardData.revenueGrowth}%
                <span>vs last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Net Earnings</span>
                <div className="stat-icon green">
                  <TrendingUp size={19} />
                </div>
              </div>

              <h2>₹{(dashboardData.earnings / 100000).toFixed(2)} L</h2>

              <div className="stat-change positive">
                <TrendingUp size={15} />
                {dashboardData.earningsGrowth}%
                <span>vs last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Active Customers</span>
                <div className="stat-icon orange">
                  <Users size={19} />
                </div>
              </div>

              <h2>{dashboardData.customers.toLocaleString("en-IN")}</h2>

              <div className="stat-change positive">
                <TrendingUp size={15} />
                {dashboardData.customerGrowth}%
                <span>vs last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Avg. Transaction</span>
                <div className="stat-icon pink">
                  <BarChart3 size={19} />
                </div>
              </div>

              <h2>₹{dashboardData.averageTransaction.toLocaleString("en-IN")}</h2>

              <div className="stat-change negative">
                <TrendingDown size={15} />
                2.1%
                <span>vs last month</span>
              </div>
            </div>
          </div>

          {/* CHART ROW */}
          <div className="chart-row">
            <div className="panel revenue-panel">
              <div className="panel-header">
                <div>
                  <h3>Revenue Overview</h3>
                  <p>Monthly revenue performance</p>
                </div>

                <button className="period-button">
                  Last 10 months
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.monthlyRevenue}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#635bff"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="100%"
                          stopColor="#635bff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#edf0f5"
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8992a3", fontSize: 12 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8992a3", fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#635bff"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BUSINESS HEALTH */}
            <div className="panel health-panel">
              <div className="panel-header">
                <div>
                  <h3>Business Health</h3>
                  <p>Overall performance score</p>
                </div>
              </div>

              <div className="health-score">
                <div className="score-circle">
                  <strong>{dashboardData.healthScore}</strong>
                  <span>/ 100</span>
                </div>

                <div className="health-status">
                  <span className="status-pill">Excellent</span>
                  <p>↑ 6.4% from last month</p>
                </div>
              </div>

              <div className="health-bars">
                <div>
                  <div>
                    <span>Revenue Growth</span>
                    <strong>92%</strong>
                  </div>
                  <div className="progress">
                    <span style={{ width: "92%" }}></span>
                  </div>
                </div>

                <div>
                  <div>
                    <span>Customer Growth</span>
                    <strong>81%</strong>
                  </div>
                  <div className="progress">
                    <span style={{ width: "81%" }}></span>
                  </div>
                </div>

                <div>
                  <div>
                    <span>Transaction Activity</span>
                    <strong>86%</strong>
                  </div>
                  <div className="progress">
                    <span style={{ width: "86%" }}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECOND CHART ROW */}
          <div className="chart-row second-row">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Performance by Category</h3>
                  <p>Business distribution</p>
                </div>
              </div>

              <div className="category-content">
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pie-center">
                    <strong>100%</strong>
                    <span>Total</span>
                  </div>
                </div>

                <div className="legend">
                  {categoryData.map((item, index) => (
                    <div className="legend-item" key={item.name}>
                      <div>
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: pieColors[index],
                          }}
                        ></span>
                        {item.name}
                      </div>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Performance Index</h3>
                  <p>Performance by business segment</p>
                </div>
              </div>

              <div className="bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#edf0f5"
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8992a3", fontSize: 11 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8992a3", fontSize: 11 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#635bff"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="panel transactions-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Transactions</h3>
                <p>Latest business activity</p>
              </div>

              <button className="view-all">
                View all
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer / Client</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "left", padding: "14px" }}>
  Action
</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.transactions.map((transaction) => (
                    <tr key={transaction.name}>
                      <td>
                        <div className="customer">
                          <div className="customer-avatar">
                            {transaction.name.charAt(0)}
                          </div>
                          <strong>{transaction.name}</strong>
                        </div>
                      </td>

                      <td>{transaction.category}</td>

                      <td className="amount">{transaction.amount}</td>

                      <td>{transaction.date}</td>

                      <td>
                        <span
                          className={`status ${
                            transaction.status === "Completed"
                              ? "completed"
                              : "pending"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer>
            <span>© 2026 BizPulse Analytics</span>
            <span>Business Intelligence Dashboard</span>
          </footer>
</section>
)}
</main>
    </div>
  );
}

export default App;
