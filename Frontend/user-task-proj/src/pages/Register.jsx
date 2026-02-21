import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Validation Schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "Too short")
      .required("First name is required"),

    lastName: Yup.string()
      .min(2, "Too short")
      .required("Last name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    phnNum: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  //Formik Setup
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phnNum: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await API.post("/auth/register", values);

        toast.success("Registered Successfully", {
          position: "top-right",
        });

        setTimeout(() => navigate("/"), 1500);
      } catch (error) {
        toast.error(
          error.response?.data || "Registration failed",
          { position: "top-right" }
        );
      }
    },
  });

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <ToastContainer />

      <div
        className={`container ${animate ? "animate-card" : ""}`}
        style={{ maxWidth: "700px" }}
      >
        <div className="row shadow rounded overflow-hidden">

          {/* LEFT FORM */}
          <div className="col-md-6 bg-white p-4">
            <div className="text-center mb-3">
              <h3 className="fw-bold">Create Account</h3>
              <small className="text-muted">Start your journey</small>
            </div>

            <form onSubmit={formik.handleSubmit}>

              {/* First + Last Name */}
              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="First Name"
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="text-danger small">
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Last Name"
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="text-danger small">
                      {formik.errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-2">
                <input
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger small">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-2">
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.phnNum && formik.errors.phnNum
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Phone Number"
                  name="phnNum"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phnNum}
                />
                {formik.touched.phnNum && formik.errors.phnNum && (
                  <div className="text-danger small">
                    {formik.errors.phnNum}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger small">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-danger rounded-pill py-2 register-btn"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <small>
                Already have an account?{" "}
                <Link to="/" className="text-danger fw-bold">
                  Sign In
                </Link>
              </small>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white"
            style={{
              background: "linear-gradient(to right, #FF4B2B, #FF416C)",
            }}
          >
            <h4 className="fw-bold">Hello, Friend!</h4>
            <p className="text-center px-4 small">
              Enter your details and build something amazing 🚀
            </p>
            <Link
              to="/"
              className="btn btn-outline-light rounded-pill px-4"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;