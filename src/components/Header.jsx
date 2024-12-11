import { useUser } from "./UserContext";
import AboutButton from "./AboutButton";
import LogoutButton from "./LogoutButton";

function Header() {
  const { user } = useUser();

  const style = {
    display: 'flex',
    gap: '10px'
  };

  return (
    <header className="header">
      <h1>Property Market</h1>
      {user && <h2>{user.type} Dashboard</h2>}
      <div style={style}>
        <AboutButton />
        {user && <LogoutButton />}
      </div>
    </header>
  );
}

export default Header;
