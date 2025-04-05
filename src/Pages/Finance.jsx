import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subMonths } from "date-fns";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/Finance.css";
import {
  Plus,
  X,
  DollarSign,
  CreditCard,
  Tag,
  Calendar,
  FileText,
  ArrowUp,
  ArrowDown,
  Filter,
  Trash2,
} from "lucide-react";

const Finance = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("month");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [categories, setCategories] = useState({
    income: [],
    expense: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("income");
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    name: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    type: "income",
  });
  const [studentEmail, setStudentEmail] = useState("");
  const [clubId, setClubId] = useState("");
  const [token, setToken] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  // Fetch token and club details
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
        setClubId(decoded.club_id);
        setToken(token);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  // Fetch transactions function (now defined outside useEffect)
  const fetchTransactions = useCallback(async () => {
    if (!token || !clubId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://43.205.202.255:5000/finance/get_transactions?club_id=${clubId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      if (data.transactions) {
        const fetchedTransactions = data.transactions.map((t) => ({
          id: t.ID, // Using the actual database ID
          date: new Date(t.Date).toISOString().split("T")[0],
          name: t.Name,
          description: t.Description,
          category: t["Category Name"],
          amount: parseFloat(t.Amount),
          type: t["Transaction Type"].toLowerCase(),
        }));
        console.log(fetchedTransactions);
        setTransactions(fetchedTransactions);

        const incomeCategories = [...new Set(
          fetchedTransactions
            .filter((t) => t.type === "income")
            .map((t) => t.category)
        )];
        const expenseCategories = [...new Set(
          fetchedTransactions
            .filter((t) => t.type === "expense")
            .map((t) => t.category)
        )];
        setCategories({ income: incomeCategories, expense: expenseCategories });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [token, clubId]);

  // Call fetchTransactions when component mounts or dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Sort and filter transactions
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredTransactions = showAllTransactions
    ? sortedTransactions
    : sortedTransactions.filter(
        (t) => new Date(t.date) >= subMonths(new Date(), 24)
      );

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Filter transactions based on selected time period
  const getFilteredTransactions = () => {
    const today = new Date();
    const filterDate =
      timeFilter === "month"
        ? subMonths(today, 1)
        : timeFilter === "quarter"
        ? subMonths(today, 3)
        : subMonths(today, 12);

    return transactions.filter((t) => new Date(t.date) >= filterDate);
  };

  // Calculate summary data
  const getSummaryData = () => {
    const filteredTransactions = getFilteredTransactions();
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Prepare bar chart data
  const getBarChartData = () => {
    const last6Months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthLabel = format(month, "MMM yy");

      const monthIncome = transactions
        .filter(
          (t) =>
            t.type === "income" &&
            format(new Date(t.date), "MMM yy") === monthLabel
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpense = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            format(new Date(t.date), "MMM yy") === monthLabel
        )
        .reduce((sum, t) => sum + t.amount, 0);

      last6Months.push({
        month: monthLabel,
        Income: monthIncome,
        Expenses: monthExpense,
      });
    }

    return last6Months;
  };

  // Prepare pie chart data
  const getPieChartData = (type) => {
    const data = [];
    const last6Months = subMonths(new Date(), 6);
    const categoryList =
      type === "income" ? categories.income : categories.expense;

    categoryList.forEach((category) => {
      const amount = transactions
        .filter(
          (t) =>
            t.type === type &&
            t.category === category &&
            new Date(t.date) >= last6Months
        )
        .reduce((sum, t) => sum + t.amount, 0);

      if (amount > 0) {
        data.push({
          name: category,
          value: amount,
        });
      }
    });

    return data;
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const payload = {
      transaction_type: newCategoryType,
      club_id: clubId,
      category_name: newCategory
    };

    try {
      const response = await fetch('http://43.205.202.255:5000/finance/insert_category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (1) {
        // Refresh categories and transactions
        await fetchTransactions();
        setNewCategory("");
        alert('Category added successfully');
      } else {
        console.error('Error adding category:', result.error);
        alert('Failed to add category: ' + result.error);
      }
    } catch (error) {
      console.error('Error making API request:', error);
      alert('Failed to add category');
    }
  };

  // Handle transaction input changes
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
      type: transactionType,
    });
  };

  // Add new transaction
  const handleAddTransaction = async () => {
    if (
      !newTransaction.amount ||
      !newTransaction.name ||
      !newTransaction.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const transactionData = {
        "Date": newTransaction.date,
        "Name": newTransaction.name,
        "Description": newTransaction.description,
        "Amount": parseFloat(newTransaction.amount),
        "Transaction Type": newTransaction.type,
        "Category Name": newTransaction.category,
        "club_id": clubId,
      };

      const response = await fetch(
        "http://43.205.202.255:5000/finance/insert_transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.message === "Transaction successfully inserted.") {
        // Refresh transactions instead of local state update
        await fetchTransactions();
        setNewTransaction({
          amount: "",
          name: "",
          date: format(new Date(), "yyyy-MM-dd"),
          description: "",
          category: "",
          type: transactionType,
        });
        setShowAddTransaction(false);
        setCurrentPage(1);
        alert("Transaction added successfully");
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  // Delete transaction function
  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    console.log(transactionId);

    setDeletingId(transactionId);
    
    try {
      const response = await fetch(
        `http://43.205.202.255:5000/finance/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: transactionId, // Using the correct field name
            club_id: clubId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (1) {
        // Refresh transactions instead of local state update
        await fetchTransactions();
        alert("Transaction deleted successfully!");
      } else {
        alert("Failed to delete transaction: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  const { income, expense, balance } = getSummaryData();
  const INCOME_COLORS = ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#03A9F4"];
  const EXPENSE_COLORS = ["#FF5722", "#F44336", "#E91E63", "#9C27B0", "#673AB7"];

  return (
    <div className="view-events-container">
      <AdminSidebar />
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Financial Dashboard</h1>
          <button
            className="add-transaction-btn"
            onClick={() => setShowAddTransaction(true)}
          >
            <Plus size={20} /> Add Transaction
          </button>
        </header>

        <section className="financial-summary">
          <div className="summary-filter">
            <span className="filter-label">
              <Filter size={16} /> Filter by:
            </span>
            <div className="filter-options">
              <button
                className={timeFilter === "month" ? "active" : ""}
                onClick={() => setTimeFilter("month")}
              >
                Month
              </button>
              <button
                className={timeFilter === "quarter" ? "active" : ""}
                onClick={() => setTimeFilter("quarter")}
              >
                Quarter
              </button>
              <button
                className={timeFilter === "year" ? "active" : ""}
                onClick={() => setTimeFilter("year")}
              >
                Year
              </button>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card income">
              <div className="card-icon">
                <ArrowUp size={24} />
              </div>
              <div className="card-details">
                <h3>Total Income</h3>
                <p className="amount">{formatCurrency(income)}</p>
              </div>
            </div>

            <div className="summary-card expense">
              <div className="card-icon">
                <ArrowDown size={24} />
              </div>
              <div className="card-details">
                <h3>Total Expenses</h3>
                <p className="amount">{formatCurrency(expense)}</p>
              </div>
            </div>

            <div className="summary-card balance">
              <div className="card-icon">
                <DollarSign size={24} />
              </div>
              <div className="card-details">
                <h3>Balance</h3>
                <p className="amount">{formatCurrency(balance)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="data-visualization">
          <div className="bar-chart-container">
            <h2>Income vs. Expenses (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getBarChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Income" fill="#4CAF50" />
                <Bar dataKey="Expenses" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-charts-container">
            <div className="pie-chart">
              <h2>Income by Category (Last 6 Months)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getPieChartData("income")}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getPieChartData("income").map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pie-chart">
              <h2>Expenses by Category</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getPieChartData("expense")}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getPieChartData("expense").map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="transactions-categories">
          <div className="transactions-container">
            <div className="transaction-header">
              <h2>Recent Transactions</h2>
              <button
                className="toggle-transactions-btn"
                onClick={() => setShowAllTransactions(!showAllTransactions)}
              >
                {showAllTransactions ? "Show Recent Only" : "Show All Transactions"}
              </button>
            </div>
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className={transaction.type}>
                      <td>{format(new Date(transaction.date), "MMM dd, yyyy")}</td>
                      <td>
                        <div className="transaction-name">{transaction.name}</div>
                        <div className="transaction-description">
                          {transaction.description}
                        </div>
                      </td>
                      <td>{transaction.category}</td>
                      <td className={`amount ${transaction.type}`}>
                        {transaction.type === "income" ? "+" : "-"}{" "}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          disabled={deletingId === transaction.id}
                        >
                          {deletingId === transaction.id ? (
                            "Deleting..."
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length > transactionsPerPage && (
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="categories-container">
            <h2>Categories</h2>
            <div className="category-tabs">
              <button
                className={newCategoryType === "income" ? "active" : ""}
                onClick={() => setNewCategoryType("income")}
              >
                Income
              </button>
              <button
                className={newCategoryType === "expense" ? "active" : ""}
                onClick={() => setNewCategoryType("expense")}
              >
                Expense
              </button>
            </div>

            <div className="category-list">
              {categories[newCategoryType].map((category) => (
                <div key={category} className="category-item">
                  <Tag size={16} />
                  <span>{category}</span>
                </div>
              ))}
            </div>

            <div className="add-category">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
              />
              <button onClick={handleAddCategory}>Add</button>
            </div>
          </div>
        </section>

        {showAddTransaction && (
          <div className="modal-overlay">
            <div className="add-transaction-modal">
              <div className="modal-header">
                <h2>Add Transaction</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowAddTransaction(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="transaction-type-tabs">
                <button
                  className={transactionType === "income" ? "active" : ""}
                  onClick={() => setTransactionType("income")}
                >
                  <ArrowUp size={16} /> Income
                </button>
                <button
                  className={transactionType === "expense" ? "active" : ""}
                  onClick={() => setTransactionType("expense")}
                >
                  <ArrowDown size={16} /> Expense
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <DollarSign size={16} /> Amount*
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleTransactionChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <CreditCard size={16} /> Transaction Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newTransaction.name}
                    onChange={handleTransactionChange}
                    placeholder="Enter transaction name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} /> Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleTransactionChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Tag size={16} /> Category*
                  </label>
                  <select
                    name="category"
                    value={newTransaction.category}
                    onChange={handleTransactionChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories[transactionType].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <FileText size={16} /> Description
                  </label>
                  <textarea
                    name="description"
                    value={newTransaction.description}
                    onChange={handleTransactionChange}
                    placeholder="Enter description"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setShowAddTransaction(false)}
                >
                  Cancel
                </button>
                <button className="add-btn" onClick={handleAddTransaction}>
                  Add {transactionType === "income" ? "Income" : "Expense"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;