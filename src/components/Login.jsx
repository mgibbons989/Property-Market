import { useState } from "react";
import axios from "axios";
import { Link, useNaviate } from "react-router-dom";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:3306";
// console.log(API_BASE_URL);


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3306/login", {
        email,
        password,
      });
      console.log(response.status);

      if (response.status === 200) {
        alert("Login successful!");
        // Navigate to correct dashboard (sellger, buyer, admin)
        // navigate("/dashboard");
      } else {
        alert("Incorrect");
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
        Don't have an account? <Link to='/register'>Register here</Link>
      </p>
    </>
  );
}

export default Login;
