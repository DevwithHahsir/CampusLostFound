import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseCore";

// Note: This service is now deprecated in favor of Formspree integration
// Forms now use @formspree/react directly in the components

// Save partnership request to Firestore
const saveToDatabase = async (partnershipData) => {
  try {
    const docRef = await addDoc(collection(db, "partnership_requests"), {
      ...partnershipData,
      createdAt: serverTimestamp(),
      status: "pending",
      isRead: false,
    });

    console.log("Partnership request saved with ID:", docRef.id);
    return {
      success: true,
      id: docRef.id,
      message: "Partnership request saved successfully",
    };
  } catch (error) {
    console.error("Database save error:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to save partnership request to database",
    };
  }
};

// Replace with your actual Formspree endpoint URL
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzzalyde"; // TODO: update with your Formspree form ID

// Send email notification using Formspree
const sendEmailNotification = async (partnershipData) => {
  try {
    const formData = {
      subject: `Partnership Request - ${partnershipData.universityName}`,
      university_name: partnershipData.universityName,
      contact_person: partnershipData.contactPerson,
      position: partnershipData.position,
      email: partnershipData.email,
      phone: partnershipData.phone || "Not provided",
      message: partnershipData.message,
      _replyto: partnershipData.email,
      _subject: `Partnership Request - ${partnershipData.universityName}`,
    };

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log("Partnership email sent successfully via Formspree");
      return {
        success: true,
        response: await response.json(),
        message: "Email notification sent successfully",
      };
    } else {
      const errorData = await response.json();
      throw new Error(
        `Formspree error: ${errorData.error || response.statusText}`
      );
    }
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email notification",
    };
  }
};

// Alternative email method using mailto (fallback)
const sendEmailFallback = (partnershipData) => {
  try {
    const emailBody = `
Partnership Request Details:

University Name: ${partnershipData.universityName}
Contact Person: ${partnershipData.contactPerson}
Position: ${partnershipData.position}
Email: ${partnershipData.email}
Phone: ${partnershipData.phone || "Not provided"}

Message:
${partnershipData.message}

Submitted on: ${new Date().toLocaleString()}
    `.trim();

    const subject = encodeURIComponent(
      `Partnership Request - ${partnershipData.universityName}`
    );
    const body = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:campuslostfound@gmail.com?subject=${subject}&body=${body}`;

    window.open(mailtoLink, "_blank");

    return {
      success: true,
      message: "Email client opened with partnership details",
    };
  } catch (error) {
    console.error("Mailto fallback error:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to open email client",
    };
  }
};

// Main function to submit partnership request
export const submitPartnershipRequest = async (partnershipData) => {
  const results = {
    database: { success: false },
    email: { success: false },
    overall: { success: false },
  };

  try {
    // Validate required fields
    const requiredFields = [
      "universityName",
      "contactPerson",
      "position",
      "email",
      "message",
    ];
    const missingFields = requiredFields.filter(
      (field) => !partnershipData[field]
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Add metadata
    const enrichedData = {
      ...partnershipData,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      source: "website_contact_form",
    };

    // 1. Save to database first
    console.log("Saving partnership request to database...");
    results.database = await saveToDatabase(enrichedData);

    // 2. Send email notification
    console.log("Sending email notification via Formspree...");
    results.email = await sendEmailNotification(enrichedData);

    // If Formspree fails, try fallback
    if (!results.email.success) {
      console.log("Formspree failed, trying fallback method...");
      results.email = sendEmailFallback(enrichedData);
    }

    // Determine overall success
    results.overall.success = results.database.success || results.email.success;

    if (results.overall.success) {
      results.overall.message = "Partnership request submitted successfully!";

      if (results.database.success && results.email.success) {
        results.overall.details = "Request saved to database and email sent";
      } else if (results.database.success) {
        results.overall.details =
          "Request saved to database, email notification may be delayed";
      } else if (results.email.success) {
        results.overall.details =
          "Email sent successfully, database save failed";
      }
    } else {
      results.overall.message = "Failed to submit partnership request";
      results.overall.details =
        "Both database save and email notification failed";
    }

    return results;
  } catch (error) {
    console.error("Partnership submission error:", error);

    results.overall = {
      success: false,
      error: error.message,
      message: "Failed to submit partnership request",
      details: error.message,
    };

    return results;
  }
};

// Function to get all partnership requests (for admin dashboard)
export const getPartnershipRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "partnership_requests"));
    const requests = [];

    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by creation date (newest first)
    requests.sort((a, b) => {
      const aDate = a.createdAt?.toDate() || new Date(a.submittedAt || 0);
      const bDate = b.createdAt?.toDate() || new Date(b.submittedAt || 0);
      return bDate - aDate;
    });

    return {
      success: true,
      data: requests,
      count: requests.length,
    };
  } catch (error) {
    console.error("Error fetching partnership requests:", error);
    return {
      success: false,
      error: error.message,
      data: [],
      count: 0,
    };
  }
};

export default {
  submitPartnershipRequest,
  getPartnershipRequests,
};
