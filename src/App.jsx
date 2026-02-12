import "./App.css";
import Navbar from "./assets/Componets/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./assets/Pages/Register";
import Login from "./assets/Pages/Login";
import Home from "./assets/Pages/Home";
import CreatePost from "./assets/Componets/CreatePost";
import EditPost from "./assets/Componets/EditPost";
import Post from "./assets/Componets/Post";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Context holds user info and setter
export const userContext = createContext();

// Set baseURL once
axios.defaults.baseURL = "https://blog-site-template.onrender.com";

function App() {
  const [user, setUser] = useState({}); // { username, email }

  // Fetch current user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login
        if (!token) return;

        const res = await axios.get("/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.log("No active session:", err);
        setUser({});
      }
    };

    fetchUser();
  }, []);

  return (
    <userContext.Provider value={{ ...user, setUser }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/editpost/:id" element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;




























// import "./App.css";
// import Navbar from "./assets/Componets/Navbar";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./assets/Pages/Register";
// import Login from "./assets/Pages/Login";
// import Home from "./assets/Pages/Home";
// import CreatePost from "./assets/Componets/CreatePost";
// import EditPost from "./assets/Componets/EditPost";
// import Post from "./assets/Componets/Post";
// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// // Context holds user info and setter
// export const userContext = createContext();

// function App() {
//   const [user, setUser] = useState({}); // { username, email }

//   // Axios will send cookies with every request
  
//   axios.defaults.withCredentials = true;

//   // Backend URL
//   //const BACKEND_URL = "https://blog-site-template.onrender.com";

//   // Check for active session
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`/api/api/current_user`, { withCredentials: true });
//         setUser(res.data); // { username, email }
//       } catch (err) {
//         console.log("No active session:", err);
//         setUser({});
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <userContext.Provider value={{ ...user, setUser }}>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/createPost" element={<CreatePost />} />
//           <Route path="/post/:id" element={<Post />} />
//           <Route path="/editpost/:id" element={<EditPost />} />
//         </Routes>
//       </BrowserRouter>
//     </userContext.Provider>
//   );
// }

// export default App;














