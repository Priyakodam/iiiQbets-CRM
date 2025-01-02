import React, { useEffect, useState } from 'react';
import { db } from "../../Firebase/FirebaseConfig"; // Adjust the path as necessary
import { Button, Modal } from 'react-bootstrap';
import Dashboard from "../Dashboard/Dashboard";
import ManagerRegistration from './ManagerRegistration'; // Import the ManagerRegistration component
import DataTable from '../../DataTable'; // Import your DataTable component
import './ManagerView.css';

// ManagerView Component
const ManagerView = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [managers, setManagers] = useState([]); // State to fetch manager data
  const [showModal, setShowModal] = useState(false);

  // Fetch manager data on component load
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const snapshot = await db
          .collection("users")
          .where("role", "==", "Manager")
          .orderBy("createdAt", "desc") // Order by creation date
          .get();

        const managerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setManagers(managerData);
      } catch (error) {
        console.error("Error fetching managers: ", error);
      }
    };

    fetchManagers();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Define DataTable columns
  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1, // Use index to display serial number
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Mobile Number",
        accessor: "mobileNumber",
      },
      {
        Header: "Password",
        accessor: "password",
      },
    ],
    []
  );

  return (
    <div className='managerview-container'>
      <Dashboard onToggleSidebar={setCollapsed} />
      <div className={`managerview-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="top-bar d-flex justify-content-end align-items-center mb-2">
          <Button variant="primary" onClick={handleShow}>
            Add Manager
          </Button>
        </div>
        <h2 className="manager-heading">Managers</h2>

        {/* DataTable Integration */}
        <div>
          <DataTable columns={columns} data={managers} />
        </div>

        {/* Modal for Manager Registration */}
        <Modal show={showModal} size="lg" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ManagerRegistration closeModal={handleClose} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ManagerView;
