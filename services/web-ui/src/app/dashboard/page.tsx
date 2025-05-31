export default function Dashboard() {
  // Mock data - in a real app, this would come from an API
  const accountInfo = {
    buying_power: 100000,
    portfolio_value: 100000,
    cash: 100000,
    positions_value: 0
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Trading Dashboard
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Portfolio Value</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${accountInfo.portfolio_value.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Buying Power</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${accountInfo.buying_power.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Cash</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${accountInfo.cash.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Positions Value</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${accountInfo.positions_value.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Positions</h2>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ color: '#666' }}>No open positions</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Orders</h2>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ color: '#666' }}>No recent orders</p>
        </div>
      </div>
    </div>
  )
}