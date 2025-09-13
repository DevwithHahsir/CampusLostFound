import React, { useState } from "react";
import ReportItemForm from "../componenets/reportForm/ReportItemForm";
import "./Report.css";

const Report = () => {
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = () => {
    // Alert is now handled within ReportItemForm component
  };

  const handleFormClose = () => {
    setShowForm(false);
    // You can navigate back to home or dashboard here
    window.history.back();
  };

  return (
    <div className="report-page">
      <div className="report-page-header">
        <h1>Report an Item</h1>
        <p>Help reunite lost items with their owners or report found items</p>
      </div>

      {showForm && (
        <ReportItemForm onClose={handleFormClose} onSubmit={handleFormSubmit} />
      )}

      {!showForm && (
        <div className="report-success">
          <h2>Item Reported Successfully!</h2>
          <p>
            Your item has been added to our database. We'll help connect you
            with the owner/finder.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="report-another-btn"
          >
            Report Another Item
          </button>
        </div>
      )}
    </div>
  );
};

export default Report;
