import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebaseConfig/firebaseCore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import AlertCard from "../componenets/alert/Card";
import {
  basicUniversities,
  getCampusesForUniversity,
} from "../data/UniversityDomains";
import { useAuth } from "../AuthContext/AuthContext";
import SEO from "../componenets/seo/SEO";
import "./Signup.css";

const Signup = React.memo(() => {
  const [universities, setUniversities] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campusLoading, setCampusLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [createdUser, setCreatedUser] = useState(null);

  // Use Auth Context
  const { isAuthenticated, isEmailVerified } = useAuth();

  // Redirect if user is already logged in and verified
  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isEmailVerified]);

  // Memoized alert helper functions
  const showAlert = useCallback((type, message) => {
    setAlert({ show: true, type, message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ show: false, type: "", message: "" });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch university and password fields
  const watchUniversity = watch("university", "");
  const watchPassword = watch("password", "");

  // Load universities from local data - OPTIMIZED: Use lightweight basic list for fast initial load
  useEffect(() => {
    try {
      setUniversities(basicUniversities);
      setLoading(false);
    } catch {
      showAlert(
        "error",
        "Failed to load universities. Please refresh the page."
      );
      setUniversities([]);
      setLoading(false);
    }
  }, [showAlert]);

  // Create a memoized university lookup map for O(1) access instead of O(n) find()
  const universityLookup = useMemo(() => {
    const lookup = {};
    universities.forEach((uni) => {
      lookup[uni.id] = uni;
    });
    return lookup;
  }, [universities]);

  // Load campuses when university is selected - OPTIMIZED: Lazy load campus data
  useEffect(() => {
    const loadCampuses = async () => {
      if (watchUniversity && universities.length > 0) {
        try {
          setCampusLoading(true);

          // Use lazy-loaded campus data from UniversityDomains
          const campusData = await getCampusesForUniversity(watchUniversity);

          if (campusData && campusData.length > 0) {
            setCampuses(campusData);
          } else {
            // Fallback to basic campus if no campus data found
            const selectedUni = universityLookup[watchUniversity];
            if (selectedUni) {
              const basicCampuses = [
                {
                  id: "main",
                  campusId: selectedUni.id * 10 + 1,
                  name: "Main Campus",
                },
              ];
              setCampuses(basicCampuses);
            } else {
              setCampuses([]);
            }
          }
        } catch (error) {
          console.error("Error loading campuses:", error);
          setCampuses([]);
        } finally {
          setCampusLoading(false);
        }
      } else {
        setCampuses([]);
        setCampusLoading(false);
      }
    };

    loadCampuses();
  }, [watchUniversity, universityLookup, universities.length]);

  // Send Firebase email verification
  const sendFirebaseEmailVerification = async (user) => {
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + "/login",
        handleCodeInApp: false,
      });

      showAlert(
        "success",
        "Verification email sent! Please check your inbox and click the verification link."
      );
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      showAlert("error", "Failed to send verification email: " + error.message);
      return false;
    }
  };

  // Store user data in Firestore
  const storeUserData = async (userData, userId, firestoreInstance) => {
    const signupUsersRef = collection(firestoreInstance, "Signup User");
    await addDoc(signupUsersRef, {
      userId: userId,
      fullName: userData.fullName,
      email: userData.email,
      university: userData.university,
      campus: userData.campus,
      emailVerified: true,
      createdAt: new Date(),
      status: "verified",
    });
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      // Step 1: Create account and send verification email
      setSignupLoading(true);
      try {
        // Create email/password account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        // Update user profile
        await updateProfile(userCredential.user, {
          displayName: data.fullName,
        });

        // Store additional user data in Firestore
        await storeUserData(data, userCredential.user.uid, db);

        // Send Firebase email verification
        const emailSent = await sendFirebaseEmailVerification(
          userCredential.user
        );

        if (emailSent) {
          setCreatedUser(userCredential.user);
          setStep(2);
          showAlert(
            "success",
            "Account created! Please check your email for verification link."
          );
        }
      } catch (error) {
        console.error("Signup error:", error);

        // Handle specific Firebase auth errors with user-friendly messages
        let errorMessage = "Failed to create account. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage =
            "An account with this email already exists. Please try logging in instead.";
        } else if (error.code === "auth/weak-password") {
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address.";
        } else if (error.code === "auth/operation-not-allowed") {
          errorMessage =
            "Email/password accounts are not enabled. Please contact support.";
        }

        showAlert("error", errorMessage);
      } finally {
        setSignupLoading(false);
      }
    } else if (step === 2) {
      // Step 2: Check email verification status
      setSignupLoading(true);
      try {
        if (createdUser) {
          await createdUser.reload(); // Refresh user data

          if (createdUser.emailVerified) {
            showAlert(
              "success",
              "Email verified successfully! Redirecting to login..."
            );
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            showAlert(
              "error",
              "Email not verified yet. Please check your email and click the verification link."
            );
          }
        }
      } catch (error) {
        showAlert(
          "error",
          "Error checking verification status: " + error.message
        );
      } finally {
        setSignupLoading(false);
      }
    }
  };

  // Strong email regex pattern
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  // Strong password regex (8+ chars, uppercase, lowercase, number, special char)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Full name regex (only letters and spaces)
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;

  // Generate email domain based on selected university - OPTIMIZED: Use memoized lookup
  const generateEmailDomain = () => {
    const selectedUni = universityLookup[watchUniversity];
    return selectedUni && selectedUni.domain
      ? `@${selectedUni.domain}`
      : "@university.edu.pk";
  };

  return (
    <>
      <SEO
        title="Sign Up Campus Lost Found Pakistan | Create Account University Students | Join Community"
        description="Create your Campus Lost Found account with your university email and join Pakistan's largest student community. Sign up to report lost items, browse found items, and help fellow students across 43+ Pakistani universities."
        keywords={[
          "signup campus lost found Pakistan",
          "create account university Pakistan",
          "register student Pakistan",
          "university registration Pakistan",
          "join campus community Pakistan",
          "student account creation",
          "Pakistani university signup",
          "campus lost found registration",
          "university email signup",
          "student community join Pakistan",
          "lost found account create",
          "university student registration",
          "campus account signup",
          "Pakistani student register",
          "university community join",
        ]}
        keySentences={[
          "Quick registration process takes less than 3 minutes to complete",
          "University email verification ensures authentic student community membership",
          "Choose from 43+ verified Pakistani universities during registration",
          "Strong password requirements protect your account from unauthorized access",
          "Profile customization helps other students identify and contact you",
          "Email verification link sent immediately after account creation",
          "Account activation enables full access to lost and found features",
          "Student ID verification optional for enhanced trust and credibility",
          "Privacy settings control how much information other students can see",
          "Mobile-responsive registration works seamlessly on all devices",
          "Campus selection helps connect you with nearby students",
          "Account recovery options ensure you never lose access permanently",
          "Terms acceptance includes student conduct guidelines and policies",
          "Welcome email provides platform orientation and getting started tips",
          "Immediate access to browse existing lost and found items",
        ]}
        url="https://campuslostfound.vercel.app/signup"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Sign Up"
        author="Campus Lost Found Team"
        links={[
          {
            rel: "canonical",
            href: "https://campuslostfound.vercel.app/signup",
          },
        ]}
        customMeta={[
          { name: "page-type", content: "user-registration" },
          { name: "content-category", content: "account-creation" },
          { name: "audience", content: "new-university-students-pakistan" },
          { name: "primary-action", content: "account-registration" },
          { name: "verification-required", content: "university-email" },
        ]}
      />
      <main className="signup-main-container">
        {/* Alert Component */}
        {alert.show && (
          <AlertCard
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
            isVisible={alert.show}
          />
        )}

        <div className="signup-wrapper">
          <div className="signup-header">
            <h1 className="signup-title">Join Campus Community</h1>
            <p className="signup-subtitle">
              Create your Campus Lost Found account
            </p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={`form-control ${errors.fullName ? "error" : ""}`}
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Full name is required",
                  pattern: {
                    value: nameRegex,
                    message:
                      "Name should only contain letters and spaces (2-50 characters)",
                  },
                })}
              />

              {errors.fullName && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.fullName.message}
                </div>
              )}
            </div>

            {/* University Selection */}
            <div className="form-group">
              <label htmlFor="university" className="form-label">
                Select University
              </label>
              {loading ? (
                <div className="loading-message">
                  <span className="loader"></span>
                  Loading universities...
                </div>
              ) : (
                <select
                  id="university"
                  className={`form-control ${errors.university ? "error" : ""}`}
                  {...register("university", {
                    required: "Please select your university",
                    onChange: () => {
                      setCampuses([]);
                    },
                  })}
                >
                  <option value="">Choose your university</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              )}

              {errors.university && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.university.message}
                </div>
              )}
            </div>

            {/* Campus Selection */}
            <div className="form-group">
              <label htmlFor="campus" className="form-label">
                Select Campus
              </label>
              {campusLoading ? (
                <div className="loading-message">
                  <span className="loader"></span>
                  Loading campuses...
                </div>
              ) : (
                <select
                  id="campus"
                  className={`form-control ${errors.campus ? "error" : ""}`}
                  disabled={!watchUniversity || campuses.length === 0}
                  {...register("campus", {
                    required: watchUniversity
                      ? "Please select your campus"
                      : false,
                  })}
                >
                  <option value="">
                    {watchUniversity
                      ? campuses.length > 0
                        ? "Choose your campus"
                        : "No campuses available"
                      : "Select university first"}
                  </option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.campusId}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              )}

              {errors.campus && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.campus.message}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                University Email Address
              </label>
              <div className="email-input-wrapper">
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "error" : ""}`}
                  placeholder={`Enter your email ${generateEmailDomain()}`}
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: emailRegex,
                      message: "Please enter a valid email address",
                    },
                    validate: {
                      universityDomain: (value) => {
                        if (!watchUniversity)
                          return "Please select university first";

                        // Use memoized lookup instead of expensive find()
                        const selectedUni = universityLookup[watchUniversity];
                        if (!selectedUni || !selectedUni.domain) {
                          return "University domain not found";
                        }
                        const emailDomain = value.split("@")[1];
                        return (
                          emailDomain === selectedUni.domain ||
                          `Email must end with @${selectedUni.domain}`
                        );
                      },
                    },
                  })}
                />
                {watchUniversity && (
                  <div className="domain-hint">
                    Use your university email ending with{" "}
                    {generateEmailDomain()}
                  </div>
                )}
              </div>

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
                placeholder="Create a strong password"
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

              <div className="password-requirements">
                <p className="requirements-title">Password Requirements:</p>
                <ul className="requirements-list">
                  <li>At least 8 characters long</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                  <li>One special character (@$!%*?&)</li>
                </ul>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-control ${
                  errors.confirmPassword ? "error" : ""
                }`}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: {
                    matchPassword: (value) =>
                      value === watchPassword || "Passwords do not match",
                  },
                })}
              />

              {errors.confirmPassword && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            {/* Email Verification Status - Show only in step 2 */}
            {step === 2 && (
              <div className="form-group">
                <div className="verification-status">
                  <h3 className="verification-title">
                    📧 Email Verification Required
                  </h3>
                  <p className="verification-message">
                    We've sent a verification email to your inbox. Please click
                    the verification link in the email to complete your
                    registration.
                  </p>
                  <div className="verification-instructions">
                    <h4>Next Steps:</h4>
                    <ol>
                      <li>Check your email inbox (and spam folder)</li>
                      <li>
                        Click the verification link in the email from Firebase
                      </li>
                      <li>
                        Return here and click "Check Email Verification" button
                      </li>
                    </ol>
                  </div>
                  <div className="resend-section">
                    <p className="resend-text">Didn't receive the email?</p>
                    <button
                      type="button"
                      className="resend-btn"
                      onClick={async () => {
                        if (createdUser) {
                          setSignupLoading(true);
                          await sendFirebaseEmailVerification(createdUser);
                          setSignupLoading(false);
                        }
                      }}
                      disabled={signupLoading}
                    >
                      {signupLoading
                        ? "Sending..."
                        : "Resend Verification Email"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the{" "}
                  <a href="#" className="terms-link">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="terms-link">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {errors.terms && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.terms.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="signup-btn"
              disabled={loading || signupLoading}
            >
              {signupLoading
                ? "Processing..."
                : step === 1
                ? "Create Account & Send Verification Email"
                : "Check Email Verification"}
            </button>

            {/* Step indicator */}
            <div className="step-indicator">
              Step {step} of 2:{" "}
              {step === 1 ? "Create Account" : "Email Verification"}
            </div>

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account?
                <a href="/login"> Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
});

Signup.displayName = "Signup";

export default Signup;
