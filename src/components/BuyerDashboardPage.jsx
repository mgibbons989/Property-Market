import Header from "./Header";
import Footer from "./Footer";

function BuyerDashboardPage() {
  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>
          {user.first_name}'s Buyer Dashboard
        </h1>
      </div>
      <Footer />
    </>
  );
}

export default BuyerDashboardPage;
