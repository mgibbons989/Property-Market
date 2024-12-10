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
        <h2>About</h2>
        <p>Need to fill in this content.</p>
      </Modal>
    </>
  );
}

export default AboutButton;
