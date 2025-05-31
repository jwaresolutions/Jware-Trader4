'use client'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [positions, setPositions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // For now, just show placeholder data
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setAccountInfo({
        buying_power: 100000,
        portfolio_value: 100000,
        cash: 100000,
        positions_value: 0
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trading Dashboard</h1>
      
      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-1">Portfolio Value</h3>
          <p className="text-2xl font-bold">${accountInfo?.portfolio_value?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-1">Buying Power</h3>
          <p className="text-2xl font-bold">${accountInfo?.buying_power?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-1">Cash</h3>
          <p className="text-2xl font-bold">${accountInfo?.cash?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-1">Positions Value</h3>
          <p className="text-2xl font-bold">${accountInfo?.positions_value?.toLocaleString()}</p>
        </div>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Positions</h2>
        </div>
        <div className="p-6">
          {positions.length === 0 ? (
            <p className="text-gray-500">No open positions</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Avg Cost</th>
                  <th className="text-left py-2">Current Price</th>
                  <th className="text-left py-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{position.symbol}</td>
                    <td className="py-2">{position.qty}</td>
                    <td className="py-2">${position.avg_cost}</td>
                    <td className="py-2">${position.current_price}</td>
                    <td className="py-2">{position.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <p className="text-gray-500">No recent orders</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Side</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{order.created_at}</td>
                    <td className="py-2">{order.symbol}</td>
                    <td className="py-2">{order.side}</td>
                    <td className="py-2">{order.qty}</td>
                    <td className="py-2">${order.price}</td>
                    <td className="py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <a 
          href="/logs" 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          View System Logs
        </a>
        <a 
          href="/trade" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Trade
        </a>
        <a 
          href="/strategies" 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Manage Strategies
        </a>
      </div>
    </div>
  )
}