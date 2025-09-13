import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy, useState, memo } from "react";
import MinimalLoader from "./componenets/loader/MinimalLoader";

// Lazy load ALL components for better performance
const Navbar = lazy(() => import("./componenets/navbar/Navbar"));
const SEO = lazy(() => import("./componenets/seo/SEO"));
const Herosection = lazy(() => import("./componenets/herosection/Herosection"));
const ReportItemForm = lazy(() =>
  import("./componenets/reportForm/ReportItemForm")
);

// Lazy load pages for better performance - load only when needed
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Report = lazy(() => import("./pages/Report"));
const ReportDemo = lazy(() => import("./pages/ReportDemo"));

// Optimized conditional navbar component
const ConditionalNavbar = memo(() => {
  const location = useLocation();
  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return showNavbar ? (
    <Suspense fallback={<MinimalLoader />}>
      <Navbar />
    </Suspense>
  ) : null;
});

const App = memo(() => {
  const [showReportForm, setShowReportForm] = useState(false);

  const handleReportFormSubmit = () => {
    setShowReportForm(false);
    // You can add additional logic here like showing success message
  };

  const handleReportFormClose = () => {
    setShowReportForm(false);
  };

  return (
    <Router>
      <SEO
        title="Campus Lost Found Pakistan | Lost & Found Items University Students | Find Lost Belongings"
        description="Pakistan's premier lost and found platform for university students. Report, search, and recover lost items across 43+ Pakistani universities. Join thousands of students who have successfully reunited with their belongings through our campus community network."
        keywords={[
          "lost and found Pakistan",
          "university lost items Pakistan",
          "campus lost property",
          "Pakistani university students",
          "find lost belongings",
          "lost items recovery",
          "university campus community",
          "student lost property service",
          "Pakistani universities lost found",
          "HEC universities Pakistan",
          "lost phone university",
          "lost wallet campus",
          "lost keys university Pakistan",
          "found items campus",
          "student community Pakistan",
        ]}
        keySentences={[
          "Pakistan's premier lost and found platform connects university students nationwide",
          "Report lost items instantly and browse found items across 43+ Pakistani universities",
          "Join thousands of students who successfully reunited with their belongings",
          "University email verification ensures authentic campus community participation",
          "Real-time notifications help students quickly recover lost items",
          "Advanced search filters locate specific items by category, location, and date",
          "Secure platform protects student privacy while facilitating item recovery",
          "24/7 accessible service supports students across all Pakistani time zones",
          "Mobile-optimized interface enables quick reporting from anywhere on campus",
          "Community-driven approach builds trust among university students",
          "Free service reduces financial burden of replacing lost items",
          "GPS location tracking helps pinpoint exact areas where items were lost",
          "Photo upload capability improves item identification accuracy",
          "Email alerts notify users when matching items are reported",
          "Success stories inspire continued community participation and support",
        ]}
        image="/src/assets/logo.png"
        url="https://campuslostfound.vercel.app"
        type="website"
        siteName="Campus Lost Found Pakistan"
        author="Campus Lost Found Team"
        links={[
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
          },
          { rel: "canonical", href: "https://campuslostfound.vercel.app" },
        ]}
        customMeta={[
          { name: "theme-color", content: "#4382E4" },
          { name: "application-name", content: "Campus Lost Found" },
          { name: "apple-mobile-web-app-title", content: "Campus Lost Found" },
          { name: "apple-mobile-web-app-capable", content: "yes" },
          { name: "apple-mobile-web-app-status-bar-style", content: "default" },
          { name: "mobile-web-app-capable", content: "yes" },
          { name: "coverage", content: "Worldwide" },
          { name: "distribution", content: "Global" },
          { name: "rating", content: "General" },
          { name: "target", content: "all" },
          { name: "HandheldFriendly", content: "True" },
          { name: "MobileOptimized", content: "320" },
          { name: "geo.region", content: "PK" },
          { name: "geo.country", content: "Pakistan" },
          { name: "ICBM", content: "30.3753, 69.3451" },
          { name: "DC.title", content: "Campus Lost Found Pakistan" },
          {
            name: "DC.subject",
            content: "Lost and Found Service for Pakistani Universities",
          },
          {
            name: "DC.description",
            content:
              "Pakistan's premier lost and found platform for university students",
          },
          { name: "DC.type", content: "Service" },
          { name: "DC.language", content: "en" },
          { name: "DC.coverage", content: "Pakistan" },
        ]}
      />
      <ConditionalNavbar />

      <Suspense fallback={<MinimalLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Herosection />} />
          <Route
            path="/lost"
            element={<div>Lost Items Page - Coming Soon</div>}
          />
          <Route
            path="/found"
            element={<div>Found Items Page - Coming Soon</div>}
          />
          <Route path="/report" element={<Report />} />
          <Route path="/demo" element={<ReportDemo />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>

      {/* Global Report Form */}
      {showReportForm && (
        <Suspense fallback={<MinimalLoader />}>
          <ReportItemForm
            onClose={handleReportFormClose}
            onSubmit={handleReportFormSubmit}
          />
        </Suspense>
      )}

      {/* <PostData/> */}
    </Router>
  );
});

export default App;
