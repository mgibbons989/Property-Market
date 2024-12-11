import "./App.css";
// import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <div>404 Not Found</div>
  }
]);

function App() {
  return (
    <>
      <Header />
        <RouterProvider router={router} />
      <Footer />
      {/* <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </Router> */}
    </>
  );
}

export default App;
