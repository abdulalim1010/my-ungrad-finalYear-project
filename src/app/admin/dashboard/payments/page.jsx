"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search } from "lucide-react";

export default function AdminPaymentsPage() {

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => setPayments(data));
  }, []);

  // filter
  const filteredPayments = payments.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Student Payments
          </h1>

          <p className="text-gray-500 text-sm">
            All SSLCommerz payment records
          </p>
        </div>


        {/* SEARCH */}
        <div className="relative w-full sm:w-72">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

      </div>


      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="grid gap-4 sm:hidden">

        {filteredPayments.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No payments found
          </div>
        )}

        {filteredPayments.map((payment) => (

          <div
            key={payment._id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >

            {/* name */}
            <div className="font-semibold text-gray-800">
              {payment.name}
            </div>

            <div className="text-sm text-gray-500 mb-2">
              {payment.email}
            </div>


            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-green-600">
                ৳ {payment.amount}
              </span>
            </div>


            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Transaction</span>
              <span className="font-mono text-gray-700">
                {payment.transactionId}
              </span>
            </div>


            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Status</span>

              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${
                    payment.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : payment.status === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {payment.status}
              </span>

            </div>


            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>

              <span className="text-gray-700 text-right">
                {new Date(payment.date).toLocaleDateString()}
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(payment.date).toLocaleTimeString()}
                </span>
              </span>

            </div>

          </div>

        ))}

      </div>



      {/* ================= TABLE VIEW (Tablet + Desktop) ================= */}
      <div className="hidden sm:block bg-white rounded-xl shadow-md border overflow-hidden">

        <div className="overflow-x-auto w-full">

          <table className="w-full min-w-[700px]">

            <thead className="bg-gray-100">

              <tr className="text-left text-gray-600 text-sm">

                <th className="p-4 whitespace-nowrap">Student</th>
                <th className="p-4 whitespace-nowrap">Amount</th>
                <th className="p-4 whitespace-nowrap">Transaction</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Date</th>

              </tr>

            </thead>


            <tbody>

              {filteredPayments.length === 0 && (

                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-400">
                    No payments found
                  </td>
                </tr>

              )}


              {filteredPayments.map((payment) => (

                <tr
                  key={payment._id}
                  className="border-t hover:bg-blue-50 transition"
                >

                  <td className="p-4 whitespace-nowrap">

                    <div className="font-medium text-gray-800">
                      {payment.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {payment.email}
                    </div>

                  </td>


                  <td className="p-4 font-semibold text-green-600 whitespace-nowrap">
                    ৳ {payment.amount}
                  </td>


                  <td className="p-4 text-sm font-mono text-gray-600 whitespace-nowrap">
                    {payment.transactionId}
                  </td>


                  <td className="p-4 whitespace-nowrap">

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
                        ${
                          payment.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {payment.status}
                    </span>

                  </td>


                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">

                    {new Date(payment.date).toLocaleDateString()}

                    <br />

                    <span className="text-xs text-gray-400">
                      {new Date(payment.date).toLocaleTimeString()}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}
