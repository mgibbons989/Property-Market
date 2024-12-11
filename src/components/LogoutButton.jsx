import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Navigate back to login after logging out
    navigate("/");
  }
  
  return <button onClick={handleLogout}>Logout</button>
}

export default LogoutButton;