import React, { useState, useCallback } from "react";
import { CiHeart } from "react-icons/ci";
import "./herosection.css";
import { GoDotFill } from "react-icons/go";
import { IoIosSchool } from "react-icons/io";
import Button from "../button/Button";
import SEO from "../seo/SEO";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import ReportItemForm from "../reportForm/ReportItemForm";
import { authValidationUtils } from "../../utils/authValidation";

const Herosection = React.memo(() => {
  const [showReportForm, setShowReportForm] = useState(false);
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const navigate = useNavigate();

  // Memoized handlers to prevent unnecessary re-renders
  const handleReportItemClick = useCallback(() => {
    const validation = authValidationUtils.validateReportAccess(
      user,
      isAuthenticated,
      isEmailVerified
    );

    if (!validation.canReport) {
      validation.errors.forEach((error) => {
        if (error.action === "redirect_login") {
          // Navigate to login with state containing the message
          navigate("/login", {
            state: {
              message: error.message,
              from: "report-item",
              redirectTo: "/report",
            },
          });
        } else if (error.action === "show_alert") {
          // Show alert for other errors (email verification, university domain)
          alert(error.message);
        }
      });
      return;
    }

    setShowReportForm(true);
  }, [user, isAuthenticated, isEmailVerified, navigate]);

  const handleReportFormSubmit = useCallback(() => {
    setShowReportForm(false);
  }, []);

  const handleReportFormClose = useCallback(() => {
    setShowReportForm(false);
  }, []);

  const handleBrowseFoundItems = useCallback(() => {
    // TODO: Navigate to found items page
  }, []);

  return (
    <>
      <SEO
        title="Report Lost Items & Find Found Items | Campus Lost Found Pakistan | University Students Help"
        description="Report your lost items or browse found items at Pakistani universities. Our hero platform connects 2,300+ university students across Pakistan to help recover lost belongings like phones, wallets, keys, and academic materials through community support."
        keywords={[
          "report lost items Pakistan",
          "find found items university",
          "lost phone campus Pakistan",
          "lost wallet university students",
          "lost keys Pakistani campus",
          "university lost property report",
          "campus found items browse",
          "Pakistani student community help",
          "lost belongings recovery Pakistan",
          "university lost and found hero",
          "campus safety network Pakistan",
          "student help community Pakistan",
          "lost items reporting system",
          "found property university Pakistan",
          "campus lost belongings service",
        ]}
        keySentences={[
          "Report your lost items instantly with detailed descriptions and photos",
          "Browse found items across Pakistani universities to recover your belongings",
          "Community-driven platform connects students who want to help each other",
          "University email verification ensures secure and authentic user participation",
          "Real-time notifications alert you when matching items are reported",
          "Advanced search filters help locate specific items quickly and efficiently",
          "Mobile-friendly interface enables reporting from anywhere on campus",
          "Photo upload feature improves item identification and recovery success",
          "Location tracking helps pinpoint exact areas where items were lost",
          "Success stories inspire continued community participation and engagement",
          "Free service reduces financial burden of replacing lost items",
          "24/7 availability supports students across all time zones",
          "Privacy protection ensures student information remains secure",
          "Easy reporting process takes less than 2 minutes to complete",
          "Campus network coverage includes 43+ Pakistani universities nationwide",
        ]}
        url="https://campuslostfound.vercel.app/hero"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Hero Section"
        author="Campus Lost Found Team"
        links={[
          { rel: "canonical", href: "https://campuslostfound.vercel.app/hero" },
        ]}
        customMeta={[
          { name: "page-type", content: "hero-landing" },
          { name: "content-category", content: "student-services" },
          { name: "audience", content: "university-students-pakistan" },
          { name: "service-area", content: "Pakistan-universities" },
          { name: "primary-action", content: "report-lost-items" },
          { name: "secondary-action", content: "browse-found-items" },
        ]}
      />
      <main className="hero-section">
        <div className="hero-content">
          <div
            className="hero-icon"
            aria-label="Heart icon representing community care"
          >
            <CiHeart className="icon" />
          </div>

          <header className="hero-text">
            <h1 className="hero-title heading">Lost Something?</h1>
            <h2 className="hero-subtitle sub-heading">
              Let's Find it Together
            </h2>
            <p className="hero-description description">
              Join our community of helpful neighbors. Report lost items, share
              found treasures, and help reunite people with their belongings.
            </p>
          </header>

          <section className="herosection-status">
            <div className="status1 status">
              <span className="icon icon1">
                <GoDotFill />
              </span>
              127 items waiting to be found
            </div>
            <div className="status2 status">
              <span className="icon icon2">
                <GoDotFill />
              </span>
              50 happy reunions
            </div>
            <div className="status3 status">
              <span className="icon icon3">
                <IoIosSchool />
              </span>
              2,300+ universities
            </div>
          </section>

          <section className="herosection-btns">
            <div className="btn1">
              <Button
                text="Report Lost Item"
                className="hero-btn hero-btn-primary"
                onClick={handleReportItemClick}
              />
            </div>
            <div className="btn2">
              <Button
                text="Browse Found Items"
                className="hero-btn hero-btn-secondary"
                onClick={handleBrowseFoundItems}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportItemForm
          onClose={handleReportFormClose}
          onSubmit={handleReportFormSubmit}
        />
      )}
    </>
  );
});

Herosection.displayName = "Herosection";

export default Herosection;
