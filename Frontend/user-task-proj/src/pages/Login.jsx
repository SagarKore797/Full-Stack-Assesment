import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  //Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  //Formik Setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await API.post("/auth/login", null, {
          params: values,
        });

        localStorage.setItem("token", res.data);

        toast.success("Login Successful", {
          position: "top-right",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        toast.error(
          error.response?.data || "Invalid email or password",
          {
            position: "top-right",
          }
        );
      }
    },
  });

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <ToastContainer />

      <div
        className={`container ${animate ? "animate-card" : ""}`}
        style={{ maxWidth: "650px" }}
      >
        <div className="row shadow rounded overflow-hidden">

          {/* LEFT PANEL */}
          <div
            className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white"
            style={{
              background: "linear-gradient(to right, #FF4B2B, #FF416C)",
            }}
          >
            <h4 className="fw-bold">Welcome Back!</h4>
            <p className="text-center px-4 small">
              Login with your personal details and continue your journey 🚀
            </p>
            <Link
              to="/register"
              className="btn btn-outline-light rounded-pill px-4"
            >
              Sign Up
            </Link>
          </div>

          {/* RIGHT FORM */}
          <div className="col-md-6 bg-white p-4">
            <div className="text-center mb-3">
              <h3 className="fw-bold">Sign In</h3>
              <small className="text-muted">
                Use your email and password
              </small>
            </div>

            <form onSubmit={formik.handleSubmit}>
              
              {/* Email */}
              <div className="form-floating mb-2">
                <input
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  id="email"
                  placeholder="Email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <label htmlFor="email">Email address</label>
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger small mb-2">
                  {formik.errors.email}
                </div>
              )}

              {/* Password */}
              <div className="form-floating mb-2">
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <label htmlFor="password">Password</label>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger small mb-3">
                  {formik.errors.password}
                </div>
              )}

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-danger rounded-pill py-2 login-btn"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <small>
                Don't have an account?{" "}
                <Link to="/register" className="text-danger fw-bold">
                  Sign Up
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;