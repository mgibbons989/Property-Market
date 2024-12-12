import Header from "./Header";
import Footer from "./Footer";

function AdminDashboardPage() {
  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>
          {user.first_name}'s Admin Dashboard
        </h1>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboardPage;
