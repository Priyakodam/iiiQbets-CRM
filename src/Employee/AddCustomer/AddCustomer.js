import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../Context/AuthContext';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import './AddCustomer.css';
import EmployeeViewCustomer from "./EmployeeViewCustomer";

const AddCustomer = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reportingManagerUid, setReportingManagerUid] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    gstNumber: '',
    address: '',
    source: '',
  });

  // Fetch the reportingManagerUid when the component mounts
  useEffect(() => {
    const fetchReportingManagerUid = async () => {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setReportingManagerUid(userDoc.data().reportingManagerUid || null);
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching reportingManagerUid: ', error);
      }
    };

    if (user && user.uid) {
      fetchReportingManagerUid();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = {
        ...formData,
        customeraddedbyuid: user.uid,
        customerAddedby: user.name,
        reportingManagerUid: reportingManagerUid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      };

      const docRef = await db.collection('customers').add(newCustomer);

      // Reset form and close modal after successful addition
      setShowModal(false);
      setFormData({
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        gstNumber: '',
        address: '',
        source: '',
      });

      alert("Customer Added Successfully");
    } catch (error) {
      console.error('Error adding customer: ', error);
    }
  };

  return (
    <div className='e-addcustomer-container'>
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`e-addcustomer-content ${collapsed ? 'collapsed' : ''}`}>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Customer
        </Button>

        {/* Modal for Adding Customer */}
        <Modal show={showModal}  size="lg" onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="mobile">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="gstNumber">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="source">
                    <Form.Label>Source</Form.Label>
                    <Form.Control
                      as="select"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="Online Advertisement">Online Advertisement</option>
                      <option value="Referral from Customer">Referral from Customer</option>
                      <option value="Social Media Campaign">Social Media Campaign</option>
                      <option value="Website Contact Form">Website Contact Form</option>
                      <option value="Online Platform">Online Platform</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <EmployeeViewCustomer />
      </div>
    </div>
  );
};

export default AddCustomer;
