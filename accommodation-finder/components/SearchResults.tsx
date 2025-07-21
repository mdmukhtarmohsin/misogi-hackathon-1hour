// components/SearchResults.tsx
import React from "react";
import { SearchResult } from "../lib/types";

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-bold text-gray-900">
          Found {results.length} accommodation{results.length !== 1 ? "s" : ""}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-500 to-transparent"></div>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-4">
                {result.title}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-full">
                <span className="text-blue-600">📍</span>
                <span className="font-medium">{result.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-green-600">
                  {result.price}
                </span>
                {result.price !== "N/A" && (
                  <span className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                    /month
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                {result.source}
              </div>
            </div>

            {result.description && (
              <p className="text-gray-700 text-base mb-6 line-clamp-3 leading-relaxed">
                {result.description}
              </p>
            )}

            {result.amenities && result.amenities.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {result.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-100"
                  >
                    ✨ {amenity}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>View Details</span>
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <span>Source:</span>
                <span className="font-medium text-gray-700">
                  {result.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
          <span className="text-lg">💡</span>
          <p className="text-sm font-medium">
            Click "View Details" to see the full listing on the original website
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
