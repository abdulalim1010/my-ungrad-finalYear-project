"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot, User } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your department assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-br from-blue-600 to-indigo-700
          text-white shadow-lg hover:shadow-xl
          hover:scale-110 transition-all duration-300
          flex items-center justify-center
          group
        "
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X size={28} className="animate-fade-in" />
        ) : (
          <MessageCircle size={28} className="animate-pulse" />
        )}
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-50
            w-96 h-[600px] max-h-[80vh]
            bg-white rounded-2xl shadow-2xl
            flex flex-col overflow-hidden
            border border-gray-100
            animate-slide-up
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Department Assistant</h3>
                <p className="text-sm text-blue-100">Online - Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.role === "user" ? "flex-row-reverse gap-3" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full shrink-0 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-md bg-white shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-gray-100"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="
                  flex-1 px-4 py-3
                  border border-gray-200 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  text-gray-800 placeholder-gray-400
                "
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="
                  p-3 rounded-full
                  bg-gradient-to-r from-blue-600 to-indigo-700
                  text-white shadow-md
                  hover:shadow-lg hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-200
                "
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
