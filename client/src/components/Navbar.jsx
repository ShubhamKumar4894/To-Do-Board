import { Link } from "react-router-dom";
import { useState } from "react";
import "./navbar.css"
export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: "Features", to: "#features" },
    { name: "Pricing", to: "#pricing" },
    { name: "About", to: "#about" },
  ];
  return (
    <header className="main_header">
      <div className="navbar-container">
        <Link to="/">FlowBoard</Link>
        <div
          className="menu-icon"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          &#9776; 
        </div>
        <ul className={`nav-links ${isMenuOpen ? "show" : ""}`}>
          {navItems.map((item, index) => {
            return (
              <li key={index}>
                <Link to={item.to}>{item.name}</Link>
              </li>
            );
          })}
          <li>
            <a
              href="Signin"
              className="btn btn-signin"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};
