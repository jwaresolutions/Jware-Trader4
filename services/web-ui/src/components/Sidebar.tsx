'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Trade', href: '/trade', icon: '💹' },
  { label: 'Positions', href: '/positions', icon: '📈' },
  { label: 'Orders', href: '/orders', icon: '📋' },
  { label: 'Strategies', href: '/strategies', icon: '🤖' },
  { label: 'Market Data', href: '/market', icon: '📰' },
  { label: 'System Logs', href: '/logs', icon: '📝' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Jware Trader</h2>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-gray-800">
          <div className="space-y-2">
            <Link
              href="/help"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="text-xl">❓</span>
              <span className="font-medium">Help</span>
            </Link>
            <Link
              href="/logout"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}