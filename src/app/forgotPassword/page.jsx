"use client"; 

import Head from 'next/head'; // Import Head for SEO
import AppNavbar from '../../components/common/appNavbar/AppNavbar';
import ForgotPasswordContent from '../../components/AuthContent/ForgotPasswordContent';

function ForgotPassword() {
  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Reset your password for your account" />
      </Head>
      <ForgotPasswordContent />
    </>
  );
}

export default ForgotPassword;
