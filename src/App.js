import React, { useEffect, useState } from "react";
import Card from "./components/Cards/Card";
import Chart from "./components/PieChart/PieChart";
import ExpenseModal from "./components/Modals/AddExpensesModal";
import "./App.css";
import RecentTransactions from "./components/RecentTransactions/RecentTransactions";
import TopTransactions from "./components/TopTransactions/TopTransactions";
import BalanceModal from "./components/Modals/BalanceModal";
import Pill from "./components/Pills/Pill";

function App() {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem("balance");
    return savedBalance ? parseInt(savedBalance, 10) : 5000;
  });

  const [heading, setHeading] = useState("Add Expense");
  const [totalExpenses, setTotalExpenses] = useState(() => {
    const savedExpense = localStorage.getItem("totalExpense");
    return savedExpense ? parseInt(savedExpense, 10) : 0;
  });
  const [expensesArray, setExpensesArray] = useState(() => {
    const savedExpenses = localStorage.getItem("expensesArray");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isBalanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null); 
  const [editingIndex, setEditingIndex] = useState(null); 

  const handleAddExpense = (expenseData) => {
    const { price } = expenseData;

    if (parseFloat(price) > balance) {
      alert(
        "Insufficient balance! You cannot add an expense that exceeds the current balance."
      );
      return; 
    }

    if (expenseToEdit !== null) {
      const updatedExpensesArray = [...expensesArray];
      updatedExpensesArray[editingIndex] = expenseData;
      setExpensesArray(updatedExpensesArray);
      localStorage.setItem(
        "expensesArray",
        JSON.stringify(updatedExpensesArray)
      );
      setExpenseToEdit(null);
    } else {
      const newTotalExpenses = totalExpenses + parseFloat(price);
      setTotalExpenses(newTotalExpenses);
      localStorage.setItem("totalExpense", newTotalExpenses);

      const newBalance = balance - parseFloat(price);
      setBalance(newBalance);
      localStorage.setItem("balance", newBalance);

      const updatedExpensesArray = [...expensesArray, expenseData];
      setExpensesArray(updatedExpensesArray);
      localStorage.setItem(
        "expensesArray",
        JSON.stringify(updatedExpensesArray)
      );
    }

    setExpenseModalOpen(false);
    setExpenseToEdit(null);
  };

  const openEditModal = (expense, index) => {
    setHeading("Edit Expense");
    setExpenseToEdit(expense); 
    setEditingIndex(index); 
    setExpenseModalOpen(true); 
  };

  const handleAddIncome = (incomeAmount) => {
    const newBalance = balance + incomeAmount;
    setBalance(newBalance);
    localStorage.setItem("balance", newBalance); 
    setBalanceModalOpen(false); 
  };

  const handleDeleteExpense = (index) => {
    const expenseToDelete = expensesArray[index];

    const updatedExpenses = [...expensesArray];
    updatedExpenses.splice(index, 1);
    setExpensesArray(updatedExpenses);
    localStorage.setItem("expensesArray", JSON.stringify(updatedExpenses));

    const totalExpense = updatedExpenses.reduce(
      (acc, expense) => acc + parseFloat(expense.price),
      0
    );
    setTotalExpenses(totalExpense);
    localStorage.setItem("totalExpense", totalExpense);

    const newBalance = balance + parseFloat(expenseToDelete.price);
    setBalance(newBalance);
    localStorage.setItem("balance", newBalance);
  };

  useEffect(() => {
    console.log("Balance changed:", balance);
    console.log("Total expenses changed:", totalExpenses);
    console.log("Expenses array:", expensesArray);
  }, [balance, totalExpenses, expensesArray]);

  return (
    <div className="App">
      <p
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "white",
          marginBottom: "10px",
          marginTop: "0",
        }}
      >
        Expense Tracker
      </p>
      <div className="header">
        <Card
          name="Wallet balance"
          amount={balance}
          buttonText="+ Add Income"
          onClick={() => setBalanceModalOpen(true)}
        />
        <Card
          name="Expenses"
          amount={totalExpenses}
          buttonText="+ Add Expense"
          onClick={() => {
            setExpenseModalOpen(true);
            setHeading("Add Expense");
          }}
        />
        <div className="chart">
          <Chart expenses={expensesArray} />
          <div className="pill-container">
            <Pill text="Food" color="#A000FF" />
            <Pill text="Entertainment" color="#FF9304" />
            <Pill text="Travel" color="#FDE006" />
          </div>
        </div>
      </div>
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setExpenseToEdit(null); 
        }}
        onAddExpense={handleAddExpense}
        heading={heading}
        expenseToEdit={expenseToEdit} 
      />
      <div className="footer">
        <RecentTransactions
          expenses={expensesArray.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )}
          onDeleteExpense={handleDeleteExpense}
          handleEdit={openEditModal} 
        />

        <TopTransactions expenses={expensesArray} />
        <BalanceModal
          isOpen={isBalanceModalOpen}
          onClose={() => setBalanceModalOpen(false)}
          onAddBalance={handleAddIncome}
          heading="Add Balance"
        />
      </div>
    </div>
  );
}

export default App;