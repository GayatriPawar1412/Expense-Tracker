import { useEffect, useState } from "react";
import "./App.css";
import Profile from "./Profile";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:5000/api/transactions";

function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  fetchTransactions();
}, []);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  const addTransaction = async () => {
 if (!title || !amount || Number(amount) <= 0) {
  alert("Please enter a valid title and amount");
  return;
}

  const newTransaction = {
    title: title,
    amount: Number(amount),
    type: type,
    category: category,
    date: new Date().toLocaleDateString("en-GB"),
  };

  try {
    if (editIndex !== null) {
      // Update existing transaction
      const transactionId = transactions[editIndex]._id;

      const response = await fetch(`${API_URL}/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      const updatedTransaction = await response.json();

      if (!response.ok) {
        throw new Error(updatedTransaction.message);
      }

      const updatedTransactions = [...transactions];
      updatedTransactions[editIndex] = updatedTransaction;

      setTransactions(updatedTransactions);
      setEditIndex(null);
    } else {
      // Add new transaction
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      const savedTransaction = await response.json();

      if (!response.ok) {
        throw new Error(savedTransaction.message);
      }

      setTransactions([savedTransaction, ...transactions]);
    }

    setTitle("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
    setShowForm(false);

  } catch (error) {
    console.log("Transaction error:", error);
    alert("Failed to save transaction");
  }
};
  const totalIncome = transactions
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryExpenses = transactions
  .filter((item) => item.type === "Expense")
  .reduce((acc, item) => {
    const category = item.category || "Other";

    acc[category] = (acc[category] || 0) + item.amount;

    return acc;
  }, {});
  const categoryChartData = Object.entries(categoryExpenses).map(
  ([category, amount]) => ({
    name: category,
    value: amount,
  })
);

const incomeExpenseData = [
  {
    name: "Overview",
    Income: totalIncome,
    Expense: totalExpense,
  },
];

  const monthlyBudget = 25000;

const remainingBudget = monthlyBudget - totalExpense;

const budgetPercentage = Math.min(
  (totalExpense / monthlyBudget) * 100,
  100
);

if (loading) {
  return <h2 className="loading">Loading transactions...</h2>;
}

  return (
    <div className="app">
      <header className="navbar">
        <h1>💰 Expense Tracker</h1>

        <button
  className="profile-btn"
  onClick={() => setShowProfile(!showProfile)}
>
  My Profile
</button>
      </header>
      {showProfile ? (
  <Profile />
) : (
  <main className="container">
        <h2>Dashboard</h2>

        <p className="subtitle">
          Track your income and expenses easily.
        </p>

        <div className="summary">
          <div className="card">
            <h3>Total Balance</h3>
            <p>₹{balance.toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <h3>Total Income</h3>
            <p>₹{totalIncome.toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <h3>Total Expense</h3>
            <p>₹{totalExpense.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="content">
          <section className="transactions">
            <div className="section-header">
  <h2>Recent Transactions</h2>

  <button
    className="add-btn"
    onClick={() => setShowForm(!showForm)}
  >
    + Add Transaction
  </button>
</div>

<input
  type="text"
  className="search-input"
  placeholder="🔎 Search transactions..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
<select
  className="filter-select"
  value={filterCategory}
  onChange={(e) => setFilterCategory(e.target.value)}
>
  <option value="All">All Categories</option>
  <option value="Food">Food</option>
  <option value="Shopping">Shopping</option>
  <option value="Travel">Travel</option>
  <option value="Bills">Bills</option>
  <option value="Education">Education</option>
  <option value="Other">Other</option>
</select>

<select
  className="filter-select"
  value={filterMonth}
  onChange={(e) => setFilterMonth(e.target.value)}
>
  <option value="All">All Months</option>
  <option value="09/2026">September 2026</option>
  <option value="10/2026">October 2026</option>
  <option value="11/2026">November 2026</option>
  <option value="12/2026">December 2026</option>
</select>

            {showForm && (
              <div className="form-box">
                <input
                  type="text"
                  placeholder="Transaction title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
                <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
                </select>

                <button
                  className="save-btn"
                  onClick={addTransaction}
                >
                  {editIndex !== null ? "Update Transaction" : "Save Transaction"}
                </button>
              </div>
            )}
             {transactions.length === 0 && (
            <p className="no-transactions">
            No transactions yet. Add your first transaction!
            </p>
            )}

           {transactions
  .filter((transaction) =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((transaction) =>
    filterType === "All" || transaction.type === filterType
  )
  .filter((transaction) =>
  filterCategory === "All" ||
  (transaction.category || "Other") === filterCategory
)
.filter((transaction) => {
  if (filterMonth === "All") {
    return true;
  }

  const parts = transaction.date.split("/");

  if (parts.length !== 3) {
    return false;
  }

  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${month}/${year}` === filterMonth;
})
  .map((transaction, index) => (
             <div className="transaction" key={index}>
             <div>
             <h3>{transaction.title}</h3>
             <p>
             {transaction.category || "Other"} • {transaction.date}
             </p>
             </div>

             <div className="transaction-right">
             <strong
  className={
    transaction.type === "Income"
      ? "income-amount"
      : "expense-amount"
  }
>
  {transaction.type === "Income" ? "+ " : "- "}
  ₹{transaction.amount.toLocaleString("en-IN")}
</strong>

              <button
  className="edit-btn"
  onClick={async () => {
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category || "Food");
    setEditIndex(index);
    setShowForm(true);
  }}
>
  Edit
</button> 

             <button
              className="delete-btn"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this transaction?")) {
               return;
               }
  try {
    await fetch(`${API_URL}/${transaction._id}`, {
      method: "DELETE",
    });

    const updatedTransactions = transactions.filter(
      (_, i) => i !== index
    );

    setTransactions(updatedTransactions);
  } catch (error) {
    console.log("Error deleting transaction:", error);
  }
}}
             >
             Delete
             </button>
             </div>
             </div>
             ))}
          </section>
          <section className="category-summary">
          <h2>Category-wise Expenses</h2>

          <div className="chart-box">
  <h3>Expense Distribution</h3>

  {categoryChartData.length === 0 ? (
    <p>No expense data available.</p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {categoryChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )}
</div>

           {Object.keys(categoryExpenses).length === 0 ? (
           <p>No expense data available.</p>
           ) : (
           Object.entries(categoryExpenses).map(([category, amount]) => (
           <div className="category-item" key={category}>
           <span>{category}</span>
           <strong>₹{amount.toLocaleString("en-IN")}</strong>
           </div>
           ))
           )}
          </section>
           <section className="chart-section">
  <h2>Income vs Expense</h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={incomeExpenseData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar dataKey="Income" />
      <Bar dataKey="Expense" />
    </BarChart>
  </ResponsiveContainer>
</section>
          <section className="budget">
  <h2>Monthly Budget</h2>

  <div className="budget-amount">
    <span>₹{totalExpense.toLocaleString("en-IN")}</span>
    <span>₹{monthlyBudget.toLocaleString("en-IN")}</span>
  </div>

  <div className="progress">
    <div
      className="progress-bar"
      style={{ width: `${budgetPercentage}%` }}
    ></div>
  </div>

  <p>
    ₹{remainingBudget.toLocaleString("en-IN")} remaining
  </p>
</section>
        </div>
      </main>
)}
    </div>
  );
}

export default App;