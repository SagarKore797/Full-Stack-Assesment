import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [contactCreated, setContactCreated] = useState(false);
  const [contactId, setContactId] = useState(null);

  // AUTO LOGOUT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const timeout = expiryTime - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          localStorage.removeItem("token");
          toast.error("Session expired. Login again.");
          navigate("/");
        }, timeout);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const progress = (step / 4) * 100;

  //contact -form
  const contactForm = useFormik({
    initialValues: { contactEmail: "", contactNum: "", note: "" },
    validationSchema: Yup.object({

      contactEmail: Yup.string().email().required("Required"),
      contactNum: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
        .required("Required"),
      note: Yup.string().required("Required")
    }),
    onSubmit: async (values) => {
      try {
        const response = await API.post("/api/contact", values);

        console.log("SUCCESS RESPONSE:", response);

        setContactId(response.data.contactId);
        localStorage.setItem("contactId", response.data.contactId);
        setContactCreated(true);
        toast.success("Contact Saved");
        setStep(2);

      } catch (error) {

        console.log("FULL ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("BACKEND MESSAGE:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Failed to save contact"
        );
      }
    }
  });

  // ---------------- ADDRESS FORM ----------------
  const addressForm = useFormik({
    initialValues: {
      add1: "",
      add2: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    },

    validationSchema: Yup.object({
      add1: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      pincode: Yup.string().required("Required"),
      country: Yup.string().required("Required")
    }),

    onSubmit: async (values) => {
      try {
        const storedContactId =
          contactId || localStorage.getItem("contactId");

        if (!storedContactId) {
          toast.error("Contact not found. Please create contact first.");
          return;
        }

        const { data, status } = await API.post("/api/address", {
          userContact: { contactId: Number(storedContactId) },
          ...values
        });

        console.log("ADDRESS RESPONSE:", data);
        console.log("STATUS:", status);

        toast.success(
          data?.message || "Address Saved Successfully"
        );

        setStep(3);

      } catch (error) {
        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
          error.response?.data ||
          "Something went wrong"
        );
      }
    }
  });

  // ---------------- TASK FORM ----------------
  const taskForm = useFormik({
    initialValues: {
      title: "",
      descrip: "",
      status: "",
      due_date: ""
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      descrip: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      due_date: Yup.date().required("Required")
    }),

    onSubmit: async (values) => {
      try {

        const storedContactId =
          contactId || localStorage.getItem("contactId");

        if (!storedContactId) {
          toast.error("Contact not found. Please create contact first.");
          return;
        }

        const { data, status } = await API.post("/api/task", {
          userContact: { contactId: Number(storedContactId) },
          ...values
        });

        console.log("TASK RESPONSE:", data);
        console.log("STATUS:", status);

        toast.success(
          data?.message || "Task Created Successfully"
        );

        setStep(4);

      } catch (error) {

        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to create task"
        );
      }
    }
  });


  // ---------------- EMAIL FORM ----------------
  const emailForm = useFormik({
    initialValues: {
      toEmail: "",
      subject: "",
      body: ""
    },

    validationSchema: Yup.object({
      toEmail: Yup.string().email().required("Required"),
      subject: Yup.string().required("Required"),
      body: Yup.string().required("Required")
    }),

    onSubmit: async (values, { resetForm }) => {
      try {

        const { data, status } = await API.post(
          "/api/email",
          null,
          { params: values }
        );

        console.log("EMAIL RESPONSE:", data);
        console.log("STATUS:", status);

        toast.success(
          data?.message || "Email Sent Successfully"
        );

        resetForm();
        setStep(1);

      } catch (error) {

        console.log("EMAIL ERROR STATUS:", error.response?.status);
        console.log("EMAIL ERROR DATA:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to send email"
        );
      }
    }
  });

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center"
    >

      <ToastContainer />

      <div className="card shadow-lg p-4 dashboard-card"
        style={{ width: "550px", borderRadius: "20px" }}>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-danger">User Workflow</h5>
          <button className="btn btn-sm btn-outline-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* PROGRESS SECTION */}
        <div className="mb-4">

          <div className="d-flex justify-content-between mb-2">
            <small className="fw-semibold text-danger">
              Step {step} of 4
            </small>
            <small className="fw-bold text-danger">
              {progress}%
            </small>
          </div>

          <div className="custom-progress">
            <div
              className="custom-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* STEP INDICATOR */}
          <div className="d-flex justify-content-between mt-3 position-relative">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="step-wrapper">
                <div className={`step-circle 
            ${step > s ? "completed" : ""} 
            ${step === s ? "active" : ""}`}>
                  {step > s ? "✓" : s}
                </div>
              </div>
            ))}
          </div>
        </div>

       

        {/* CONTACT */}
        <div className="form-animation">
          {step === 1 && (
            <form onSubmit={contactForm.handleSubmit}>
              <h6 className="mb-3">Contact Details</h6>
              <input className="form-control mb-2"
                name="contactEmail"
                placeholder="Contact Email"
                {...contactForm.getFieldProps("contactEmail")}
              />
              <small className="text-danger">{contactForm.touched.contactEmail && contactForm.errors.contactEmail}</small>

              <input className="form-control mt-2"
                name="contactNum"
                placeholder="Contact Number"
                {...contactForm.getFieldProps("contactNum")}
              />
              <small className="text-danger">{contactForm.touched.contactNum && contactForm.errors.contactNum}</small>

              <textarea className="form-control mt-2"
                name="note"
                placeholder="Note"
                {...contactForm.getFieldProps("note")}
              />
              <small className="text-danger">{contactForm.touched.note && contactForm.errors.note}</small>

              <button type="submit" className="btn btn-danger w-100 mt-3">
                Save & Next
              </button>
            </form>
          )}

          {/* ADDRESS */}
          {step === 2 && (
            <form onSubmit={addressForm.handleSubmit}>
              <h6 className="mb-3">Address Details</h6>

              {["add1", "add2", "city", "state", "pincode", "country"].map(field => (
                <div key={field}>
                  <input
                    className="form-control mb-2"
                    name={field}
                    placeholder={field.toUpperCase()}
                    {...addressForm.getFieldProps(field)}
                  />
                  <small className="text-danger">
                    {addressForm.touched[field] && addressForm.errors[field]}
                  </small>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <button type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-danger">
                  Save & Next
                </button>
              </div>
            </form>
          )}

          {/* TASK (ONLY IF CONTACT EXISTS) */}
          {step === 3 && contactCreated && (
            <form onSubmit={taskForm.handleSubmit}>
              <h6 className="mb-3">Task Details</h6>

              <input className="form-control mb-2"
                name="title"
                placeholder="Title"
                {...taskForm.getFieldProps("title")}
              />
              <small className="text-danger">{taskForm.touched.title && taskForm.errors.title}</small>

              <textarea className="form-control mt-2"
                name="descrip"
                placeholder="Description"
                {...taskForm.getFieldProps("descrip")}
              />
              <small className="text-danger">{taskForm.touched.descrip && taskForm.errors.descrip}</small>

              <input className="form-control mt-2"
                name="status"
                placeholder="Status"
                {...taskForm.getFieldProps("status")}
              />
              <small className="text-danger">{taskForm.touched.status && taskForm.errors.status}</small>

              <input type="date"
                className="form-control mt-2"
                name="due_date"
                {...taskForm.getFieldProps("due_date")}
              />
              <small className="text-danger">{taskForm.touched.due_date && taskForm.errors.due_date}</small>

              <div className="d-flex justify-content-between mt-3">
                <button type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="submit" className="btn btn-danger">
                  Save & Next
                </button>
              </div>
            </form>
          )}

          {/* EMAIL */}
          {step === 4 && (
            <form onSubmit={emailForm.handleSubmit}>
              <h6 className="mb-3">Send Email</h6>

              {["toEmail", "subject", "body"].map(field => (
                <div key={field}>
                  <input
                    className="form-control mb-2"
                    name={field}
                    placeholder={field}
                    {...emailForm.getFieldProps(field)}
                  />
                  <small className="text-danger">
                    {emailForm.touched[field] && emailForm.errors[field]}
                  </small>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <button type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(3)}>
                  Back
                </button>
                <button type="submit" className="btn btn-danger">
                  Finish
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;