'use client'

import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // Add providers here as needed (Redux, Theme, Auth, etc.)
  return <>{children}</>
}