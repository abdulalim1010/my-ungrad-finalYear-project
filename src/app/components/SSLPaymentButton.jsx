"use client";

import useUser from "@/hooks/useUser";

export default function SSLPaymentButton() {

  const { user, loading } = useUser();

  const handlePayment = async () => {

    try {

      if (!user?.email) {
        alert("User not loaded");
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
        alert("Payment URL not received");
      }

    } catch (error) {
      console.error(error);
      alert("Payment error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-3 rounded-lg"
    >
      Pay Now
    </button>
  );
}
