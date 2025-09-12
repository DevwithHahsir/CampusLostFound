import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoPersonAddOutline } from "react-icons/io5";
import { TfiComment } from "react-icons/tfi";
import { useAuth } from "../../AuthContext/AuthContext";
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/"); // Use navigate instead of window.location.href
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo Container */}
        <Link className="navbar-brand" to="/">
          {/* <img
            src={logo}
            alt="Campus Lost & Found"
            width="100"
            height="100"
            className="d-inline-block align-text-top"
          /> */}
          Campus<span className="sub-logo">LostFound</span>
        </Link>

        {/* Navbar Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Navigation Links */}
          {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Lost Items
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Found Items
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Electronics
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Books
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Clothing
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Others
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Report Item
              </a>
            </li>
          </ul> */}

          {/* Search Bar */}
          <form className="d-flex search-bar">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search items..."
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          {/* User Actions */}
          <ul className="navbar-nav ms-3">
            {isAuthenticated ? (
              // Show user menu when authenticated
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Welcome, {user?.displayName || user?.email?.split("@")[0]}
                  </span>
                </li>
                {/* <li className="nav-item">
                  <a className="nav-link" href="#">
                    <TfiComment className="icon" />
                  </a>
                </li> */}
                <li className="nav-item log-btn">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Show login/signup when not authenticated
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <IoPersonAddOutline className="icon" />
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
