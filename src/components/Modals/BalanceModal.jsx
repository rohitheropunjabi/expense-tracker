import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./AddExpensesModal.module.css";

Modal.setAppElement("#root");

export default function BalanceModal({
  isOpen,
  onClose,
  onAddBalance, 
  heading,
}) {
  const [income, setIncome] = useState(""); 

  const handleAddBalance = (e) => {
    e.preventDefault();
    if (!income) return; 

    const incomeAmount = parseInt(income, 10); 
    onAddBalance(incomeAmount); 
    setIncome(""); 
    onClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Balance"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.modalTitle}>{heading}</h2>
      <form onSubmit={handleAddBalance}>
        <div>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Add Income"
            className={styles.inputField}
            required={true}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.addButton}>
            {heading}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}