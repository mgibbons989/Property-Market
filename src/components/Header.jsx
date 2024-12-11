import { useEffect, useState } from 'react'
import AboutButton from "./AboutButton";
import LogoutButton from "./LogoutButton";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user); // If user exists
    console.log(!!user);
    
  }, []);

  const style = {
    display: 'flex',
    gap: '10px'
  };

  return (
    <header className="header">
      <h1>Property Market</h1>
      <div style={style}>
        <AboutButton />
        {isLoggedIn && <LogoutButton />}
      </div>
    </header>
  );
}

export default Header;
