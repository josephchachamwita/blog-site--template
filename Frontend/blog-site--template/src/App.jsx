
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

// Context now holds both user info and setter for immediate updates
export const userContext = createContext();

function App() {
  const [user, setUser] = useState({}); // { username, email }

  axios.defaults.withCredentials = true;

  // Check if user is already logged in (cookie still valid)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/current_user", { withCredentials: true });
        setUser(res.data); // { username, email }
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

// export const userContext = createContext();

// function App() {
//   const [user, setUser] = useState({ username: null });

//   // Ensure cookies are sent with requests
//   axios.defaults.withCredentials = true;

//   // Check session on app load
//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/current_user")
//       .then((res) => {
//         if (res.data.username) {
//           setUser({ username: res.data.username });
//         } else {
//           setUser({ username: null });
//         }
//       })
//       .catch(() => setUser({ username: null }));
//   }, []);

//   return (
//     <userContext.Provider value={{ user, setUser }}>
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






























































// import './App.css';
// import Navbar from './assets/Componets/Navbar';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Register from './assets/Pages/Register';
// import Login from './assets/Pages/Login';
// import Home from './assets/Pages/Home';
// import CreatePost from './assets/Componets/CreatePost';
// import EditPost from './assets/Componets/EditPost';
// import Post from './assets/Componets/Post';
// import { createContext, useEffect, useState } from 'react';
// import axios from 'axios';

// export const userContext = createContext();

// function App() {
//   const [user, setUser] = useState({ username: null });

//   axios.defaults.withCredentials = true; // always send cookies

//   // Check backend for valid session on app load
//   useEffect(() => {
//     axios
//       .get('http://localhost:3000/current_user') // endpoint returns user info if cookie is valid
//       .then((res) => {
//         if (res.data.username) {
//           setUser({ username: res.data.username });
//         } else {
//           setUser({ username: null });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setUser({ username: null });
//       });
//   }, []);

//   return (
//     <userContext.Provider value={{ user, setUser }}>
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




















































// import './App.css';
// import Navbar from './assets/Componets/Navbar';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Register from './assets/Pages/Register';
// import Login from './assets/Pages/Login';
// import Home from './assets/Pages/Home';
// import CreatePost from './assets/Componets/CreatePost';
// import EditPost from './assets/Componets/EditPost';
// import Post from './assets/Componets/Post';
// import { createContext, useEffect, useState } from 'react';
// import axios from 'axios';

// export const userContext = createContext();

// function App() {
//   const [user, setUser] = useState({ username: null });

//   // Ensure cookies are sent with requests
//   axios.defaults.withCredentials = true;

//   // Check if user is already logged in when app loads
//   useEffect(() => {
//     axios
//       .get('http://localhost:3000/')
//       .then((res) => {
//         if (res.data.username) {
//           setUser({ username: res.data.username });
//         }
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <userContext.Provider value={{ user, setUser }}>
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























































// import './App.css'
// import Navbar from './assets/Componets/Navbar'
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Register from './assets/Pages/Register'
// import Login from './assets/Pages/Login'
// import Home from './assets/Pages/Home'
// import CreatePost from'./assets/Componets/CreatePost'
// import EditPost from './assets/Componets/EditPost'
// import Post from'./assets/Componets/Post'
// import { createContext, useEffect, useState } from 'react'
// import axios from 'axios'



// export const userContext=createContext();

// function App() {

//  const [user, setUser]=useState({});

//   axios.defaults.withCredentials=true;
//    useEffect(()=>{
//     axios.get('http://localhost:3000/')
//     .then(user=> {
//       setUser(user.data);
//     })
//     .catch(err=>console.log(err))
//    },[])

//   return (
  
//     <userContext.Provider value={user}>

//     <BrowserRouter>
//     <Navbar/>
//     <Routes>
//     <Route  path="/" element={<Home/>}></Route>
//     <Route  path="/register" element={<Register/>}></Route>
//     <Route  path="/login" element={<Login/>}></Route>
//     <Route  path="/createPost" element={<CreatePost/>}></Route>
//      <Route  path="/post/:id" element={<Post/>}></Route>
//       <Route  path="/editpost/:id" element={<EditPost/>}></Route>
  
//     </Routes>
//    </BrowserRouter>
//    </userContext.Provider>

    
// )}

// export default App;
