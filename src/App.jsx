import "./App.css";
// import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    errorElement: <div>404 Not Found</div>
  }
]);

function App() {
  return (
    <>
      {/* <Header /> */}
        <RouterProvider router={router} />
      {/* <Footer /> */}
    </>
  );
}

export default App;
