/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";

// import  {  useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Login.css";
import { auth } from "../firebaseConfig/firebaseCore";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { isValidDomain } from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import SEO from "../componenets/seo/SEO";

const Login = React.memo(() => {
  // ...existing code...
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const validationPatterns = useMemo(
    () => ({
      email:
        /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    }),
    []
  );

  const validateUniversityDomain = useCallback((email) => {
    if (!email) return true;
    const emailDomain = email.split("@")[1];
    if (!emailDomain) return false;
    return isValidDomain(emailDomain);
  }, []);

  const loginUser = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        if (!validateUniversityDomain(email)) {
          throw new Error(
            "Please use your university email address. Only registered university domains are allowed."
          );
        }
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (!userCredential.user.emailVerified) {
          throw new Error(
            "Please verify your email before logging in. Check your email inbox for the verification link."
          );
        }
        setTimeout(() => {
          const redirectTo = location.state?.redirectTo || "/";
          navigate(redirectTo);
        }, 1500);
      } finally {
        setLoading(false);
      }
    },
    [validateUniversityDomain, navigate, location.state]
  );

  useEffect(() => {
    const checkStoredCredentials = () => {
      const storedEmail = localStorage.getItem("rememberedEmail");
      const storedPassword = localStorage.getItem("rememberedPassword");
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      if (storedEmail && storedPassword && rememberMe) {
        setValue("email", storedEmail);
        setValue("password", storedPassword);
        setValue("rememberMe", true);
      }
    };
    checkStoredCredentials();
  }, [setValue]);

  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      const redirectTo = location.state?.redirectTo || "/";
      navigate(redirectTo);
    }
  }, [isAuthenticated, isEmailVerified, navigate, location.state]);

  const onSubmit = useCallback(
    async (data) => {
      setFormError("");
      try {
        await loginUser(data.email, data.password);
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberedPassword", data.password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }
      } catch (error) {
        setFormError(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    },
    [loginUser]
  );

  // ...existing code...

  return (
    <>
      <SEO
        title="Login to Campus Lost Found Pakistan | Sign In University Students | Access Your Account"
        description="Sign in to your Campus Lost Found account and access Pakistan's premier university lost and found platform. Login with your verified university email to report lost items, browse found items, and connect with your campus community."
        keywords={[
          "login campus lost found Pakistan",
          "sign in university students Pakistan",
          "university login Pakistan",
          "student account access Pakistan",
          "campus lost found login",
          "Pakistani university sign in",
          "student portal login Pakistan",
          "university email login",
          "campus community login Pakistan",
          "lost found account access",
          "Pakistani student login",
          "university portal sign in",
          "campus login Pakistan",
          "student authentication Pakistan",
          "university account access",
        ]}
        keySentences={[
          "Secure login with university email verification ensures authentic access",
          "Remember me feature saves credentials for convenient future access",
          "Password requirements include uppercase, lowercase, numbers, and special characters",
          "University domain validation confirms student status and eligibility",
          "Instant access to lost and found reporting after successful authentication",
          "Email verification protects account security and prevents unauthorized access",
          "Mobile-responsive login interface works on all devices and browsers",
          "Forgot password option helps students recover access quickly",
          "Two-factor authentication available for enhanced account security",
          "Automatic redirect to dashboard after successful login verification",
          "Error handling provides clear feedback for login issues",
          "Session management keeps users logged in securely",
          "Account lockout protection prevents brute force attacks",
          "Privacy policy compliance ensures student data protection",
          "24/7 login availability supports students across all time zones",
        ]}
        url="https://campuslostfound.vercel.app/login"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Login"
        author="Campus Lost Found Team"
        links={[
          {
            rel: "canonical",
            href: "https://campuslostfound.vercel.app/login",
          },
        ]}
        customMeta={[
          { name: "page-type", content: "authentication-login" },
          { name: "content-category", content: "user-authentication" },
          { name: "audience", content: "university-students-pakistan" },
          { name: "primary-action", content: "user-login" },
          { name: "security-level", content: "university-email-verification" },
        ]}
      />
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
                    value: validationPatterns.email,
                    message: "Please enter a valid email address",
                  },
                  validate: {
                    universityDomain: (value) =>
                      validateUniversityDomain(value) ||
                      "Please use your university email address. Only registered university domains are allowed.",
                  },
                })}
              />
              {errors.email && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.email.message}
                </div>
              )}
              {formError && !errors.email && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formError}
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
                    value: validationPatterns.password,
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
              {formError && !errors.password && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formError}
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
              <Link
                to="/forgot-password"
                className="forgot-password"
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>
           
            {/* Submit Button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            {/* Sign Up Link */}
            <div className="signup-link">
              <p>
                Don't have an account?
                <Link to="/signup"> Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
});

Login.displayName = "Login";

export default Login;
