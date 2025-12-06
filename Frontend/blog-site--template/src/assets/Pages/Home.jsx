import './Home.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown time";
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/getposts');
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="home-wrapper">
      <h1 className="home-title">Latest Posts</h1>

      {posts.length === 0 && <p className="no-posts">No posts available.</p>}

      <div className="posts-feed">
        {posts.map(post => (
          <Link to={`/post/${post._id}`} className="post-item" key={post._id}>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title || "Post Image"}
                className="post-image"
              />
            )}
            <div className="post-content">
              <h2 className="post-title">{post.title || "Untitled"}</h2>
              {post.subtitle && <h3 className="post-subtitle">{post.subtitle}</h3>}
              <p className="post-text">{post.content || ""}</p>
              <div className="post-meta">
                <span className="post-author">By: {post.author || "Unknown"}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;





