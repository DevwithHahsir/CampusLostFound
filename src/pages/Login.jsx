import React from "react";
import { useForm } from "react-hook-form";
import "./Login.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Handle login logic here
  };

  // Strong email regex pattern
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  // Strong password regex (8+ chars, uppercase, lowercase, number, special char)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    <main className="login-main-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to your Campus Lost Found account
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              University Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? "error" : ""}`}
              placeholder="Enter your university email"
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: emailRegex,
                  message: "Please enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-control ${errors.password ? "error" : ""}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    "Password must contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)",
                },
              })}
            />

            {errors.password && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.password.message}
              </div>
            )}


          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-btn">
            Sign In
          </button>

          {/* Sign Up Link */}
          <div className="signup-link">
            <p>
              Don't have an account?
              <a href="/signup"> Create Account</a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
