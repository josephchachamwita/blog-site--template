
import "./Post.css"
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../App";


const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const user = useContext(userContext); // { email, username }

  // Fetch single post
  useEffect(() => {
    axios
      .get(`http://localhost:3000/getpostbyid/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // Delete post
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/deletepost/${post._id}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
























