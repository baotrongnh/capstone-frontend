'use client'

import { setSocketAuthToken, socket } from '@/lib/socket/socket'
import { useAuthStore } from '@/stores/auth.store'
import { type ReactNode, useEffect } from 'react'

export default function SocketProvider({ children }: { children: ReactNode }) {
     const isHydrated = useAuthStore((s) => s.isHydrated)
     const accessToken = useAuthStore((s) => s.tokens?.accessToken)

     useEffect(() => {
          if (!isHydrated) {
               return
          }

          if (!accessToken) {
               setSocketAuthToken(null)
               socket.disconnect()
               return
          }

          setSocketAuthToken(accessToken)
          socket.connect()

          return () => {
               socket.disconnect()
          }
     }, [isHydrated, accessToken])

     return <>{children}</>
}