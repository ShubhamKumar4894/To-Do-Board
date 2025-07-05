import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { Input } from "../UIelements/Input";
import { Navbar } from "../components/Navbar";
import { ErrorText } from "../UIelements/ErrorText";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "email") {
      if (value.includes("@") && value.includes(".")) {
        setEmailError(false);
      }
    }
    if (name === "password") {
      if (value.length >= 6) {
        setPasswordError(false);
      }
    }
  };
  const handleBlur = (e) => {
    if (e.target.name === "email") {
      const isValid =
        formData.email.includes("@") && formData.email.includes(".");
      setEmailError(!isValid);
    }
  
    if (e.target.name === "password") {
      const isValid = formData.password.length >= 6;
      setPasswordError(!isValid);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            className={emailError ? "danger" : ""}
          />
         {emailError&& <ErrorText message="Enter a valid email!"/>}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            className={passwordError ? "danger" : ""}
          />
          {passwordError && (
            <ErrorText message="Password must be at least 6 characters!" />
          )}

          <label
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            Register as Admin
          </label>

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already a user? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </>
  );
};
