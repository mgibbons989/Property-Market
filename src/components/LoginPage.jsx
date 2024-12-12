import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

import Header from "./Header";
import Footer from "./Footer";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
// console.log(API_BASE_URL);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // const user = localStorage.getItem("user");
  console.log(user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Login successful!");
        const { token, userData } = response.data;
        console.log(token, userData);

        setUser(userData);
        // localStorage.setItem("user", JSON.stringify(user));
        if (userData.type === "seller") {
          const propertiesResponse = await axios.get(
            `http://localhost:5000/api/properties?user_id=${userData.id}`
          );

          setCards(propertiesResponse.data);
          // Navigate to correct dashboard (seller, buyer, admin)
          navigate("/dashboard");
        } else if (userData.type === "buyer") {
          navigate("/buyer-dashboard");
        } else if (userData.type === "admin") {
          navigate("/admin-dashboard");
        }
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response); // Logs backend response error
        setError(err.response.data.message || "Login failed.");
      } else if (err.request) {
        console.error("Error request:", err.request); // Logs if request was made but no response
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error message:", err.message); // Logs unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <Footer />
    </>
  );
}

export default Login;
