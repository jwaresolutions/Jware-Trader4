export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Jware Trader</h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional Automated Trading Platform
        </p>
        <div className="space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
          <a
            href="/logs"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            View System Logs
          </a>
        </div>
      </div>
    </main>
  )
}