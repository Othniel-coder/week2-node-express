
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Bonus: custom middleware to log every request
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
  );
  next();
});

// GET / — serve the static HTML homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST /user — accept a name and email
app.post("/user", (req, res) => {
  const { name, email } = req.body || {};

  // Return 404 if required information is missing
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(404).json({
      error: "Both name and email are required."
    });
  }

  res.status(200).json({
    message: `Hello, ${name.trim()}!`,
    name: name.trim(),
    email: email.trim()
  });
});

// GET /user/:id — display a user profile message
app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: `User ${id} profile`
  });
});

// Handle invalid JSON and other request errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (
    err instanceof SyntaxError &&
    err.status === 404 &&
    Object.prototype.hasOwnProperty.call(err, "body")
  ) {
    return res.status(404).json({
      error: "Invalid JSON in request body."
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error."
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`My Week 2 API is running at http://localhost:${PORT}`);
});
