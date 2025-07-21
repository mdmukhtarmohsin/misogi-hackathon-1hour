"use client";

import React, { useState, useRef, useEffect } from "react";
import { SearchResult } from "../lib/types";
import LoadingState from "./LoadingState";
import SearchResults from "./SearchResults";

interface Message {
  text: string;
  isUser: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your accommodation assistant. Tell me what you're looking for - I'll help you find the perfect place!",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, searchResults]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSearchResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, conversationHistory: messages }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          text: data.response,
          isUser: false,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (data.results) {
          setSearchResults(data.results);
        }
      } else {
        const errorMessage: Message = {
          text: `Error: ${
            data.error || "Sorry, something went wrong. Please try again."
          }`,
          isUser: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to get response from API", error);
      const errorMessage: Message = {
        text: "Sorry, something went wrong. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-xl">🏠</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">
              Accommodation Assistant
            </h2>
            <p className="text-blue-100 text-sm">
              AI-powered search for your perfect home
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-100 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[500px] overflow-y-auto p-8 space-y-6 chat-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.isUser ? "justify-end" : "justify-start"
            } animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-sm ${
                msg.isUser
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                  : "bg-gray-50 text-gray-800 rounded-bl-md border border-gray-100"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-50 text-gray-800 rounded-2xl rounded-bl-md px-6 py-4 border border-gray-100">
              <LoadingState />
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <SearchResults results={searchResults} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              placeholder="Tell me what you're looking for..."
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Send</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            💡 Try:{" "}
            <span className="font-medium">
              "I need a PG in Bangalore under 10k"
            </span>{" "}
            or{" "}
            <span className="font-medium">
              "Looking for a shared flat in Mumbai"
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
