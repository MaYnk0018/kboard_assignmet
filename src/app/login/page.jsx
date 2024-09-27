"use client";
import AppNavbar from "../../components/common/appNavbar/AppNavbar";
import LoginContent from "../../components/AuthContent/LoginContent";
import SharedDataComponent from "../../context/SharedDataComponent";

function login() {
  return (
    <>
      <SharedDataComponent>
        <LoginContent />
      </SharedDataComponent>
    </>
  );
}

export default login;
