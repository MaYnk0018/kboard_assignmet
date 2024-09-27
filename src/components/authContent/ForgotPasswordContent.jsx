"use client";

import React, { useState } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosService from "../../app/utils/AxiosService";
import ApiRoutes from "../../app/utils/ApiRoutes";

function ForgotPasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email"),
      password: Yup.string()
        .required("Password is required")
        .matches(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/, "Enter a valid Password"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (values.password === values.confirmPassword) {
          const res = await AxiosService.post(ApiRoutes.AUTH.path, values);
          if (res.status === 200) {
            router.push("src/app/");
          }
          setLoading(false);
        } else {
          toast.error("Passwords don't match! Please enter the same passwords");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Container className="mt-4">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => router.push("src/app/")}>
            Login
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Forgot Password</Breadcrumb.Item>
        </Breadcrumb>

        <Col md xs={12}>
          <Form
            onSubmit={formik.handleSubmit}
            className="authForm mx-auto my-5 p-5 rounded-5"
          >
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="authErrorText">{formik.errors.email}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="authErrorText">{formik.errors.password}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-Enter Password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="authErrorText">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </Form.Group>

            <div className="d-grid mb-4">
              <Button className="formBtns" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" /> : "Update Password"}
              </Button>
            </div>
          </Form>
        </Col>
      </Container>
    </>
  );
}

export default ForgotPasswordContent;
