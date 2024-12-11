import { Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function DashboardPage() {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to='/' replace />
  }

  return (
    <>
      <Header />
      <h1>Dashboard</h1>
      <Footer />
    </>
  )
}

export default DashboardPage;