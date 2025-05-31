'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show sidebar on home page
  const showSidebar = pathname !== '/'
  
  if (!showSidebar) {
    return <>{children}</>
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}