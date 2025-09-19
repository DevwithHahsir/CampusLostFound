import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseCore";
import { useAuth } from "../../AuthContext/AuthContext";
import {
  CiFileOn,
  CiLocationOn,
  CiPhone,
  CiSearch,
  CiCircleCheck,
  CiHashtag,
} from "react-icons/ci";
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
    console.log("🔄 useEffect triggered with:", {
      authLoading,
      isAuthenticated,
      userEmail: user?.email,
      timestamp: new Date().toLocaleTimeString(),
    });

    const fetchItems = async () => {
      try {
        // Debug logging
        console.log("📦 ItemsList Auth Debug:", {
          authLoading,
          isAuthenticated,
          userEmail: user?.email,
        });

        // Wait for authentication to finish loading
        if (authLoading) {
          console.log("⏳ Auth still loading, waiting...");
          setLoading(true);
          return;
        }

        // Set loading to true only when we're about to fetch
        setLoading(true);

        // If user is not authenticated, show no items
        if (!isAuthenticated || !user?.email) {
          console.log("🚫 User not authenticated or no email - CLEARING ITEMS");
          setItems([]);
          setError(
            "Please log in to view lost and found items from your university."
          );
          setLoading(false);
          return;
        }

        // Clear any previous errors
        setError(null);

        const userDomain = getUserUniversityDomain(user.email);
        console.log("🏫 User domain extracted:", userDomain);

        if (!userDomain) {
          setItems([]);
          setError(
            "Unable to determine your university from your email address."
          );
          setLoading(false);
          return;
        }

        const itemsCollection = collection(db, "items");

        // Query items by university domain (without orderBy to avoid index requirement)
        const q = query(
          itemsCollection,
          where("university.domain", "==", userDomain)
        );
        const querySnapshot = await getDocs(q);

        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Sort the results by createdAt in JavaScript
        fetchedItems.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });

        console.log(
          "✅ Fetched items for university:",
          userDomain,
          fetchedItems
        );
        console.log("📊 Setting items count:", fetchedItems.length);
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have the necessary auth state
    if (!authLoading) {
      fetchItems();
    }
  }, [isAuthenticated, user?.email, authLoading]); // Removed user?.uid to reduce re-renders

  // Filter items based on status
  const filteredItems = items.filter((item) => {
    // Only show active, non-deleted items
    if (item.isDeleted || item.status !== "active") return false;

    if (filter === "all") return true;
    return item.role === filter;
  });

  console.log("📋 Total items:", items.length);
  console.log("🔍 Filtered items:", filteredItems.length);
  console.log("🏷️ Current filter:", filter);
  console.log("📊 Items array:", items.length > 0 ? "HAS ITEMS" : "EMPTY");

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
              </div>
              {(item.imageUrl || (item.image && item.image.imageUrl)) && (
                <div className="card-image">
                  <img
                    src={item.imageUrl || item.image.imageUrl}
                    alt={item.title}
                  />
                </div>
              )}

              <div className="card-content">
                <p className="item-category">
                  <CiHashtag className="content-icon" />
                  <strong>Category: </strong> {item.category || "Not specified"}
                </p>
                <p className="item-description">
                  <CiFileOn className="content-icon" />
                  <strong>Description: </strong>{" "}
                  {item.description || "No description provided"}
                </p>
                <p className="item-location">
                  <CiLocationOn className="content-icon" />
                  <strong>Location: </strong> {item.location || "Not specified"}
                </p>
                {item.university && (
                  <p className="item-university">
                    <strong>University: </strong>{" "}
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
