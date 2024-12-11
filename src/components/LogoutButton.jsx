import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function LogoutButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");

    // Navigate back to login after logging out
    navigate("/");
  }
  
  return <button onClick={handleLogout}>Logout</button>
}

export default LogoutButton;