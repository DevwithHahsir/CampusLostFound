import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig/firebaseCore";

class PhoneVerificationService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // Setup reCAPTCHA verifier
  async setupRecaptcha(elementId = "recaptcha-container") {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      },
    });

    return this.recaptchaVerifier;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    try {
      // Format phone number to include country code if not present
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      if (!this.recaptchaVerifier) {
        await this.setupRecaptcha();
      }

      const authInstance = auth;
      this.confirmationResult = await signInWithPhoneNumber(
        authInstance,
        formattedNumber,
        this.recaptchaVerifier
      );

      return {
        success: true,
        message:
          "OTP sent successfully to " + this.maskPhoneNumber(formattedNumber),
      };
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Reset reCAPTCHA on error
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Verify OTP code
  async verifyOTP(code) {
    try {
      if (!this.confirmationResult) {
        throw new Error(
          "No confirmation result found. Please request OTP first."
        );
      }

      const result = await this.confirmationResult.confirm(code);
      return {
        success: true,
        user: result.user,
        message: "Phone number verified successfully!",
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        message:
          error.code === "auth/invalid-verification-code"
            ? "Invalid verification code. Please try again."
            : "Verification failed. Please try again.",
      };
    }
  }

  // Link phone credential to existing user account
  async linkPhoneToAccount(user, code) {
    try {
      if (!this.confirmationResult) {
        throw new Error(
          "No confirmation result found. Please request OTP first."
        );
      }

      const credential = PhoneAuthProvider.credential(
        this.confirmationResult.verificationId,
        code
      );

      const result = await linkWithCredential(user, credential);
      return {
        success: true,
        user: result.user,
        message: "Phone number linked successfully!",
      };
    } catch (error) {
      console.error("Error linking phone:", error);
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Format phone number to include country code
  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // If number doesn't start with country code, add Pakistan's code (+92)
    if (cleaned.length === 10 && !cleaned.startsWith("92")) {
      return "+92" + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
      // Remove leading 0 and add +92
      return "+92" + cleaned.substring(1);
    } else if (cleaned.length === 12 && cleaned.startsWith("92")) {
      return "+" + cleaned;
    } else if (cleaned.length === 13 && cleaned.startsWith("+92")) {
      return cleaned;
    }

    // Default: assume it's already properly formatted
    return phoneNumber.startsWith("+") ? phoneNumber : "+" + phoneNumber;
  }

  // Mask phone number for display
  maskPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      const countryCode = cleaned.substring(0, cleaned.length - 10);
      const number = cleaned.substring(cleaned.length - 10);
      return `+${countryCode} ${number.substring(0, 3)} ***-${number.substring(
        6
      )}`;
    }
    return phoneNumber;
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/invalid-phone-number":
        "Invalid phone number format. Please check and try again.",
      "auth/missing-phone-number": "Phone number is required.",
      "auth/too-many-requests": "Too many requests. Please try again later.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/operation-not-allowed": "Phone authentication is not enabled.",
      "auth/invalid-verification-code":
        "Invalid verification code. Please try again.",
      "auth/invalid-verification-id":
        "Invalid verification ID. Please request a new OTP.",
      "auth/code-expired":
        "Verification code has expired. Please request a new one.",
      "auth/credential-already-in-use":
        "This phone number is already linked to another account.",
      "auth/provider-already-linked":
        "Phone number is already linked to this account.",
    };

    return errorMessages[errorCode] || "An error occurred. Please try again.";
  }

  // Clean up resources
  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}

export default PhoneVerificationService;
