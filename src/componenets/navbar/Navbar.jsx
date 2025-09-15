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
          {/* Center - Search Bar */}
          <div className="mx-auto">
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search items..."
                aria-label="Search"
                style={{ width: "300px" }}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>

          {/* Right - User Actions */}
          <div className="navbar-nav">
            {user ? (
              <>
                <span className="navbar-text me-3">Hi, {user.email}</span>
                <div className="log-btn">

                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                  >
                  Logout
                </button>
                  </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
