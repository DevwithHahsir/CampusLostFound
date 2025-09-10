import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./componenets/navbar/Navbar";
import SEO from "./componenets/seo/SEO";
import Herosection from "./componenets/herosection/Herosection";
// import PostData from "./postData/POstData";

function App() {
  return (
    <Router>
      <SEO
        title="Campus Lost Found - Find Your Lost Items"
        description="The ultimate platform for finding and reporting lost items across Pakistani universities. Connect with your campus community to recover lost belongings."
        keywords={[
          "lost items",
          "found items",
          "Pakistani universities",
          "campus community",
          "student services",
        ]}
        image="/src/assets/logo.png"
        links={[
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
          },
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
