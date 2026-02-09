import "./Navbar.css";
import { DiCode } from "react-icons/di";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import axios from "axios";

const Navbar = () => {
  const { username, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          "https://blog-site-template.onrender.com/current_user",
          { withCredentials: true }
        );

        if (res.data?.username) {
          setUser({
            username: res.data.username,
            email: res.data.email,
          });
        }
      } catch (err) {}
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        "https://blog-site-template.onrender.com/logout",
        { withCredentials: true }
      );
      setUser({});
      navigate("/");
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          Dev-Blog <DiCode className="icon" />
        </Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        {username && (
          <Link
            to="/createPost"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Create Post
          </Link>
        )}

        {username ? (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/register"
              className="btn-auth register-btn"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn-auth login-btn"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;







// import "./Navbar.css";
// import { DiCode } from "react-icons/di";
// import React, { useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { userContext } from "../../App";
// import axios from "axios";

// const Navbar = () => {
//   const { username, setUser } = useContext(userContext);
//   const navigate = useNavigate();

//   // 👇 keep user logged in on refresh
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const res = await axios.get(
//           "https://blog-site-template.onrender.com/current_user",
//           { withCredentials: true }
//         );

//         if (res.data?.username) {
//           setUser({
//             username: res.data.username,
//             email: res.data.email
//           });
//         }

//       } catch (err) {
//         // user not logged in → ignore
//       }
//     };

//     checkUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.get(
//         "https://blog-site-template.onrender.com/logout",
//         { withCredentials: true }
//       );
//       setUser({});
//       navigate("/");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/" className="logo">
//           Dev-Blog <DiCode className="icon" />
//         </Link>
//       </div>

//       <div className="navbar-center">
//         <Link to="/" className="nav-link">Home</Link>
//         {username && (
//           <Link to="/createPost" className="nav-link">Create Post</Link>
//         )}
//       </div>

//       <div className="navbar-right">
//         {username ? (
//           <button onClick={handleLogout} className="btn-logout">Logout</button>
//         ) : (
//           <>
//             <Link to="/register" className="btn-auth register-btn">Register</Link>
//             <Link to="/login" className="btn-auth login-btn">Login</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
