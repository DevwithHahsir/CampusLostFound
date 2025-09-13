import React from "react";
import "./MinimalLoader.css";

const MinimalLoader = React.memo(() => (
  <div className="minimal-loader">
    <div className="minimal-spinner"></div>
  </div>
));

export default MinimalLoader;
