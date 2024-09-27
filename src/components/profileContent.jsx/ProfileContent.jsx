"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import "./ProfileContent.css";
import AxiosService from "../../app/utils/AxiosService";
import ApiRoutes from "../../app/utils/ApiRoutes";

const ProfileContent = () => {
  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const mobile = useRef(null);

  const [userData, setUserData] = useState(null);
  const [buttonChange, setButtonChange] = useState(false);
  const [loading, setLoading] = useState(false);

  const getLoginToken =
    typeof window !== "undefined" ? localStorage.getItem("loginToken") : null;
  let userId;
  try {
    userId = getLoginToken ? jwtDecode(getLoginToken).userId : null;
  } catch (error) {
    toast.error("Invalid or corrupted token. Please login again.");
  }

  const editUserData = async () => {
    setLoading(true);
    const updatedData = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      email: email.current.value,
      mobile: mobile.current.value,
    };

    try {
      let res = await AxiosService.put(
        `${ApiRoutes.USER.path}/${userId}`,
        updatedData,
        {
          headers: { Authorization: `${getLoginToken}` },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setLoading(false);
        setButtonChange(!buttonChange);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      let res = await AxiosService.get(`${ApiRoutes.USER.path}/${userId}`, {
        headers: { Authorization: `${getLoginToken}` },
      });
      if (res.status === 200) {
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  return (
    <Card
      className="profileCard mx-auto"
      style={{ width: "30rem", height: "28rem" }}
    >
      <Card.Body>
        <div>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={userData?.firstName}
              placeholder="Enter here"
              name="firstName"
              ref={firstName}
              disabled={!buttonChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={userData?.lastName}
              placeholder="Enter here"
              name="lastName"
              ref={lastName}
              disabled={!buttonChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              defaultValue={userData?.email}
              placeholder="Enter here"
              name="email"
              ref={email}
              disabled={!buttonChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              defaultValue={userData?.mobile}
              placeholder="Enter here"
              name="mobile"
              ref={mobile}
              disabled={!buttonChange}
            />
          </Form.Group>
          {buttonChange ? (
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={editUserData}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Save"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              style={{ width: "100%" }}
              onClick={() => setButtonChange(!buttonChange)}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Edit"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileContent;
