import React, { useState } from "react";
import Herosection from "../componenets/herosection/Herosection";
import styles from "./Dashboard.module.css";
import { FaChartBar, FaListAlt, FaRegClipboard } from "react-icons/fa";
import ReportItemForm from "../componenets/reportForm/ReportItemForm";
import ItemsList from "../componenets/items/ItemsList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [showForm, setShowForm] = useState(false);
  const [itemsRefreshKey, setItemsRefreshKey] = useState(0);

  // When a new item is added, increment the key to force ItemsList remount
  const handleItemAdded = () => {
    setItemsRefreshKey((prev) => prev + 1);
    setShowForm(false);
  };

  return (
    <>
      {/* Hero section at the top */}
      {/* <Herosection /> */}
      {/* Filter buttons below hero section */}
      <div
        className={styles.dashboardContainer}
        style={{ background: "none", boxShadow: "none", marginTop: 0 }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            margin: "32px 0 40px 0",
            justifyContent: "center",
          }}
        >
          <button
            className={
              activeTab === "overview"
                ? `${styles.addItemBtn} ${styles.activeTab}`
                : styles.addItemBtn
            }
            style={{
              borderRadius: "12px 0 0 12px",
              border: "none",
              background: activeTab === "overview" ? "#fff" : "#f7faff",
              color: "#222",
              fontWeight: 500,
              boxShadow:
                activeTab === "overview"
                  ? "0 2px 8px rgba(67,130,228,0.06)"
                  : "none",
              borderRight: "1px solid #e3eafc",
              minWidth: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar style={{ fontSize: 18 }} /> Overview
          </button>
          <button
            className={
              activeTab === "all"
                ? `${styles.addItemBtn} ${styles.activeTab}`
                : styles.addItemBtn
            }
            style={{
              borderRadius: 0,
              border: "none",
              background: activeTab === "all" ? "#fff" : "#f7faff",
              color: "#222",
              fontWeight: 500,
              boxShadow:
                activeTab === "all"
                  ? "0 2px 8px rgba(67,130,228,0.06)"
                  : "none",
              borderRight: "1px solid #e3eafc",
              minWidth: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => setActiveTab("all")}
          >
            <FaListAlt style={{ fontSize: 18 }} /> All Items
          </button>
          <button
            className={
              activeTab === "report"
                ? `${styles.addItemBtn} ${styles.activeTab}`
                : styles.addItemBtn
            }
            style={{
              borderRadius: "0 12px 12px 0",
              border: "none",
              background: activeTab === "report" ? "#fff" : "#f7faff",
              color: "#222",
              fontWeight: 500,
              boxShadow:
                activeTab === "report"
                  ? "0 2px 8px rgba(67,130,228,0.06)"
                  : "none",
              minWidth: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => setActiveTab("report")}
          >
            <FaRegClipboard style={{ fontSize: 18 }} /> Report
          </button>
        </div>
        {/* Example content for each filter (replace with your logic) */}
        <div style={{ textAlign: "center", color: "#222", marginTop: 40 }}>
          {activeTab === "overview" && (
            <>
              <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
                Dashboard Overview
              </h2>
              <p style={{ color: "#888", fontSize: 17 }}>
                See a summary of your activity and stats here.
              </p>
            </>
          )}
          {activeTab === "all" && (
            <>
              <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
                All Items
              </h2>
              <p style={{ color: "#888", fontSize: 17 }}>
                Browse all your lost and found items here.
              </p>
              <ItemsList key={itemsRefreshKey} />
            </>
          )}
          {activeTab === "report" && (
            <>
              <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
                Report a Lost or Found Item
              </h2>
              <p style={{ color: "#888", fontSize: 17 }}>
                Help your fellow students by reporting items you've lost or
                found on campus. Provide as much detail as possible to help with
                identification.
              </p>
            </>
          )}
        </div>
        {/* Show ReportItemForm as modal when showForm is true */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(67,130,228,0.12)",
                padding: 0,
                minWidth: 340,
                maxWidth: 480,
                width: "100%",
                position: "relative",
              }}
            >
              <ReportItemForm
                onClose={() => setShowForm(false)}
                onItemAdded={handleItemAdded}
              />
              <button
                onClick={() => setShowForm(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 16,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#888",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
