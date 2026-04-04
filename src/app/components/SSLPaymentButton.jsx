"use client";

import useUser from "@/hooks/useUser";
import { showError, showWarning } from "@/utils/swal";
import { useEffect, useState } from "react";

export default function SSLPaymentButton() {
  const { user, loading } = useUser();
  const [settings, setSettings] = useState({ buttonEnabled: true, buttonText: "Pay Now", sectionTitle: "Money Collection", paymentDescription: "" });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        const loaded = {};
        data.forEach(s => loaded[s.key] = s.value);
        if (loaded.buttonEnabled !== undefined || loaded.buttonText) {
          setSettings(prev => ({ ...prev, ...loaded }));
        }
      })
      .catch(console.error);
  }, []);

  const handlePayment = async () => {

    try {

      if (!user?.email) {
        showWarning("User not loaded");
        return;
      }

      console.log("Sending payment request...");

      const res = await fetch("/api/ssl/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name || "Student",
          email: user.email,
        }),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        showError("Payment URL not received");
      }

    } catch (error) {
      console.error(error);
      showError("Payment error");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!settings.buttonEnabled) return null;

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
    >
      {settings.buttonText || "Pay Now"}
    </button>
  );
}
