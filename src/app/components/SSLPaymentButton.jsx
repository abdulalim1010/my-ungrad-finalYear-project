"use client";

import { showError, showWarning } from "@/utils/swal";
import { useEffect, useState } from "react";

export default function SSLPaymentButton() {
  const [settings, setSettings] = useState({ buttonEnabled: true, buttonText: "Pay Now" });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const loaded = {};
          data.forEach(s => loaded[s.key] = s.value);
          if (loaded.buttonEnabled !== undefined || loaded.buttonText) {
            setSettings(prev => ({ ...prev, ...loaded }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handlePayment = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showWarning("Please enter your name and email");
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch("/api/ssl/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showError("Payment URL not received");
        setProcessing(false);
      }
    } catch (error) {
      console.error(error);
      showError("Payment error");
      setProcessing(false);
    }
  };

  if (!settings.buttonEnabled) return null;

  if (showForm) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md mx-auto border border-white/20">
        <h3 className="text-white font-semibold mb-4">Enter Payment Details</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 mb-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:border-white"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:border-white"
        />
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50"
          >
            {processing ? "Processing..." : "Proceed to Payment"}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="bg-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg"
    >
      {settings.buttonText || "Pay Now"}
    </button>
  );
}