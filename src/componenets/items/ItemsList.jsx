/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseCore";
import { useAuth } from "../../AuthContext/AuthContext";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { TbFileDescription } from "react-icons/tb";
import "./ItemsList.css";

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'lost', 'found'
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Extract university domain from user email
  const getUserUniversityDomain = (email) => {
    if (!email) return null;
    const domain = email.split("@")[1];
    return domain;
  };

  // Fetch items from Firebase with university filtering
  useEffect(() => {
    // Always refetch items when user logs in or auth finishes
    if (authLoading) {
      setLoading(true);
      return;
    }

    const fetchItems = async () => {
      try {
        // If user is not authenticated, show no items
        if (!isAuthenticated || !user?.email) {
          setItems([]);
          setError(
            "Please log in to view lost and found items from your university.\nTry Again"
          );
          setLoading(false);
          return;
        }

        // Clear any previous errors
        setError(null);

        const userDomain = getUserUniversityDomain(user.email);

        if (!userDomain) {
          setItems([]);
          setError(
            "Unable to determine your university from your email address."
          );
          setLoading(false);
          return;
        }

        const itemsCollection = collection(db, "items");
        const q = query(
          itemsCollection,
          where("university.domain", "==", userDomain)
        );
        const querySnapshot = await getDocs(q);

        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });

        // Sort the results by createdAt in JavaScript
        fetchedItems.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

        // ...existing code...
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        // ...existing code...
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [isAuthenticated, user?.email, authLoading]);

  // Filter items based on status
  const filteredItems = items.filter((item) => {
    // Only show active, non-deleted items
    if (item.isDeleted || item.status !== "active") return false;

    if (filter === "all") return true;
    return item.role === filter;
  });

  // ...existing code...

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Handle contact button click
  const handleContactClick = (item) => {
    const contactInfo = item.contact || {};
    const email = contactInfo.email || "Not provided";
    const phone = contactInfo.phone || "Not provided";
    const preference = contactInfo.preference || "email";

    alert(
      `Contact Info:\nEmail: ${email}\nPhone: ${phone}\nPreferred Contact: ${preference}`
    );
  };

  if (authLoading || loading) {
    return (
      <div className="items-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>
            {authLoading
              ? "Authenticating..."
              : "Loading items from your university..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-list-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="items-list-container">
      <div className="items-header">
        <h2>
          Lost & Found Items
          {isAuthenticated && user?.email && (
            <span className="university-info">
              {" - " +
                (getUserUniversityDomain(user.email)?.toUpperCase() ||
                  "Your University")}
            </span>
          )}
        </h2>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Items ({items.length})
          </button>
          <button
            className={filter === "lost" ? "active lost-filter" : "lost-filter"}
            onClick={() => setFilter("lost")}
          >
            Lost ({items.filter((item) => item.role === "lost").length})
          </button>
          <button
            className={
              filter === "found" ? "active found-filter" : "found-filter"
            }
            onClick={() => setFilter("found")}
          >
            Found ({items.filter((item) => item.role === "found").length})
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <p>
            {!isAuthenticated
              ? "Please log in to view lost and found items from your university."
              : `No ${
                  filter === "all" ? "" : filter
                } items found from your university (${getUserUniversityDomain(
                  user?.email
                )}).`}
          </p>
          {isAuthenticated && (
            <p className="hint">Be the first to report a lost or found item!</p>
          )}
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`item-card ${
                item.role === "lost" ? "lost-card" : "found-card"
              }`}
            >
              <div className="card-header">
                <span className={`status-badge ${item.role}`}>
                  {item.role === "lost" ? <>Lost</> : <>Found</>}
                </span>
                <span className="date">{formatDate(item.createdAt)}</span>
              </div>

              <div className="item-title-container">
                <h3 className="item-title">{item.title || "Unknown Item"}</h3>
                <p className="item-category">
                  {item.category || "Not specified"}
                </p>
              </div>
              {item.imageUrl || (item.image && item.image.imageUrl) ? (
                <div className="card-image">
                  <img
                    src={item.imageUrl || item.image.imageUrl}
                    alt={item.title}
                  />
                </div>
              ) : item.role === "lost" ? (
                <div className="card-image no-image">
                  <span className="no-image-text">
                    No picture uploaded for this lost item
                  </span>
                </div>
              ) : null}

              <div className="card-content">
                {/* <p className="item-category">
                  
                  {item.category || "Not specified"}
                </p> */}
                <p className="item-description">
                  <TbFileDescription className="content-icon des-icon" />

                  {item.description || "No description provided"}
                </p>
                <p className="item-location">
                  <HiOutlineLocationMarker className="content-icon" />
                  {item.location || "Not specified"}
                </p>
                {item.university && (
                  <p className="item-university">
                    {" "}
                    {item.university.name || item.university}
                  </p>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="contact-btn"
                  onClick={() => handleContactClick(item)}
                >
                  <CiPhone className="button-icon" />
                  {item.role === "found"
                    ? "Hey ! this is mine"
                    : item.role === "lost"
                    ? "Ahh ! I lost this"
                    : "Contact Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
