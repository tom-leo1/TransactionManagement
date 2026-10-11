import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  creditTransaction,
  debitTransaction,
} from "../rtk/slice/TransactionSlice";
import { nanoid } from "@reduxjs/toolkit";
import Notification from "./Notification";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [notification, setNotification] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.transaction);
  const history = data?.transactionHistory ?? [];
  const closeNotification = useCallback(() => setNotification(false), []);
  const isAmountValid = amount !== "" && Number(amount) > 0;

  const handleTransaction = (transactionType) => {
    const numericAmount = Number(amount);

    if (!isAmountValid) {
      return;
    }

    if (transactionType !== "CREDIT" && data?.balance < numericAmount) {
      setNotification(true);
      setAmount("");
      return;
    }

    dispatch(
      transactionType === "CREDIT"
        ? creditTransaction(numericAmount)
        : debitTransaction(numericAmount),
    );
    dispatch(
      addTransaction({
        transactionId: nanoid(),
        transactionAmount: numericAmount,
        transactionType: transactionType,
        transactionDate: new Date().toISOString(),
      }),
    );
    setAmount("");
  };

  const totalTransactions = useMemo(() => history.length, [history.length]);

  return (
    <main className="finance-page">
      <div className="finance-container">
        <header className="page-header">
          <div className="brand-mark">F</div>
          <div>
            <p className="eyebrow">Finance</p>
            <h1>Transaction Management</h1>
            <p className="page-description">
              Track every balance change and review your recent activity.
            </p>
          </div>
        </header>

        <section className="overview-grid">
          <div className="balance-card">
            <div className="balance-card-top">
              <div>
                <div className="balance-label">Current Balance</div>
              </div>
              <div className="balance-icon">↗</div>
            </div>
            <div className="balance-amount">{formatCurrency(data?.balance ?? 0)}</div>
            <p className="balance-caption">Available to spend</p>
          </div>

          <div className="activity-card">
            <div className="activity-icon">↗</div>
            <div>
              <p className="activity-label">Transactions</p>
              <div className="activity-value">{totalTransactions}</div>
              <p className="activity-caption">Across all entries</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Quick Transfer</h2>
          </div>
          <label className="amount-label" htmlFor="transaction-amount">
            Amount
          </label>
          <div className="transaction-controls">
            <div className="amount-input-wrap">
              <input
                id="transaction-amount"
                className="amount-input"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
              />
            </div>
            <button
              className="action-button credit-button"
              onClick={() => handleTransaction("CREDIT")}
              type="button"
              disabled={!isAmountValid}
            >
              <span>+</span> Credit
            </button>
            <button
              className="action-button debit-button"
              onClick={() => handleTransaction("DEBIT")}
              type="button"
              disabled={!isAmountValid}
            >
              <span>-</span> Debit
            </button>
          </div>
        </section>

        <section className="panel history-panel">
          <div className="section-heading history-heading">
            <h2>Transaction History</h2>
            <span className="history-count">{totalTransactions}</span>
          </div>

          {history.length ? (
            <div className="table-scroll">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th className="amount-column">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const isCredit = item?.transactionType === "CREDIT";
                    const amountClass = isCredit ? "credit-amount" : "debit-amount";
                    const badgeClass = isCredit ? "credit-type" : "debit-type";
                    const formattedAmount = formatCurrency(item?.transactionAmount ?? 0);

                    return (
                      <tr key={item?.transactionId}>
                        <td className="transaction-id" data-label="Transaction ID">
                          {item?.transactionId}
                        </td>
                        <td data-label="Type">
                          <span className={`transaction-badge ${badgeClass}`}>
                            {item?.transactionType}
                          </span>
                        </td>
                        <td className="date-cell" data-label="Date">
                          {new Date(item?.transactionDate).toLocaleString()}
                        </td>
                        <td className={`amount-cell ${amountClass}`} data-label="Amount">
                          {isCredit ? "+" : "-"}
                          {formattedAmount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">◌</div>
              <h3>No transactions yet</h3>
              <p>Once you add a credit or debit, this list will appear here.</p>
            </div>
          )}
        </section>
      </div>

      {notification && (
        <Notification
          message="Your balance is low. Try entering another amount."
          onClose={closeNotification}
        />
      )}
    </main>
  );
};

export default Transactions;
