import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componenets/navbar/Navbar";
import SEO from "./componenets/seo/SEO";
import Herosection from "./componenets/herosection/Herosection";
// import PostData from "./postData/POstData";

function App() {
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
          "university help network",
          "campus safety Pakistan",
          "lost belongings recovery service",
          "Pakistani student services",
          "university lost and found system",
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Herosection />} />
        {/* <Route path="/lost" element={<div>Lost Items Page - Coming Soon</div>} />
        <Route path="/found" element={<div>Found Items Page - Coming Soon</div>} />
        <Route path="/report" element={<div>Report Item Page - Coming Soon</div>} />
        <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
        <Route path="/signup" element={<div>Sign Up Page - Coming Soon</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
      </Routes>
      {/* <PostData/> */}
    </Router>
  );
}

export default App;
