"use client";

import { MessageCircle } from "lucide-react";

const CHAT_URL = "https://n8n.desimanush.com/webhook/04626ba7-5660-433d-96db-18f850237b4d/chat";

export default function ChatBot() {
  const handleClick = () => {
    // Open the n8n chat interface in a new window/tab
    window.open(CHAT_URL, "_blank", "width=450,height=700,scrollbars=yes,resizable=yes");
  };

  return (
    <>
      {/* Chat Toggle Button - Opens n8n webhook URL in new window */}
      <button
        onClick={handleClick}
        className="
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-br from-blue-600 to-indigo-700
          text-white shadow-lg hover:shadow-xl
          hover:scale-110 transition-all duration-300
          flex items-center justify-center
          group
        "
        aria-label="Open Chat Assistant"
      >
        <MessageCircle size={28} className="animate-pulse" />
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </button>
    </>
  );
}
