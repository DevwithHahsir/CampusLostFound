import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseCore";
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

  // Fetch items from Firebase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const itemsCollection = collection(db, "items");
        const q = query(itemsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        console.log("Fetched items:", fetchedItems);
        console.log("Sample item structure:", fetchedItems[0]);
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on status
  const filteredItems = items.filter((item) => {
    // Only show active, non-deleted items
    if (item.isDeleted || item.status !== "active") return false;

    if (filter === "all") return true;
    return item.role === filter;
  });

  console.log("Total items:", items.length);
  console.log("Filtered items:", filteredItems.length);
  console.log("Current filter:", filter);

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

  if (loading) {
    return (
      <div className="items-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
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
        <h2>Lost & Found Items</h2>
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
          <p>No {filter === "all" ? "" : filter} items found.</p>
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
                <h3 className="item-title">
                 {item.title || "Unknown Item"}
                </h3>
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
                  Contact Details
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
