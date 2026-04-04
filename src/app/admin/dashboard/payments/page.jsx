"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search, DollarSign, Settings } from "lucide-react";
import { showSuccess, showError, showWarning, showInfo } from "@/utils/swal";

export default function AdminPaymentsPage() {

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState({
    sectionTitle: "Money Collection",
    buttonText: "Pay Now",
    buttonEnabled: true,
    paymentDescription: "Pay your semester fees securely via SSLCommerz",
  });
  const [editSettings, setEditSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    fetchPayments();
    fetchSettings();
  }, []);

  const fetchPayments = () => {
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => setPayments(data));
  };

  const fetchSettings = () => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        const loaded = {};
        data.forEach(s => {
          loaded[s.key] = s.value;
        });
        if (loaded.sectionTitle || loaded.buttonText || loaded.buttonEnabled || loaded.paymentDescription) {
          setSettings(prev => ({ ...prev, ...loaded }));
          setTempSettings(prev => ({ ...prev, ...loaded }));
        }
      })
      .catch(console.error);
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempSettings),
      });
      
      if (res.ok) {
        setSettings(tempSettings);
        setEditSettings(false);
        showSuccess("Settings saved successfully");
      } else {
        showError("Failed to save settings");
      }
    } catch (err) {
      showError("Error saving settings");
    }
  };

  const totalAmount = payments
    .filter(p => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredPayments = payments.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* ===== MONEY COLLECTION SECTION ===== */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              {settings.sectionTitle}
            </h2>
            {settings.paymentDescription && (
              <p className="mt-2 text-green-100 text-sm md:text-base">
                {settings.paymentDescription}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-sm text-green-100">Total Collected</span>
                <p className="text-xl font-bold">৳ {totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-sm text-green-100">Total Transactions</span>
                <p className="text-xl font-bold">{payments.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-sm text-green-100">Successful</span>
                <p className="text-xl font-bold">{payments.filter(p => p.status === "SUCCESS").length}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setEditSettings(!editSettings)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Settings Panel */}
        {editSettings && (
          <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <h3 className="font-semibold mb-4 text-green-100">Configure Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-green-100 mb-1">Section Title</label>
                <input
                  type="text"
                  value={tempSettings.sectionTitle}
                  onChange={(e) => setTempSettings({ ...tempSettings, sectionTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-green-200 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-sm text-green-100 mb-1">Button Text</label>
                <input
                  type="text"
                  value={tempSettings.buttonText}
                  onChange={(e) => setTempSettings({ ...tempSettings, buttonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-green-200 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-green-100 mb-1">Description</label>
                <input
                  type="text"
                  value={tempSettings.paymentDescription}
                  onChange={(e) => setTempSettings({ ...tempSettings, paymentDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-green-200 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="buttonEnabled"
                  checked={tempSettings.buttonEnabled}
                  onChange={(e) => setTempSettings({ ...tempSettings, buttonEnabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="buttonEnabled" className="text-green-100">Show Payment Button on Public Page</label>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={saveSettings}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition"
              >
                Save Settings
              </button>
              <button
                onClick={() => {
                  setEditSettings(false);
                  setTempSettings(settings);
                }}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>


      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Payment Records
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