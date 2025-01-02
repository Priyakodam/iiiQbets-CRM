import React,{useEffect, useState} from 'react';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import { useAuth } from '../../Context/AuthContext';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import "./ManagerQuotation.css" ;

const ManagerQuotation = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        category: '',
        quantity: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const newQuotation = {
            ...formData,
            createdByUid: user.uid,
            quotationAddedByName: user.name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          };
    
          // Save the quotation in Firestore
          await db.collection('quotations').add(newQuotation);
    
          // Reset form and close modal
          setShowModal(false);
          setFormData({
            customerName: '',
            email: '',
            category: '',
            quantity: '',
          });
    
          alert("Quotation added successfully!");
        } catch (error) {
          console.error('Error adding quotation:', error);
        }
      };
    


  return (
    <div className="m-addquotation-container">
    <ManagerSidebar onToggleSidebar={setCollapsed} />
    <div className={`m-addquotation-content ${collapsed ? 'collapsed' : ''}`}>
    <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Quotation
        </Button>

        <Modal show={showModal} size="lg"onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Quotation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="customerName">
                    <Form.Label>Customer Name</Form.Label>
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
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="category">
                    <Form.Label>Select Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value="Product">Product</option>
                      <option value="Service">Service</option>
                      <option value="Service">Project</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        </div>
        </div>
  )
}

export default ManagerQuotation