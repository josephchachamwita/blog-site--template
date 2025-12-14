// --------------------------------------------
//  IMPORTS
// --------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const UserModel = require("./models/UserModel");
const PostModel = require("./models/PostModel");

// --------------------------------------------
//  APP CONFIG
// --------------------------------------------
const app = express();
app.use(express.json());
app.use(cookieParser());

// --------------------------------------------
//  CORS CONFIG
// --------------------------------------------
const allowedOrigins = [
  "http://localhost:5173", // Local development URL
  "https://blog-site-template-pi.vercel.app", // Vercel production frontend
  "https://blog-site-template.onrender.com", // Removed extra space
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.static("public"));

// --------------------------------------------
//  CLOUDINARY CONFIG
// --------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------------------------------
//  MULTER CONFIG
// --------------------------------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "public/images"),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --------------------------------------------
//  JWT AUTH MIDDLEWARE
// --------------------------------------------
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET || "jwt-secret-key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.email = decoded.email;
    req.username = decoded.username;
    next();
  });
};

// --------------------------------------------
//  MONGO CONNECTION
// --------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Mongo error:", err));

/* =====================================================
   AUTH ROUTES
===================================================== */

// REGISTER
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ username, email, password: hashed });
    res.json({ message: "registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User does not exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Password incorrect" });

    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "jwt-secret-key",
      { expiresIn: "1d" }
    );

    // -----------------------------
    // COOKIE FIXES FOR CROSS-DOMAIN
    // -----------------------------
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // allow cross-site cookies
      secure: true,     // required for HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// CURRENT USER
app.get("/current_user", verifyUser, (req, res) => {
  res.json({ username: req.username, email: req.email });
});

// LOGOUT
app.get("/logout", (req, res) => {
  res.clearCookie("token", { sameSite: "none", secure: true });
  res.json({ message: "success" });
});

/* =====================================================
   POSTS ROUTES
===================================================== */

// CREATE POST
app.post("/create", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.email });
    if (!req.file) return res.status(400).json("Image is required");

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_posts",
    });

    const post = await PostModel.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      imageUrl: uploaded.secure_url,
      author: user._id,
    });

    res.json({
      status: "success",
      post: {
        ...post._doc,
        author: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Create post error");
  }
});

// GET ALL POSTS
app.get("/getposts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });

    const formatted = await Promise.all(
      posts.map(async (post) => {
        let authorName = "Unknown";
        if (post.author) {
          const author = await UserModel.findById(post.author).select("username");
          authorName = author?.username || "Unknown";
        }
        return {
          ...post._doc,
          author: authorName,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error("GetPosts error:", err);
    res.status(500).json("Failed to fetch posts");
  }
});

// GET SINGLE POST
app.get("/getpostbyid/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).lean();
    if (!post) return res.status(404).json("Post not found");

    const author = await UserModel.findById(post.author).select("username email");

    res.json({
      ...post,
      author: author?.username || null,
      authorEmail: author?.email || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch post");
  }
});

// EDIT POST
app.put("/editpost/:id", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const user = await UserModel.findOne({ email: req.email });

    if (!post) return res.status(404).json("Post not found");
    if (String(post.author) !== String(user._id))
      return res.status(403).json("Not allowed");

    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
    };

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
      });
      updateData.imageUrl = uploaded.secure_url;
    }

    const updated = await PostModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({
      ...updated._doc,
      author: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Edit failed");
  }
});

// DELETE POST
app.delete("/deletepost/:id", verifyUser, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const user = await UserModel.findOne({ email: req.email });

    if (!post) return res.status(404).json("Post not found");
    if (String(post.author) !== String(user._id))
      return res.status(403).json("Not allowed");

    await PostModel.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Delete failed");
  }
});

/* =====================================================
   START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
