const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

const userRoutes = require("./routes/user");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
