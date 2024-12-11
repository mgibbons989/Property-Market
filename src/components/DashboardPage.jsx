import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";

function DashboardPage() {
  const { user } = useUser();
  const [cards, setCards] = useState([]); // State to hold cards
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
  const [newCardData, setNewCardData] = useState(""); // State for new card data

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddCard = () => {
    setCards([...cards, newCardData]); // Add new card data to cards array
    setNewCardData(""); // Clear input field
    setIsModalOpen(false); // Close modal
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  console.log(`Current user: ${user}`);

  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>
          Welcome to your dashboard {user.first_name} {user.last_name}!
        </h1>
        <div className="grid">
          {/* Render cards */}
          {cards.map((card, index) => (
            <div key={index} className="card">
              {card}
            </div>
          ))}

          {/* Button card to add new information */}
          <div className="card" onClick={toggleModal}>
            <p>Add Property</p>
          </div>
        </div>

        {/* Modal for adding new card */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <h2>Add Property Information</h2>
            <div className="form-container">
              <div className="label-input-col">
                <div className="label-input-row">
                  <label for="">Location</label>
                  <input type="text" placeholder="123 Brown St." />
                </div>
                <div className="label-input-row">
                  <label for="">Age</label>
                  <select>
                    <option value={"1"}>1 year</option>
                    <option value={"1-5"}>1-5 years</option>
                    <option value={"5-10"}>5-10 years</option>
                    <option value={"10-15"}>10-15 years</option>
                    <option value={"15-20"}>15-20 years</option>
                    <option value={"20-30"}>20-30 years</option>
                    <option value={"30-40"}>30-40 years</option>
                    <option value={"40-50"}>40-50 years</option>
                    <option value={"50+"}>50+ years</option>
                  </select>
                </div>
                <div className="label-input-row">
                  <label for="">Floor Plan</label>
                  <input type="text" placeholder="" />
                </div>
                <div className="label-input-row">
                  <label for=""># of Bedrooms</label>
                  <select>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                  </select>
                </div>
                <div className="label-input-row">
                  <label for="">Additional Facilities</label>
                  <input type="text" placeholder="" />
                </div>
                <div className="label-input-row">
                  <label for="">Garden</label>
                  <input type="checkbox" />
                </div>
                <div className="label-input-row">
                  <label for="">Parking</label>
                  <input type="checkbox" />
                </div>
                <div className="label-input-row">
                  <label for="">Proximity to Nearby Facilities</label>
                  <select>
                    <option value={"1"}>1 mile</option>
                    <option value={"2"}>2 miles</option>
                    <option value={"3"}>3 miles</option>
                    <option value={"4"}>4 miles</option>
                    <option value={"5"}>5 miles</option>
                  </select>
                </div>
                <div className="label-input-row">
                  <label for="">Proximity to main roads</label>
                  <select>
                    <option value={"1"}>1 mile</option>
                    <option value={"2"}>2 miles</option>
                    <option value={"3"}>3 miles</option>
                    <option value={"4"}>4 miles</option>
                    <option value={"5"}>5 miles</option>
                  </select>
                </div>
                <div className="label-input-row">
                  <label for="">Property Tax Records (7%)</label>
                  <input type="text" placeholder="" />
                </div>
              </div>
              <div className="image-col">
                <div className="card">
                  <p>Add photo</p>
                </div>
              </div>
            </div>
            <button onClick={handleAddCard}>Save</button>
            <button onClick={toggleModal}>Cancel</button>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
}

export default DashboardPage;
