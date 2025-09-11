import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth } from "../firebaseConfig/firebase";
import EmailService from "../services/emailService";
import AlertCard from "../componenets/alert/Card";
import "./Signup.css";

export default function Signup() {
  const [universities, setUniversities] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campusLoading, setCampusLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [generatedEmailCode, setGeneratedEmailCode] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: email verification, 3: account creation
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Alert helper functions
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch university and password fields
  const watchUniversity = watch("university", "");
  const watchPassword = watch("password", "");

  // Fetch universities from Firebase
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);

        const universitiesCollection = collection(db, "universities");
        const universitiesSnapshot = await getDocs(universitiesCollection);

        if (!universitiesSnapshot.empty) {
          const universitiesData = universitiesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              docId: doc.id,
              id: data.id || doc.id,
              name: data.name,
              domain: data.domain,
              campuses: data.campuses,
              ...data,
            };
          });
          setUniversities(universitiesData);
        } else {
          setUniversities([]);
        }
      } catch {
        showAlert(
          "error",
          "Failed to load universities. Please refresh the page."
        );
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Fetch campuses when university is selected
  useEffect(() => {
    const fetchCampuses = async () => {
      if (watchUniversity && universities.length > 0) {
        try {
          setCampusLoading(true);

          let selectedUni = universities.find(
            (uni) => uni.id == watchUniversity
          );

          if (selectedUni && selectedUni.campuses) {
            const campusArray = Object.entries(selectedUni.campuses).map(
              ([key, campus]) => ({
                id: key,
                campusId: campus.campusId,
                name: campus.name,
                ...campus,
              })
            );
            setCampuses(campusArray);
          } else {
            setCampuses([]);
          }
        } catch {
          setCampuses([]);
        } finally {
          setCampusLoading(false);
        }
      } else {
        setCampuses([]);
        setCampusLoading(false);
      }
    };

    fetchCampuses();
  }, [watchUniversity, universities]);

  // Generate random 6-digit verification code for email
  const generateEmailVerificationCode = () => {
    return EmailService.generateVerificationCode();
  };

  // Send email verification code
  const sendEmailVerificationCode = async (email, code) => {
    try {
      const selectedUni = universities.find((uni) => uni.id == watchUniversity);
      const universityName = selectedUni ? selectedUni.name : "Your University";

      const result = await EmailService.sendVerificationEmail(
        email,
        code,
        universityName
      );

      if (result.success) {
        setGeneratedEmailCode(code);
        showAlert(
          "success",
          `Verification code sent to ${email}. Please check your email.`
        );
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch {
      showAlert(
        "error",
        "Failed to send verification email. Please try again."
      );
      return false;
    }
  };

  // Verify email code
  const verifyEmailCode = (enteredCode) => {
    if (!enteredCode || !generatedEmailCode) {
      return false;
    }

    const isValid = enteredCode.trim() === generatedEmailCode.trim();
    return isValid;
  };

  // Store user data in Firestore
  const storeUserData = async (userData, userId) => {
    const signupUsersRef = collection(db, "Signup User");
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
      // Step 1: Collect form data and move to email verification
      setStep(2);
    } else if (step === 2) {
      // Step 2: Send email verification code
      const code = generateEmailVerificationCode();
      setSignupLoading(true);
      const emailSent = await sendEmailVerificationCode(data.email, code);
      if (emailSent) {
        setStep(3);
      }
      setSignupLoading(false);
    } else if (step === 3) {
      // Step 3: Verify email code and create account
      if (!emailVerificationCode) {
        showAlert("error", "Please enter the email verification code");
        return;
      }

      if (verifyEmailCode(emailVerificationCode)) {
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
          await storeUserData(data, userCredential.user.uid);

          showAlert("success", "Account created successfully! 🎉");

          // Redirect to login after showing success message
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } catch (error) {
          showAlert("error", "Error creating account: " + error.message);
        } finally {
          setSignupLoading(false);
        }
      } else {
        showAlert(
          "error",
          "Invalid email verification code. Please try again."
        );
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

  // Generate email domain based on selected university
  const generateEmailDomain = () => {
    const selectedUni = universities.find((uni) => uni.id == watchUniversity); // Changed === to ==
    return selectedUni && selectedUni.domain
      ? `@${selectedUni.domain}`
      : "@university.edu.pk";
  };

  return (
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
                      const selectedUni = universities.find(
                        (uni) => uni.id == watchUniversity // Changed === to ==
                      );
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
                  Use your university email ending with {generateEmailDomain()}
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

          {/* Email Verification Input - Show only in step 3 */}
          {step === 3 && (
            <div className="form-group">
              <label htmlFor="emailVerificationCode" className="form-label">
                Email Verification Code
              </label>
              <input
                id="emailVerificationCode"
                type="text"
                className="form-control"
                placeholder="Enter 6-digit code from email"
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value)}
                maxLength={6}
              />
              <div className="email-verification-hint">
                Check your email for the 6-digit verification code
              </div>
              <div className="resend-code-section">
                <p className="resend-text">Didn't receive the code?</p>
                <button
                  type="button"
                  className="resend-btn"
                  onClick={async () => {
                    const formData = watch();
                    const code = generateEmailVerificationCode();
                    setSignupLoading(true);
                    await sendEmailVerificationCode(formData.email, code);
                    setSignupLoading(false);
                  }}
                  disabled={signupLoading}
                >
                  {signupLoading ? "Sending..." : "Resend Code"}
                </button>
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
              ? "Continue to Email Verification"
              : step === 2
              ? "Send Email Verification Code"
              : "Create Account"}
          </button>

          {/* Step indicator */}
          <div className="step-indicator">
            Step {step} of 3:{" "}
            {step === 1
              ? "Fill Details"
              : step === 2
              ? "Email Verification"
              : "Account Creation"}
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
  );
}
