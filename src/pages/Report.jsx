import React, { useState, useCallback } from "react";
import ReportItemForm from "../componenets/reportForm/ReportItemForm";
import "./Report.css";

const Report = React.memo(() => {
  const [showForm, setShowForm] = useState(true);

  // Memoized handlers to prevent unnecessary re-renders
  const handleFormSubmit = useCallback(() => {
    // Alert is now handled within ReportItemForm component
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    window.history.back();
  }, []);

  const handleReportAnother = useCallback(() => {
    setShowForm(true);
  }, []);

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
          <button onClick={handleReportAnother} className="report-another-btn">
            Report Another Item
          </button>
        </div>
      )}
    </div>
  );
});

Report.displayName = "Report";

export default Report;
