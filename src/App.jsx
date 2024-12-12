import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/SellerDashboardPage";
import BuyerDashboardPage from "./components/BuyerDashboardPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import { UserProvider } from "./components/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/buyer-dashboard",
    element: <BuyerDashboardPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboardPage />,
    errorElement: <div>404 Not Found</div>
  }
]);

function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
