import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { Input } from "../UIelements/Input";
import { Navbar } from "../components/Navbar";
import { ErrorText } from "../UIelements/ErrorText";   

export const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value.includes("@") && value.includes(".")) {
      setErrors((prev) => ({ ...prev, email: false }));
    }

    if (name === "password" && value.length >= 6) {
      setErrors((prev) => ({ ...prev, password: false }));
    }
  };

  const handleBlur = ({ target: { name, value } }) => {
    if (name === "email") {
      const isValid = value.includes("@") && value.includes(".");
      setErrors((prev) => ({ ...prev, email: !isValid }));
    }

    if (name === "password") {
      const isValid = value.length >= 6;
      setErrors((prev) => ({ ...prev, password: !isValid }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign-in Data:", formData);
    // Add actual sign-in logic here
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email ? "danger" : ""}
          />
          {errors.email && <ErrorText message="Enter a valid email!" />}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password ? "danger" : ""}
          />
          {errors.password && (
            <ErrorText message="Password must be at least 6 characters" />
          )}

          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </>
  );
};
