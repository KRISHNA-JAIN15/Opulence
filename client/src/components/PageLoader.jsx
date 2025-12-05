import { useState, useEffect } from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center space-x-1 text-gray-600 font-medium">
          <span>Loading</span>
          <div className="flex space-x-1">
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
