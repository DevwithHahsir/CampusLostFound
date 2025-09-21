import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (email) => {
    console.log("Forgot password requested for email:", email);
    const auth = getAuth();
    console.log("Auth object:", auth);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://campuslostfound.vercel.app/login",
        handleCodeInApp: true,
      });
      console.log("Password reset email sent successfully.");
      alert("Password reset link sent to your email!");
    } catch (error) {
      console.error("Error in resetting password:", error);
      alert(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with email:", email);
    handleForgotPassword(email);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 12,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
