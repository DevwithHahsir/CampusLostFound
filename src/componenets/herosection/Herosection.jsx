import React from "react";
import { CiHeart } from "react-icons/ci";
import "./herosection.css";
import { GoDotFill } from "react-icons/go";
import { IoIosSchool } from "react-icons/io";
import Button from "../button/Button";

export default function Herosection() {
  return (
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
          <h2 className="hero-subtitle sub-heading">Let's Find it Together</h2>
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
  );
}
