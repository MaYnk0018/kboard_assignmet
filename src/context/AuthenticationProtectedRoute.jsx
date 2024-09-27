"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import ErrorScreen from '../components/common/errorScreen/ErrorScreen'
import jwtDecode from "jwt-decode"

function AuthenticationProtectedRoute({ children }) {
    const router = useRouter()
    let token = typeof window !== 'undefined' ? localStorage.getItem('loginToken') : null

    if (!token) {
        return <ErrorScreen />
    }

    try {
        const decodedToken = jwtDecode(token)
        if (!decodedToken?.isLoggedIn) {
            router.push('/')
            return null
        }
    } catch (error) {
        return <ErrorScreen />
    }

    return <>{children}</>
}

export default AuthenticationProtectedRoute
