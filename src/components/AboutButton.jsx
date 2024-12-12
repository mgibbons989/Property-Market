import { useState } from "react";
import Modal from "./Modal";

function AboutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button onClick={toggleModal}>About</button>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div style={{ textAlign: "center" }}>
          <h2>About</h2>
          <p>
            Welcome to Property Market, the ultimate platform for connecting property sellers and buyers
            in a seamless and efficient way. Our mission is to simplify real estate transactions by providing
            a user-friendly space where sellers can easily list their properties and buyers can discover and
            bid on their dream homes.<br /><br />

            At Property Market, we offer a range of services tailored to meet your needs.
            Sellers can showcase their properties with ease, reaching a wide audience of potential buyers. Buyers
            benefit from convenient access to detailed property listings, enabling informed decisions every step
            of the way.<br /><br />

            What sets us apart? Our innovative approach, intuitive tools, and commitment to customer satisfaction
            make us the preferred choice for students and professionals alike. Whether you're selling or buying,
            Property Market ensures a hassle-free experience that puts you in control.<br /><br />

            Join us today and see why Property Market is the smart choice for all your real estate needs!
          </p>
        </div>
      </Modal>
    </>
  );
}

export default AboutButton;
