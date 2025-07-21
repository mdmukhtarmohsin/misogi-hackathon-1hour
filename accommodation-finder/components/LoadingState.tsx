// components/LoadingState.tsx
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">
          Searching for accommodations
        </span>
        <div className="flex space-x-1">
          <span className="text-blue-500 animate-pulse">.</span>
          <span
            className="text-indigo-500 animate-pulse"
            style={{ animationDelay: "200ms" }}
          >
            .
          </span>
          <span
            className="text-purple-500 animate-pulse"
            style={{ animationDelay: "400ms" }}
          >
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
