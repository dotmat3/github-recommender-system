import React, { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const ServerAddressContext = React.createContext(null);

export const ServerAddressProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(true);
  const [address, setAddress] = useState("localhost");

  if (showModal)
    return (
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex justify-content-center w-100">
            Server
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Insert the address of the server hosted with Colab.</p>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingInputCustom"
              type="text"
              placeholder="localhost"
              value={address}
              onChange={(e) => setAddress(e.currentTarget.value)}
            />
            <label htmlFor="floatingInputCustom">Server address</label>
          </Form.Floating>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="green" onClick={() => setShowModal(false)}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );

  return (
    <ServerAddressContext.Provider value={address}>
      {children}
    </ServerAddressContext.Provider>
  );
};

export const useServer = () => useContext(ServerAddressContext);
