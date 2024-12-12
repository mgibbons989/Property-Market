import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/SellerDashboardPage";
import BuyerDashboardPage from "./components/BuyerDashboardPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import { UserProvider } from "./components/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </HashRouter>
      </UserProvider>
    </>
  );
}

export default App;