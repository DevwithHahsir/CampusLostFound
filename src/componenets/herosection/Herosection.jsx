import React from "react";
import { CiHeart } from "react-icons/ci";
import "./herosection.css";
import { GoDotFill } from "react-icons/go";
import { IoIosSchool } from "react-icons/io";
import Button from "../button/Button";
import SEO from "../seo/SEO";

export default function Herosection() {
  return (
    <>
      <SEO
        title="Report Lost Items & Find Found Items | Campus Lost Found Pakistan | University Students Help"
        description="Report your lost items or browse found items at Pakistani universities. Our hero platform connects 2,300+ university students across Pakistan to help recover lost belongings like phones, wallets, keys, and academic materials through community support."
        keywords={[
          "report lost items Pakistan",
          "find found items university",
          "lost phone campus Pakistan",
          "lost wallet university students",
          "lost keys Pakistani campus",
          "university lost property report",
          "campus found items browse",
          "Pakistani student community help",
          "lost belongings recovery Pakistan",
          "university lost and found hero",
          "campus safety network Pakistan",
          "student help community Pakistan",
          "lost items reporting system",
          "found property university Pakistan",
          "campus lost belongings service",
          "Pakistani universities lost found",
          "student lost property assistance",
          "university community support Pakistan",
          "lost items recovery platform",
          "campus hero lost found service",
          "Pakistani student services online",
          "university lost property database",
          "campus community network Pakistan",
          "lost items help center Pakistan",
          "university student support system",
        ]}
        url="https://campuslostfound.vercel.app/hero"
        image="/src/assets/logo.png"
        type="website"
        siteName="Campus Lost Found Pakistan - Hero Section"
        author="Campus Lost Found Team"
        links={[
          { rel: "canonical", href: "https://campuslostfound.vercel.app/hero" },
        ]}
        customMeta={[
          { name: "page-type", content: "hero-landing" },
          { name: "content-category", content: "student-services" },
          { name: "audience", content: "university-students-pakistan" },
          { name: "service-area", content: "Pakistan-universities" },
          { name: "primary-action", content: "report-lost-items" },
          { name: "secondary-action", content: "browse-found-items" },
        ]}
      />
      <main className="hero-section">
        <div className="hero-content">
          <div
            className="hero-icon"
            aria-label="Heart icon representing community care"
          >
            <CiHeart className="icon" />
          </div>

          <header className="hero-text">
            <h1 className="hero-title heading">Lost Something?</h1>
            <h2 className="hero-subtitle sub-heading">
              Let's Find it Together
            </h2>
            <p className="hero-description description">
              Join our community of helpful neighbors. Report lost items, share
              found treasures, and help reunite people with their belongings.
            </p>
          </header>

          <section className="herosection-status">
            <div className="status1 status">
              <span className="icon icon1">
                <GoDotFill />
              </span>
              127 items waiting to be found
            </div>
            <div className="status2 status">
              <span className="icon icon2">
                <GoDotFill />
              </span>
              50 happy reunions
            </div>
            <div className="status3 status">
              <span className="icon icon3">
                <IoIosSchool />
              </span>
              2,300+ universities
            </div>
          </section>

          <section className="herosection-btns">
            <div className="btn1">
              <Button
                text="Report Lost Item"
                className="hero-btn hero-btn-primary"
                onClick={() => console.log("Navigate to report page")}
              />
            </div>
            <div className="btn2">
              <Button
                text="Browse Found Items"
                className="hero-btn hero-btn-secondary"
                onClick={() => console.log("Navigate to found items page")}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
