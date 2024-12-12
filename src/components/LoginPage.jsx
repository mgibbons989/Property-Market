import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import "../homepage.css";

import Header from "./Header";
import Footer from "./Footer";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:3306";
// console.log(API_BASE_URL);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // const user = localStorage.getItem("user");
  console.log(user);

  const BASE_URL = "https://loving-friendship-production.up.railway.app";

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
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
            `${BASE_URL}/api/properties?user_id=${userData.id}`
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
      <main className="main-content">
        <div className="center" id="center-container">
          <section className="about-section">
            <div className="text-content">
              <h1>Welcome to Property Market</h1>
              <p>
                We are dedicated to simplifying real estate transactions by
                connecting property sellers and buyers. Our platform makes the
                process smooth and efficient, giving you the tools you need to
                succeed in the market.
              </p>
            </div>
          </section>

          <section className="buttons">
            <Link to="/register">
              <button className="acct-btn signup">
                Create an Account <span className="arrow">&rarr;</span>
              </button>
            </Link>
          </section>
        </div>
        <section className="form-section">
          <div className="form-card">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
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
              <div className="form-group">
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;
