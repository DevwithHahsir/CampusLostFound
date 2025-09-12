import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Navbar from "../componenets/navbar/Navbar";
import SEO from "../componenets/seo/SEO";

export default function Dashboard() {
  const { user, isAuthenticated, isEmailVerified } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !isEmailVerified) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <SEO
        title="Dashboard Campus Lost Found Pakistan | Student Portal | Manage Lost Items Account"
        description="Access your Campus Lost Found dashboard to manage your lost and found items, view your reports, connect with campus community, and track recovery progress across Pakistani universities."
        keywords={[
          "dashboard campus lost found Pakistan",
          "student portal Pakistan",
          "lost items dashboard",
          "manage lost items account",
          "university student dashboard",
          "campus lost found portal",
          "student account management",
          "lost items tracking Pakistan",
          "found items management",
          "campus community dashboard",
          "university portal Pakistan",
          "student lost property portal",
          "campus dashboard Pakistan",
          "lost found account center",
          "Pakistani student dashboard",
        ]}
        keySentences={[
          "Comprehensive dashboard provides overview of all your lost and found activities",
          "Track status of reported lost items with real-time updates",
          "Manage found items you've reported to help fellow students",
          "View personal statistics including successful recoveries and community impact",
          "Access messaging system to communicate with other students safely",
          "Update profile information and privacy settings as needed",
          "Browse recent activity from your university and nearby campuses",
          "Receive notifications about potential matches for your lost items",
          "Upload additional photos or descriptions to improve item recovery chances",
          "Mark items as recovered when successfully reunited with belongings",
          "Access help center and support resources for platform assistance",
          "View community leaderboard showcasing helpful student contributors",
          "Download reports of your lost and found activity for personal records",
          "Quick action buttons enable fast reporting of new lost or found items",
          "Secure logout protects your account when using shared devices",
        ]}
        url="https://campuslostfound.vercel.app/dashboard"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Dashboard"
        author="Campus Lost Found Team"
        links={[
          {
            rel: "canonical",
            href: "https://campuslostfound.vercel.app/dashboard",
          },
        ]}
        customMeta={[
          { name: "page-type", content: "user-dashboard" },
          { name: "content-category", content: "account-management" },
          { name: "audience", content: "authenticated-university-students" },
          { name: "access-level", content: "authenticated-users-only" },
          { name: "primary-function", content: "account-management" },
        ]}
      />
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Welcome to Campus Lost & Found</h1>
                  <p className="card-text">
                    Hello, <strong>{user?.displayName || user?.email}</strong>!
                  </p>
                  <p className="card-text">
                    Email Status:{" "}
                    {isEmailVerified ? "✅ Verified" : "❌ Not Verified"}
                  </p>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Report Lost Item</h5>
                          <p className="card-text">
                            Lost something? Report it here.
                          </p>
                          <button className="btn btn-primary">
                            Report Lost
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Report Found Item</h5>
                          <p className="card-text">
                            Found something? Report it here.
                          </p>
                          <button className="btn btn-success">
                            Report Found
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Browse Items</h5>
                          <p className="card-text">
                            Search for lost/found items.
                          </p>
                          <button className="btn btn-info">Browse</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5>User Information:</h5>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <strong>Email:</strong> {user?.email}
                      </li>
                      <li className="list-group-item">
                        <strong>User ID:</strong> {user?.uid}
                      </li>
                      <li className="list-group-item">
                        <strong>Email Verified:</strong>{" "}
                        {user?.emailVerified ? "Yes" : "No"}
                      </li>
                      <li className="list-group-item">
                        <strong>Account Created:</strong>{" "}
                        {user?.metadata?.creationTime}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
