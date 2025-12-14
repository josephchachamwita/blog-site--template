// --------------------------------------------
//  IMPORTS
// --------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const UserModel = require("./models/UserModel");
const PostModel = require("./models/PostModel");

// --------------------------------------------
//  ENV VALIDATION
// --------------------------------------------
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets not set");
}

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
  "http://localhost:5173",
  "https://blog-site-template-pi.vercel.app",
  "https://blog-site-template-1.onrender.com",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --------------------------------------------
//  CLOUDINARY CONFIG
// --------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------------------------------
//  MULTER (MEMORY)
// --------------------------------------------
const upload = multer({ storage: multer.memoryStorage() });

// --------------------------------------------
//  TOKEN HELPERS
// --------------------------------------------
const createAccessToken = (user) =>
  jwt.sign(
    { email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

// --------------------------------------------
//  AUTH MIDDLEWARE
// --------------------------------------------
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No access token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid access token" });
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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo error:", err);
    process.exit(1);
  });

/* =====================================================
   AUTH ROUTES
===================================================== */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || password.length < 6) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (await UserModel.findOne({ email })) {
      return res.status(409).json({ message: "Email exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ username, email, password: hashed });

    res.json({ message: "registered" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        username: user.username,
        email: user.email,
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// REFRESH
app.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findOne({
      email: decoded.email,
      refreshToken,
    });

    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccess = createAccessToken(user);
    const newRefresh = createRefreshToken(user);

    user.refreshToken = newRefresh;
    await user.save();

    res
      .cookie("token", newAccess, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "refreshed" });
  } catch {
    res.status(403).json({ message: "Refresh failed" });
  }
});

// CURRENT USER
app.get("/current_user", verifyUser, (req, res) => {
  res.json({ username: req.username, email: req.email });
});

// LOGOUT
app.get("/logout", async (req, res) => {
  if (req.cookies.refreshToken) {
    await UserModel.updateOne(
      { refreshToken: req.cookies.refreshToken },
      { $unset: { refreshToken: "" } }
    );
  }

  res
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({ message: "success" });
});

/* =====================================================
   POSTS ROUTES
===================================================== */

// CREATE POST
app.post("/create", verifyUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const user = await UserModel.findOne({ email: req.email });

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "blog_posts" }, (err, result) =>
          err ? reject(err) : resolve(result)
        )
        .end(req.file.buffer);
    });

    const post = await PostModel.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      imageUrl: uploadResult.secure_url,
      author: user._id,
    });

    res.json({
      ...post.toObject(),
      author: user.username,
    });
  } catch {
    res.status(500).json({ message: "Create post failed" });
  }
});

// GET POSTS
app.get("/getposts", async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .lean();

    res.json(posts.map(p => ({
      ...p,
      author: p.author?.username || "Unknown",
    })));
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

// GET POST BY ID
app.get("/getpostbyid/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("author", "username email")
      .lean();

    if (!post) return res.status(404).json({ message: "Not found" });

    res.json({
      ...post,
      author: post.author?.username,
      authorEmail: post.author?.email,
    });
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

// EDIT POST
app.put("/editpost/:id", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const user = await UserModel.findOne({ email: req.email });

    if (!post) return res.status(404).json({ message: "Not found" });
    if (String(post.author) !== String(user._id))
      return res.status(403).json({ message: "Forbidden" });

    const update = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
    };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blog_posts" }, (err, result) =>
            err ? reject(err) : resolve(result)
          )
          .end(req.file.buffer);
      });
      update.imageUrl = uploadResult.secure_url;
    }

    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json({ ...updated.toObject(), author: user.username });
  } catch {
    res.status(500).json({ message: "Edit failed" });
  }
});

// DELETE POST
app.delete("/deletepost/:id", verifyUser, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const user = await UserModel.findOne({ email: req.email });

    if (!post) return res.status(404).json({ message: "Not found" });
    if (String(post.author) !== String(user._id))
      return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();
    res.json({ message: "deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =====================================================
   START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
