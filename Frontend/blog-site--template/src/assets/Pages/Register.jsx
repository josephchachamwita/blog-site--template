import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Set axios baseURL ONCE (same as Login page)
axios.defaults.baseURL = "https://blog-site-template.onrender.com";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/register", formData);

      // Backend sends: { message: "registered" }
      if (res.data.message === "registered") {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;



































// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Register.css';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "https://blog-site-template.onrender.com/register",
//         formData,
//         { withCredentials: true }
//       );

//       // 👇 FIXED THIS — backend sends { message: "registered" }
//       if (res.data.message === "registered") {
//         alert("Registration successful!");
//         navigate("/login");
//       } else {
//         alert("Registration failed. Please try again.");
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Error during registration.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-wrapper">
//       <div className="register-card">
//         <h2>Create Account</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="login-link">
//           Already have an account?{" "}
//           <span onClick={() => navigate("/login")}>Login</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;





























