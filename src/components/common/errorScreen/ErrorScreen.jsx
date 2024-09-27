"use client"

import React from 'react'
import { Button } from 'react-bootstrap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import jwtDecode from "jwt-decode"
//import errorScreenAnime from '../../../public/assets/errorScreenAnime.svg'
import './ErrorScreen.css'

function ErrorScreen() {

  const router = useRouter();

  const handleErrorPage = () => {
    let getToken = typeof window !== 'undefined' ? localStorage.getItem('loginToken') : null;
    
    if (getToken === null) {
      router.push('/')
    } else {
      try {
        const decodedToken = jwtDecode(getToken)
        router.push('/home')
      } catch (error) {
        router.push('/')
      }
    }
  }

  return (
    <div className='errorBlock d-flex mx-auto mt-5'>
      <Image src={""} alt="errorscreen" className='errorImage' />      
      <Button onClick={handleErrorPage} className='errorBtn'>Go to Home</Button>
    </div>
  )
}

export default ErrorScreen
