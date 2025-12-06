
import './CreatePost.css';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [createdPost, setCreatedPost] = useState(null);

  const navigate = useNavigate();
  const { username, email } = useContext(userContext);

  useEffect(() => {
    if (!username) navigate("/login");
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select an image.");

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    formData.append("file", file);

    try {
      const res = await axios.post("https://blog-site-template-1.onrender.com/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        setCreatedPost(res.data.post);
        alert("Post created successfully!");
        navigate("/");
      } else {
        alert("Error creating post");
      }
    } catch (err) {
      console.error("Error uploading post:", err);
      alert("Error uploading post");
    } finally {
      setLoading(false);
    }
  };

  if (!username) return <p>Redirecting to login...</p>;

  return (
    <div className="createpost-wrapper">
      <h2 className="form-title">Create a New Post</h2>

      <form onSubmit={handleSubmit} className="createpost-form">
        
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Subtitle</label>
        <input
          type="text"
          placeholder="Enter subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />

        <label>Content</label>
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          required
        />

        <label>Author</label>
        <input type="text" value={username} readOnly />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Post"}
        </button>

        {createdPost && (
          <div className="post-info">
            <p><strong>Author ObjectId:</strong> {createdPost.author}</p>
            <p><strong>Author Username:</strong> {username}</p>
            <p><strong>Post ID:</strong> {createdPost._id}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;



























































