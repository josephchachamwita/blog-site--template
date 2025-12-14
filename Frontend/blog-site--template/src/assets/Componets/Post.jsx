
// import "./Post.css"
// import React, { useContext, useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { userContext } from "../../App";


// const Post = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState({});
//   const navigate = useNavigate();
//   const user = useContext(userContext); // { email, username }

//   // Fetch single post
//   useEffect(() => {
//     axios
//       .get(`https://blog-site-template-1.onrender.com/getpostbyid/${id}`,{  withCredentials: true})
//       .then((res) => setPost(res.data))
//       .catch((err) => console.log(err));

//   }, [id]);

//   // Delete post
//   const handleDelete = async () => {
//     try {
//       await axios.delete(`https://blog-site-template-1.onrender.com/deletepost/${post._id}`, {
//         withCredentials: true,
//       });
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Check if logged-in user is the author
//   const isOwner = user?.email === post.authorEmail;

//   return (
//     <div className="post-container">
//       {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
//       <h2>{post.title}</h2>
//       <h3>{post.subtitle}</h3>
//       <p>{post.content}</p>
//       <p>
//         <strong>Author:</strong> {post.author}
//       </p>

//       {isOwner && (
//         <div className="post-actions">
//           <Link to={`/editpost/${post._id}`}>
//             <button>Edit</button>
//           </Link>
//           <button onClick={handleDelete}>Delete</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;



import "./Post.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../App";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const user = useContext(userContext); // { email, username }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://blog-site-template-1.onrender.com/getpostbyid/${id}`,
          {
            withCredentials: true, // Important for cookie auth
          }
        );
        setPost(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Delete post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `https://blog-site-template-1.onrender.com/deletepost/${post._id}`,
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to delete post.");
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  // Check if logged-in user is the author
  const isOwner = user?.email === post.authorEmail;

  return (
    <div className="post-container">
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <h2>{post.title}</h2>
      <h3>{post.subtitle}</h3>
      <p>{post.content}</p>
      <p>
        <strong>Author:</strong> {post.author}
      </p>

      {isOwner && (
        <div className="post-actions">
          <Link to={`/editpost/${post._id}`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Post;





















