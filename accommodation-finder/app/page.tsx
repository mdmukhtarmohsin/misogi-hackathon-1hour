import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Accommodation Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find your perfect accommodation with AI-powered search. Just tell us
            what you're looking for and we'll find the best options for you.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
