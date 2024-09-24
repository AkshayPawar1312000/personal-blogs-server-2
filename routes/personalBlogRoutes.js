const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
  getAllPersonalBlog,
  getPersonalBlog,
  createPersonalBlog,
  updatePersonalBlog,
  deletePersonalBlog,
} = require("../controllers/personalBlogsControllers");
const multer = require("multer");
const path = require("path");
// const jest = require('jest')
// jest.setTimeout(10000); // 10 seconds  new code

const router = express.Router();

router.use(cookieParser());
router.use(express.static("public"));

const authenticateToken = (req, res, next) => {
  // Get token from cookies
  const token = req?.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    // Token is valid, proceed to the next middleware or route
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// Create Pesonal_Blog   createPersonalBlog
router.post("/personalBlog", authenticateToken, upload.single("image"), createPersonalBlog);

// Get all Personal Blogs
router.get("/personalBlogs", getAllPersonalBlog);

// Get perticular personal Blogs info
router.get("/personalBlog/:id", getPersonalBlog);

// Update personal Blogs
router.put("/updateBlog/:id", authenticateToken, upload.single("image"), updatePersonalBlog);//

// Delete personal Blog
router.delete("/delete/:id", authenticateToken, deletePersonalBlog);

module.exports = router;
