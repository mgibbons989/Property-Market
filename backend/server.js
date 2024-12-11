import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
// import pkg from 'pg'
// const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Load env
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
  })
  .promise();

const createUsersTable = async () => {
  try {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          type ENUM('seller', 'buyer', 'admin') NOT NULL DEFAULT 'seller',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    await pool.query(createTableQuery);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating Users table:", error.message);
  }
};

createUsersTable();

app.get("/", (req, res) => {
  res.send("Backend is running!");
  // try {
  //   const result = await pool.query("SELECT NOW()");
  //   res.json({ time: result[0][0] });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Server error");
  // }
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      console.log("User not found.");

      return res.status(404).json({ message: "User not found." });
    }

    // The matching user object from database
    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Simulate generating a JWT token
    const token = "fake-jwt-token";
    const { id, first_name, last_name, type } = user;
    return res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: { id, first_name, last_name, type },
      });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/register", async (req, res) => {
  console.log("Attempting to register...");

  const { email, password, firstName, lastName, type } = req.body;
  console.log(email, password, firstName, lastName, type);

  // Validate inputs
  if (!email || !password || !firstName || !lastName || !type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (type !== "buyer" && type !== "seller") {
    return res.status(400).json({ message: "Invalid user type." });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert new user into the database
    const [result] = await pool.query(
      "INSERT INTO Users (email, password, first_name, last_name, type) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName, type]
    );

    console.log("Registered successfully.");

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.SQL_PORT || 3306;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
