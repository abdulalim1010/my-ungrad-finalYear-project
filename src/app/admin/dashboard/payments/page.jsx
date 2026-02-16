"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {

  const [payments, setPayments] = useState([]);

  useEffect(() => {

    fetch("/api/payments")
      .then(res => res.json())
      .then(data => setPayments(data));

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h2>All Student Payments</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {payments.map(payment => (

            <tr key={payment._id}>

              <td>{payment.name}</td>
              <td>{payment.email}</td>
              <td>{payment.amount} BDT</td>
              <td>{payment.transactionId}</td>
              <td>{payment.status}</td>
              <td>
                {new Date(payment.date).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}
