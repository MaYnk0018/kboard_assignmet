"use client"

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export const useLogout = () => {
  const router = useRouter() // useRouter for navigation in Next.js

  const logout = () => {
    // Optionally, make an API call to log out from the server
    // await someApiCallToLogout();
 
    toast.success("Logged Out Successfully")
    localStorage.clear() // Clear local storage
    router.push('/') // Navigate to the home page
  }

  return logout
}
