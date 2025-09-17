import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUniversity,
  FaExternalLinkAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaSearch,
  FaShieldAlt,
  FaMedkit,
  FaBus,
  FaGraduationCap,
  FaBook,
  FaUsers,
} from "react-icons/fa";
import UniversityDetails from "../data/UniversityDetails";
import SEO from "../componenets/seo/SEO";
import "./Universities.css";

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  // Convert university details to array
  const universitiesArray = Object.values(UniversityDetails);

  useEffect(() => {
    let filtered = universitiesArray;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (uni) => uni.type.toLowerCase() === selectedType
      );
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter((uni) =>
        uni.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredUniversities(filtered);
  }, [searchTerm, selectedType, selectedLocation]);

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook />;
      case "twitter":
        return <FaTwitter />;
      case "linkedin":
        return <FaLinkedin />;
      case "youtube":
        return <FaYoutube />;
      default:
        return <FaGlobe />;
    }
  };

  const openUniversityDetails = (university) => {
    setSelectedUniversity(university);
  };

  const closeUniversityDetails = () => {
    setSelectedUniversity(null);
  };

  return (
    <>
      <SEO
        title="Pakistani Universities Directory | Campus Lost Found"
        description="Comprehensive directory of Pakistani universities with contact information, support services, and official links. Find university details, websites, help desk contacts, and emergency services."
        keywords={[
          "Pakistani universities directory",
          "university contact information Pakistan",
          "university help desk Pakistan",
          "Pakistani university websites",
          "university support services Pakistan",
          "HEC universities Pakistan",
          "university emergency contacts",
          "Pakistani university details",
          "university student services Pakistan",
          "university admissions Pakistan",
        ]}
      />

      <div className="universities-page">
        <div className="universities-hero">
          <div className="container">
            <h1 className="universities-title">
              Pakistani Universities Directory
            </h1>
            <p className="universities-subtitle">
              Comprehensive information about universities across Pakistan with
              official links, contact details, support services, and emergency
              contacts
            </p>
          </div>
        </div>

        <div className="container">
          {/* Search and Filter Section */}
          <div className="universities-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search universities by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="karachi">Karachi</option>
                <option value="multiple">Multiple Campuses</option>
              </select>
            </div>
          </div>

          {/* Universities Grid */}
          <div className="universities-grid">
            {filteredUniversities.map((university) => (
              <div key={university.id} className="university-card">
                <div className="university-header">
                  <div className="university-logo">
                    <img
                      src={university.logo}
                      alt={university.shortName}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="logo-fallback" style={{ display: "none" }}>
                      <FaUniversity />
                    </div>
                  </div>
                  <div className="university-info">
                    <h3 className="university-name">{university.shortName}</h3>
                    <p className="university-full-name">{university.name}</p>
                    <div className="university-meta">
                      <span
                        className={`type-badge ${university.type.toLowerCase()}`}
                      >
                        {university.type}
                      </span>
                      <span className="location">
                        <FaMapMarkerAlt /> {university.location}
                      </span>
                      <span className="established">
                        <FaCalendarAlt /> Est. {university.established}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="university-description">
                  {university.description}
                </p>

                <div className="university-actions">
                  <div className="quick-links">
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button primary"
                    >
                      <FaGlobe /> Visit Website
                    </a>
                    <a
                      href={`tel:${university.contact.phone}`}
                      className="action-button secondary"
                    >
                      <FaPhone /> Call
                    </a>
                    <a
                      href={`mailto:${university.contact.email}`}
                      className="action-button secondary"
                    >
                      <FaEnvelope /> Email
                    </a>
                  </div>

                  <button
                    onClick={() => openUniversityDetails(university)}
                    className="details-button"
                  >
                    View Details <FaExternalLinkAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="no-results">
              <FaUniversity className="no-results-icon" />
              <h3>No universities found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* University Details Modal */}
        {selectedUniversity && (
          <div
            className="university-modal-overlay"
            onClick={closeUniversityDetails}
          >
            <div
              className="university-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-university-info">
                  <img
                    src={selectedUniversity.logo}
                    alt={selectedUniversity.shortName}
                    className="modal-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="modal-logo-fallback"
                    style={{ display: "none" }}
                  >
                    <FaUniversity />
                  </div>
                  <div>
                    <h2>{selectedUniversity.name}</h2>
                    <p>
                      {selectedUniversity.location} • Est.{" "}
                      {selectedUniversity.established}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeUniversityDetails}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-section">
                  <h3>
                    <FaPhone /> Contact Information
                  </h3>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <strong>Phone:</strong>
                      <a href={`tel:${selectedUniversity.contact.phone}`}>
                        {selectedUniversity.contact.phone}
                      </a>
                    </div>
                    <div className="contact-item">
                      <strong>Email:</strong>
                      <a href={`mailto:${selectedUniversity.contact.email}`}>
                        {selectedUniversity.contact.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <strong>Website:</strong>
                      <a
                        href={selectedUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedUniversity.website} <FaExternalLinkAlt />
                      </a>
                    </div>
                    <div className="contact-item address">
                      <strong>Address:</strong>
                      <span>{selectedUniversity.contact.address}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>
                    <FaUsers /> Support Services
                  </h3>
                  <div className="support-grid">
                    <div className="support-item">
                      <h4>
                        <FaGraduationCap /> Admissions
                      </h4>
                      <p>
                        Phone:{" "}
                        <a
                          href={`tel:${selectedUniversity.support.admissions.phone}`}
                        >
                          {selectedUniversity.support.admissions.phone}
                        </a>
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${selectedUniversity.support.admissions.email}`}
                        >
                          {selectedUniversity.support.admissions.email}
                        </a>
                      </p>
                      <a
                        href={selectedUniversity.support.admissions.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Admissions Portal <FaExternalLinkAlt />
                      </a>
                    </div>

                    <div className="support-item">
                      <h4>
                        <FaBook /> Student Services
                      </h4>
                      <p>
                        Phone:{" "}
                        <a
                          href={`tel:${selectedUniversity.support.studentServices.phone}`}
                        >
                          {selectedUniversity.support.studentServices.phone}
                        </a>
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${selectedUniversity.support.studentServices.email}`}
                        >
                          {selectedUniversity.support.studentServices.email}
                        </a>
                      </p>
                      <a
                        href={
                          selectedUniversity.support.studentServices.website
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Student Services <FaExternalLinkAlt />
                      </a>
                    </div>

                    <div className="support-item">
                      <h4>
                        <FaPhone /> Help Desk
                      </h4>
                      <p>
                        Phone:{" "}
                        <a
                          href={`tel:${selectedUniversity.support.helpDesk.phone}`}
                        >
                          {selectedUniversity.support.helpDesk.phone}
                        </a>
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${selectedUniversity.support.helpDesk.email}`}
                        >
                          {selectedUniversity.support.helpDesk.email}
                        </a>
                      </p>
                      <a
                        href={selectedUniversity.support.helpDesk.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Help Center <FaExternalLinkAlt />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>
                    <FaShieldAlt /> Emergency Contacts
                  </h3>
                  <div className="emergency-grid">
                    <div className="emergency-item">
                      <FaShieldAlt className="emergency-icon" />
                      <div>
                        <strong>Security</strong>
                        <a
                          href={`tel:${selectedUniversity.emergencyContact.security}`}
                        >
                          {selectedUniversity.emergencyContact.security}
                        </a>
                      </div>
                    </div>
                    <div className="emergency-item">
                      <FaMedkit className="emergency-icon" />
                      <div>
                        <strong>Medical</strong>
                        <a
                          href={`tel:${selectedUniversity.emergencyContact.medical}`}
                        >
                          {selectedUniversity.emergencyContact.medical}
                        </a>
                      </div>
                    </div>
                    <div className="emergency-item">
                      <FaBus className="emergency-icon" />
                      <div>
                        <strong>Transport</strong>
                        <a
                          href={`tel:${selectedUniversity.emergencyContact.transport}`}
                        >
                          {selectedUniversity.emergencyContact.transport}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>
                    <FaExternalLinkAlt /> Quick Links
                  </h3>
                  <div className="quick-links-grid">
                    {selectedUniversity.quickLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quick-link-item"
                      >
                        {link.name} <FaExternalLinkAlt />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Social Media</h3>
                  <div className="social-links">
                    {Object.entries(selectedUniversity.socialMedia).map(
                      ([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          title={
                            platform.charAt(0).toUpperCase() + platform.slice(1)
                          }
                        >
                          {getSocialIcon(platform)}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Universities;
