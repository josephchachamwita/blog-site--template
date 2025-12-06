
import "./Navbar.css";
import { DiCode } from "react-icons/di";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import axios from "axios";

const Navbar = () => {
  const { username, setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("https://blog-site-template-1.onrender.com/logout", { withCredentials: true });
      setUser({});
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Dev-Blog <DiCode className="icon" />
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        {username && <Link to="/createPost" className="nav-link">Create Post</Link>}
      </div>

      <div className="navbar-right">
        {username ? (
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        ) : (
          <>
            <Link to="/register" className="btn-auth register-btn">Register</Link>
            <Link to="/login" className="btn-auth login-btn">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
