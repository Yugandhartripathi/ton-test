'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
      verifyUser(WebApp.initData)
    }
  }, [])

  const verifyUser = async (initData: string) => {
    try {
      console.log('Verifying user with initData:', initData)
      const response = await axios.post('/api/verifyUser', { initData })
      console.log('Verification response:', response.data)
      setIsVerified(response.data.verified)
    } catch (error) {
      console.error('Verification failed:', error)
      if (error instanceof Error) {
        setVerificationError(error.message)
      } else {
        setVerificationError('Unknown error')
      }
      setIsVerified(false)
    }
  }
  

  return (
    <main className="p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">User Data</h1>
          <ul>
            <li>ID: {userData.id}</li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name || 'N/A'}</li>
            <li>Username: {userData.username || 'N/A'}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
            <li>Verified User: {isVerified === null ? 'Loading...' : isVerified ? 'Yes' : 'No'}</li>
            {verificationError && <li>Verification Error: {verificationError}</li>}
          </ul>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  )
}