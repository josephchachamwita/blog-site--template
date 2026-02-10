import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../App";
import "./EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useContext(userContext);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    file: null,
    preview: "",
  });

  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(false);

  /* -------------------- FETCH POST -------------------- */
  useEffect(() => {
    if (!user || !user.email) return;

    axios
      .get(`/api/getpostbyid/${id}`, { withCredentials: true })
      .then((res) => {
        const post = res.data;

        setFormData({
          title: post.title || "",
          subtitle: post.subtitle || "",
          content: post.content || "",
          file: null,
          preview: post.imageUrl || "",
        });

        setAuthor(post.author || "");
        setOwner(user.email === post.authorEmail);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch post error:", err);
        setLoading(false);
      });
  }, [id, user]);

  /* -------------------- INPUT HANDLER -------------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
        preview: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* -------------------- SUBMIT EDIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("content", formData.content);
    if (formData.file) data.append("file", formData.file);

    try {
      await axios.put(`/api/editpost/${id}`, data, {
        withCredentials: true,
      });

      alert("Post updated successfully!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("Update post error:", err);
      alert("Failed to update post.");
    }
  };

  /* -------------------- DELETE POST -------------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await axios.delete(`/api/deletepost/${id}`, {
        withCredentials: true,
      });

      alert("Post deleted.");
      navigate("/");
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post.");
    }
  };

  /* -------------------- CONDITIONS -------------------- */
  if (loading) return <div className="loading">Loading post...</div>;
  if (!owner) return <div className="no-access">You cannot edit this post.</div>;

  /* -------------------- UI -------------------- */
  return (
    <div className="edit-wrapper">
      <h2 className="edit-title">Edit Your Post</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Subtitle</label>
        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} required />

        <label>Content</label>
        <textarea name="content" rows="8" value={formData.content} onChange={handleChange} required />

        <label>Author</label>
        <input type="text" value={author} disabled />

        <label>Change Image (Optional)</label>
        <input type="file" name="file" onChange={handleChange} />

        {formData.preview && (
          <img src={formData.preview} alt="Preview" className="preview-img" />
        )}

        <div className="button-row">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete Post</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
