import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
import axios from "axios";

import BuyerDashboardPage from "./BuyerDashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";

function DashboardPage() {
  const { user } = useUser();
  const BASE_URL = "https://loving-friendship-production.up.railway.app";

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.type === "buyer") {
    return <BuyerDashboardPage />;
  }

  if (user.type === "admin") {
    return <AdminDashboardPage />;
  }

  const [cards, setCards] = useState([]); // State to hold cards
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
  const [newCardData, setNewCardData] = useState({
    location: "",
    age: "1",
    floor_plan: "",
    bedrooms: "1",
    additional_facilities: "",
    garden: false,
    parking: false,
    proximity_facilities: "1",
    proximity_main_roads: "1",
    tax_records: "",
    photo: null, // Initial value for the file input
  });
  const [editingCard, setEditingCard] = useState(null); // For editing

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/properties/${user.id}`
      );
      console.log("Fetched properties:", response.data);
      setCards(response.data); // Update state with the fetched properties
    } catch (error) {
      console.error(
        "Error fetching properties:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("location", newCardData.location);
    formData.append("age", newCardData.age);
    formData.append("floor_plan", newCardData.floor_plan);
    formData.append("bedrooms", parseInt(newCardData.bedrooms, 10) || 0);
    formData.append(
      "additional_facilities",
      newCardData.additional_facilities || ""
    );
    formData.append("garden", newCardData.garden ? 1 : 0);
    formData.append("parking", newCardData.parking ? 1 : 0);
    formData.append(
      "proximity_facilities",
      parseInt(newCardData.proximity_facilities, 10) || 0
    );
    formData.append(
      "proximity_main_roads",
      parseInt(newCardData.proximity_main_roads, 10) || 0
    );
    formData.append("tax_records", parseFloat(newCardData.tax_records) || 0.0);
    if (newCardData.photo) {
      formData.append("photo", newCardData.photo);
    }

    try {
      if (editingCard) {
        // Edit mode: Update existing property
        const response = await axios.put(
          `${BASE_URL}/api/properties/${editingCard.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          fetchProperties(); // Re-fetch properties
          setEditingCard(null); // Clear editing state
        }
      } else {
        // Add mode: Add a new property
        const response = await axios.post(
          `${BASE_URL}/api/properties`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          fetchProperties(); // Re-fetch properties
        }
      }

      // Reset the form and close modal
      setNewCardData({
        location: "",
        age: "",
        floor_plan: "",
        bedrooms: "",
        additional_facilities: "",
        garden: false,
        parking: false,
        proximity_facilities: "",
        proximity_main_roads: "",
        tax_records: "",
        photo: null,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error saving property:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = (cardId) => {
    const cardToEdit = cards.find((card) => card.id === cardId); // Find the card to edit
    setEditingCard(cardToEdit); // Set the card being edited
    setNewCardData({ ...cardToEdit }); // Prefill modal fields
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/properties/${id}`
        );
        if (response.status === 200) {
          console.log("Property deleted successfully");
          fetchProperties(); // Re-fetch properties
        }
      } catch (error) {
        console.error(
          "Error deleting property:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>
          Welcome to your dashboard {user.first_name} {user.last_name}!
        </h1>
        <div className="grid">
          {/* Button card to add new information */}
          <div className="card" onClick={toggleModal}>
            <p>Add Property</p>
          </div>

          {/* Render cards */}
          {cards.map((card, index) => (
            <div key={card.id || `card-${index}`} className="card">
              {/* Edit Button */}
              <button
                className="edit-button"
                onClick={() => handleEdit(card.id)}
              >
                ✏️
              </button>

              {/* Delete Button */}
              <button
                className="delete-button"
                onClick={() => handleDelete(card.id)}
              >
                ❌
              </button>
              {card.photo_url && (
                <img
                  src={card.photo_url}
                  alt="Property"
                  className="property-image"
                />
              )}
              <div className="card-details">
                <p>
                  <strong>Location:</strong> {card.location}
                </p>
                <p>
                  <strong>Bedrooms:</strong> {card.bedrooms}
                </p>
                <p>
                  <strong>Age:</strong> {card.age}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding new card */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            {/* Modal Contents */}
            <button onClick={handleSave}>
              {editingCard ? "Save Changes" : "Add Property"}
            </button>
            <button onClick={toggleModal}>Cancel</button>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
}

export default DashboardPage;