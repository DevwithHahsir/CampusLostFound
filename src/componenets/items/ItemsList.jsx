/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MdDelete, MdEdit } from "react-icons/md";
import { db } from "../../firebaseConfig/firebaseCore";
import { useAuth } from "../../AuthContext/AuthContext";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuChartScatter } from "react-icons/lu";
import { MdCallMissed } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import ReportItemForm from "../reportForm/ReportItemForm";
import "./ItemsList.css";

const ItemsList = ({
  searchQuery = "",
  onlyUserItems = false,
  filter = "all",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Remove local filter state, use prop instead
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [updateItemId, setUpdateItemId] = useState(null);

  const getUserUniversityDomain = (email) => {
    if (!email) return null;
    const domain = email.split("@")[1];
    return domain;
  };

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    const fetchItems = async () => {
      try {
        if (!isAuthenticated || !user?.email) {
          setItems([]);
          setError(
            "Please log in to view lost and found items from your university.\nTry Again"
          );
          if (!isAuthenticated || !user?.email) {
            setItems([]);
            setError(
              "Please log in to view lost and found items from your university.\nTry Again"
            );
            setLoading(false);
            return;
          }
          ("Unable to determine your university from your email address.");
          setError("Failed to load items. Please try again later.");
          setLoading(false);
          return;
        }
        const itemsCollection = collection(db, "items");
        const userDomain = getUserUniversityDomain(user.email);
        const q = query(
          itemsCollection,
          where("university.domain", "==", userDomain)
        );
        const querySnapshot = await getDocs(q);
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        fetchedItems.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });
        setItems(fetchedItems);
        setError(null);
      } catch {
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [isAuthenticated, user?.email, authLoading]);

  // Use filter prop from parent
  const filteredItems = items.filter((item) => {
    if (item.isDeleted || item.status !== "active") return false;
    // Dashboard: only show user's items
    if (onlyUserItems) {
      if (!user || !item.userId || item.userId !== user.uid) return false;
      if (filter !== "all" && item.role !== filter) {
        return false;
      }
    } else {
      // Home: show all lost/found items from university
      if (filter !== "all" && item.role !== filter) {
        return false;
      }
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

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

  const handleContactClick = (item) => {
    const contactInfo = item.contact || {};
    const email = contactInfo.email || "Not provided";
    const phone = contactInfo.phone || "Not provided";
    const preference = contactInfo.preference || "email";
    alert(
      `Contact Info:\nEmail: ${email}\nPhone: ${phone}\nPreferred Contact: ${preference}`
    );
  };

  const handleRemoveItem = async (item) => {
    if (!item.id) return;
    try {
      await updateDoc(doc(db, "items", item.id), { isDeleted: true });
      alert("Item removed successfully.");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      alert("Failed to remove item. Please try again.");
    }
  };

  // Open ReportItemForm modal with selected item data
  const handleUpdateItem = (item) => {
    setUpdateItemId(item.id);
    setFormData({ ...item });
    setIsOpen(true);
  };

  // Submit updated data to Firestore
  const handleSubmit = async (updatedData) => {
    if (!updateItemId || !updatedData) return;
    try {
      const docRef = doc(db, "items", updateItemId);
      await updateDoc(docRef, updatedData);
      alert("Item updated!");
      setIsOpen(false);
      setUpdateItemId(null);
      setItems((prev) =>
        prev.map((i) => (i.id === updateItemId ? { ...i, ...updatedData } : i))
      );
    } catch {
      alert("Failed to update item. Please try again.");
    }
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
      {/* Update Modal: Show ReportItemForm for editing */}
      {isOpen && formData && (
        <div
          className="update-modal"
          style={{
            position: "fixed",
            top: 50,
            left: 400,

            width: 500,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ReportItemForm
            initialData={formData}
            onClose={() => {
              setIsOpen(false);
              setUpdateItemId(null);
            }}
            onSubmit={handleSubmit}
            isUpdate={true}
          />
        </div>
      )}
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
                    {item.university.name || item.university}
                  </p>
                )}
              </div>
              <div className="card-footer">
                {onlyUserItems && item.userId === user?.uid ? (
                  <>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <MdDelete className="button-icon" /> Remove Item
                    </button>
                    <button
                      className="update-item-btn"
                      onClick={() => handleUpdateItem(item)}
                    >
                      <MdEdit className="button-icon" /> Update
                    </button>
                  </>
                ) : (
                  <button
                    className={`contact-btn ${
                      item.role === "found"
                        ? "found-btn"
                        : item.role === "lost"
                        ? "lost-btn"
                        : ""
                    }`}
                    onClick={() => handleContactClick(item)}
                  >
                    <CiPhone className="button-icon" />
                    {item.role === "found" ? "Hey ! this is mine" : "Contact"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
