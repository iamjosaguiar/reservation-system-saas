export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Reservation System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A modern multi-tenant reservation platform for bars and restaurants
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Get Started
          </button>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
