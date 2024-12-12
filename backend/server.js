import express from "express";
import mysql from "mysql2";
import multer from "multer";
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

// Configure multer for file uploads
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});

const upload = multer({ storage });

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

const createPropertiesTable = async () => {
  try {
    const createPropertiesQuery = `
      CREATE TABLE IF NOT EXISTS Properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location VARCHAR(255),
        age VARCHAR(10),
        floor_plan VARCHAR(255),
        bedrooms INT,
        additional_facilities VARCHAR(255),
        garden BOOLEAN DEFAULT FALSE,
        parking BOOLEAN DEFAULT FALSE,
        proximity_facilities INT,
        proximity_main_roads INT,
        tax_records DECIMAL(10, 2),
        photo_url VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `;
    await pool.query(createPropertiesQuery);
    console.log("Properties table created or already exists.");
  } catch (error) {
    console.error("Error creating Properties table:", error.message);
  }
};

const createAdminUser = async () => {
  const hashedPassword = await bcrypt.hash("1234", 10);
  try {
    const createAdminQuery = `
      INSERT INTO Users (first_name, last_name, email, password, type)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = ["admin", "admin", "a@gmail.com", hashedPassword, "admin"];
    await pool.query(createAdminQuery, values);
    console.log("Admin was created or already exists.");
  } catch (error) {
    console.error("Error creating Admin:", error.message);
  }
};

createUsersTable();
createPropertiesTable();
createAdminUser();

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
    return res.status(200).json({
      message: "Login successful",
      token,
      userData: { id, first_name, last_name, type },
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

// Endpoint to save property with photo
app.post("/api/properties", upload.single("photo"), async (req, res) => {
  const {
    user_id, // From the current user context
    location,
    age,
    floor_plan,
    bedrooms,
    additional_facilities,
    garden,
    parking,
    proximity_facilities,
    proximity_main_roads,
    tax_records,
  } = req.body;

  const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Save file path if uploaded

  try {
    const query = `
      INSERT INTO properties 
      (user_id, location, age, floor_plan, bedrooms, additional_facilities, garden, parking, proximity_facilities, proximity_main_roads, tax_records, photo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      user_id,
      location,
      age,
      floor_plan,
      bedrooms,
      additional_facilities,
      garden,
      parking,
      proximity_facilities,
      proximity_main_roads,
      tax_records,
      photoPath,
    ];

    await pool.query(query, values);
    res.status(201).json({ message: "Property added successfully", photoPath });
  } catch (error) {
    console.error("Error saving property:", error.essage);
    res
      .status(500)
      .json({ message: "Error saving property", error: error.message });
  }
});

app.get("/api/properties/:userId", async (req, res) => {
  const { userId } = req.params; // Get user ID from the URL

  try {
    const query = `
      SELECT id, location, age, floor_plan, bedrooms, additional_facilities, garden, parking, proximity_facilities, proximity_main_roads, tax_records, photo_url
      FROM properties
      WHERE user_id = ?;
    `;
    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found for this user." });
    }

    res.status(200).json(rows); // Return the list of properties
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// EDIT API
app.put("/api/properties/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const {
    location,
    age,
    floor_plan,
    bedrooms,
    additional_facilities,
    garden,
    parking,
    proximity_facilities,
    proximity_main_roads,
    tax_records,
  } = req.body;

  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const query = `
      UPDATE properties 
      SET location = ?, age = ?, floor_plan = ?, bedrooms = ?, additional_facilities = ?, garden = ?, parking = ?, proximity_facilities = ?, proximity_main_roads = ?, tax_records = ?, photo_url = ?
      WHERE id = ?;
    `;
    const values = [
      location,
      age,
      floor_plan,
      bedrooms,
      additional_facilities,
      garden,
      parking,
      proximity_facilities,
      proximity_main_roads,
      tax_records,
      photoPath,
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ message: "Property updated successfully." });
  } catch (error) {
    console.error("Error updating property:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE API to delete a property by ID
app.delete("/api/properties/:id", async (req, res) => {
  const { id } = req.params; // Get the property ID from the URL

  try {
    // Delete the property with the specified ID
    const query = "DELETE FROM properties WHERE id = ?";
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      // If no rows were affected, the property ID does not exist
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    console.error("Error deleting property:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Serve static files (e.g., uploaded photos)
app.use("/uploads", express.static("uploads"));

const PORT = process.env.SQL_PORT || 3306;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
