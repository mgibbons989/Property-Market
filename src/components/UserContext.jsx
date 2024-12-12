import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cards, setCards] = useState([]);

  // Update the user state and sync with localStorage
  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser)); 3306// Save user to localStorage
    } else {
      localStorage.removeItem("user"); // Remove user from localStorage
      setCards([]);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, cards, setCards }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing the user context
export const useUser = () => useContext(UserContext);