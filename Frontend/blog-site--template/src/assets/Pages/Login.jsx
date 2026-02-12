import "./Login.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../App";

// Set axios baseURL ONCE
axios.defaults.baseURL = "https://blog-site-template.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/login", { email, password });

      if (res.data.success) {
        const { token, username, email } = res.data;

        // ✅ Store token (JWT)
        localStorage.setItem("token", token);

        // ✅ Set default Authorization header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // ✅ Update global user context
        setUser({ username, email });

        navigate("/");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;









































// import "./Login.css";
// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { userContext } from "../../App";

// // Set axios defaults ONCE
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "https://blog-site-template.onrender.com";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const { setUser } = useContext(userContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/login", { email, password });

//       if (res.data.success) {
//         setUser({ username: res.data.username, email });
//         navigate("/");
//       } else {
//         setError(res.data.message || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <h2 className="login-title">Welcome Back</h2>
//         <p className="login-subtitle">Login to continue</p>

//         {error && <p className="login-error">{error}</p>}

//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Login</button>
//         </form>

//         <p className="login-footer">
//           Don&apos;t have an account?{" "}
//           <Link to="/register" className="login-link">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;





















