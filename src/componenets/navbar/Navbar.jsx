import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null); // store logged in user
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // user logged in
      } else {
        setUser(null); // user logged out
      }
    });

    return () => unsubscribe(); // cleanup
  }, [auth]);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo/Brand */}
        <Link className="navbar-brand" to="/">
          Campus<span className="sub-logo">LostFound</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Center - Navigation Links */}
          <div className="navbar-nav mx-auto">
            <Link className="nav-link" to="/about">
              About
            </Link>
            <Link className="nav-link" to="/how-it-works">
              How It Works
            </Link>
            <Link className="nav-link" to="/universities">
              Universities
            </Link>
            <Link className="nav-link" to="/blog">
              Blog
            </Link>
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
            {/* <Link className="nav-link" to="/report">
              Report Item
            </Link> */}
            <Link className="nav-link" to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="nav-link" to="/terms-of-service">
              Terms of Service
            </Link>
          </div>

          {/* Right - Search Bar & User Actions */}
          <div className="d-flex align-items-center">
            {/* Search Bar */}
            {/* <form className="d-flex me-3">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search items..."
                aria-label="Search"
                style={{ width: "200px" }}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */}

            {/* User Actions */}
            {user ? (
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">{user.email}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
