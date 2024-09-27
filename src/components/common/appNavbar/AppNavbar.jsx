"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "../../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import { useLogout } from "../../hooks/UseLogout";
import { MenuIcon, LogOutIcon, UserIcon, HomeIcon } from "lucide-react"; // Use Lucide icons

function AppNavbar() {
  const router = useRouter();
  const logout = useLogout();
  const [respMenu, setRespMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the component is client-side before accessing localStorage
  }, []);

  const handleRespMenu = () => setRespMenu(!respMenu);
  const getLoginToken = isClient ? localStorage.getItem("loginToken") : null;

  const handleLogout = async () => {
    if (!getLoginToken) {
      toast.error("No user is logged in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(getLoginToken);
      await logout();
      router.push("/"); // Redirect after logout
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  const getUserStatus = async () => {
    if (!getLoginToken) return;
    try {
      const decodedToken = jwtDecode(getLoginToken);
      const id = decodedToken.userId;
      // Mock API response with user data
      const res = { status: 200, data: { user: { image: "/user.png", name: "John Doe" } } };
      if (res.status === 200) {
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error("Failed to fetch user data: " + error.message);
    }
  };

  useEffect(() => {
    if (isClient) {
      getUserStatus();
    }
  }, [isClient]);

  return (
    <>
      <div className="bg-primary h-20 flex items-center px-6 justify-between">
        {/* Logo Section */}
        <Avatar
          onClick={() => router.push("/home")}
          className="cursor-pointer border-2 border-white"
          size="lg"
        >
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>Logo</AvatarFallback>
        </Avatar>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-4">
          {getLoginToken ? (
            <>
              {/* User Profile */}
              <Button variant="ghost" onClick={() => router.push("/profile")}>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={userData?.image} alt={userData?.name} />
                  <AvatarFallback>
                    <UserIcon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* Logout Button */}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOutIcon className="h-6 w-6 text-white" />
              </Button>
            </>
          ) : (
            <>
              {/* Login and Register Buttons */}
              <Link href="/login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}

          {/* Responsive Menu Button */}
          <Dialog open={respMenu} onOpenChange={setRespMenu}>
            <DialogTrigger asChild>
              <Button variant="ghost" onClick={handleRespMenu}>
                <MenuIcon className="h-6 w-6 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col space-y-4">
                <Link href="/login" className="flex items-center space-x-2">
                  <HomeIcon className="h-5 w-5 text-primary" />
                  <span>Login</span>
                </Link>
                <Link href="/register" className="flex items-center space-x-2">
                  <HomeIcon className="h-5 w-5 text-primary" />
                  <span>Register</span>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default AppNavbar;
