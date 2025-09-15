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
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar me-2">
                      {(user?.displayName || user?.email?.split("@")[0])
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                    <span className="user-name">
                      {user?.displayName || user?.email?.split("@")[0]}
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <span className="dropdown-item-text">
                        <strong>Signed in as:</strong>
                        <br />
                        <small>{user?.email}</small>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <i className="bi bi-person-circle me-2"></i>Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/report">
                        <i className="bi bi-plus-circle me-2"></i>Report Item
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Show only icon for account creation when not authenticated
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to="/signup"
                    title="Create Account"
                  >
                    <IoPersonAddOutline className="icon" size={24} />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
