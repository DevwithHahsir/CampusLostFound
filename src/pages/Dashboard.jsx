import React, { useState } from "react";
import ReportItemForm from "../componenets/reportForm/ReportItemForm";
import ItemsList from "../componenets/items/ItemsList";
import { TbReportAnalytics } from "react-icons/tb";
import "./Dashboard.css";
import { FaStackOverflow } from "react-icons/fa6";
import { LuChartScatter } from "react-icons/lu";
import { IoLogoDropbox } from "react-icons/io";
import { RiPhoneFindFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../AuthContext/AuthContext";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ total: 0, found: 0, lost: 0 });
  const { user } = useAuth();
  React.useEffect(() => {
    if (!user?.uid) return;
    import("../firebaseConfig/firebaseCore").then(({ db }) => {
      import("firebase/firestore").then(
        ({ collection, query, where, getDocs }) => {
          const itemsRef = collection(db, "items");
          const q = query(itemsRef, where("userId", "==", user.uid));
          getDocs(q).then((snapshot) => {
            let total = 0,
              found = 0,
              lost = 0;
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.isDeleted || data.status !== "active") return;
              if (data.userId !== user.uid) return;
              total++;
              if (data.role === "found") found++;
              if (data.role === "lost") lost++;
            });
            setStats({ total, found, lost });
          });
        }
      );
    });
  }, [user?.uid]);

  return (
    <>
      {/* Hero section at the top */}
      {/* <Herosection /> */}
      {/* Filter buttons below hero section */}

      <div className="dashboard-main-container">
        <div className="dashboard-img"></div>

        <div className="dashboard-heading heading">
          <h1>Campus Lost & Found</h1>
          <p>Connect students with their missing belongings</p>

          <div className="reportform-btn-container">
            <button
              className="hero-btn-primary"
              onClick={() => {
                setActiveTab("report");
                setShowReportForm(true);
              }}
            >
              Report Item
            </button>
          </div>
        </div>

        {/* Filter Buttons */}

        <div className="dashboard-filterbtn-main-container">
          <div
            className="dashboard-filter-btns"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              margin: "2rem 0",
            }}
          >
            <button
              className={activeTab === "overview" ? "active all" : ""}
              onClick={() => setActiveTab("overview")}
            >
              {" "}
              <LuChartScatter />
              Overview
            </button>
            <button
              className={activeTab === "all" ? "active found-filter" : ""}
              onClick={() => setActiveTab("all")}
            >
              {" "}
              <FaStackOverflow />
              All Items
            </button>
            <button
              className={activeTab === "report" ? "active lost-filter" : ""}
              onClick={() => {
                setActiveTab("report");
                setShowReportForm(true);
              }}
            >
              {" "}
              <TbReportAnalytics />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <section style={{ textAlign: "center", margin: "2rem 0" }}>
          <div className="stats-main-container">
            <div className="stats-container stat-container1">
              <div className="title-icon">
                <div className="titlel">Total Items</div>
                <div className="icon">
                  <IoLogoDropbox />
                </div>
              </div>
              <div className="stats-count">{stats.total}</div>
            </div>
            <div className="stats-container stat-container2">
              <div className="title-icon">
                <div className="titlel">Found Items</div>
                <div className="icon">
                  <FaCheckCircle />
                </div>
              </div>
              <div className="stats-count">{stats.found}</div>
            </div>
            <div className="stats-container stat-container3">
              <div className="title-icon">
                <div className="titlel">Lost Items</div>
                <div className="icon">
                  <RiPhoneFindFill />
                </div>
              </div>
              <div className="stats-count">{stats.lost}</div>
            </div>
          </div>

          {/* Filter Container */}

          <div className="filter-container">
            <input
              type="text"
              placeholder="Search your items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "220px",
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="all">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <ItemsList
            onlyUserItems={true}
            searchQuery={searchQuery}
            filter={statusFilter}
          />
        </section>
      )}
      {activeTab === "all" && (
        <section style={{ textAlign: "center", margin: "2rem 0" }}>
          <ItemsList onlyUserItems={true} />
        </section>
      )}
      {activeTab === "report" && showReportForm && (
        <section className="report-form-section">
          <ReportItemForm onClose={() => setShowReportForm(false)} />
        </section>
      )}
    </>
  );
};

export default Dashboard;
