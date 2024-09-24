const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const db = require("./config/db");

// sync use to create a table if not exists
db.sequelize.sync();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send(`<h3>Personal Blog node application is running...</h3>`);
  res.end();
});

//Routes
app.use("/", require("./routes/personalBlogRoutes"));
app.use("/", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;// new code
