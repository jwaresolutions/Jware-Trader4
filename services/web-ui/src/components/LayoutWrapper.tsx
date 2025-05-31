'use client'

import { usePathname } from 'next/navigation'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show sidebar on home page
  const showSidebar = pathname !== '/'
  
  if (!showSidebar) {
    return <>{children}</>
  }
  
  const drawerWidth = 240
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}