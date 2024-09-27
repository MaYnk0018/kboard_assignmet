"use client"; // Ensures this component is a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "../../components/common/appNavbar/AppNavbar";
import HomeContent from "@/components/homeContent/HomeContent";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const getLoginToken = localStorage.getItem("loginToken");

    if (!getLoginToken) {
      // Redirect to the login page if token is not found
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <HomeContent />
    </>
  );
}

export default Home;
