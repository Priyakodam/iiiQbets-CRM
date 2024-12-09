import React,{useState, useEffect} from 'react';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import { useAuth } from '../../Context/AuthContext';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import "./ManagerAddLeads.css";
import ManagerLeadsTable from './ManagerViewLeads';

const ManagerAddLeads = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
      customerName: '',
      companyName: '',
      mobileNumber: '',
      email: '',
      product: '',
  });
  const [customerNames, setCustomerNames] = useState([]);

  useEffect(() => {
    const fetchCustomerNames = async () => {
      try {
        // First query for customeraddedbyuid
        const queryByAddedBy = await db.collection('customers')
          .where('customeraddedbyuid', '==', user.uid)
          .get();
        
        // Second query for assignedEmployeeUid
        const queryByAssignedEmployee = await db.collection('customers')
          .where('reportingManagerUid', '==', user.uid)
          .get();
  
        // Combine results from both queries
        const combinedDocs = [
          ...queryByAddedBy.docs,
          ...queryByAssignedEmployee.docs
        ];
  
        if (combinedDocs.length > 0) {
          const customerList = combinedDocs.map(doc => doc.data().customerName);
          setCustomerNames(customerList); 
        } else {
          console.log('No customers found for this user');
          setCustomerNames([]); // Set an empty array if no results
        }
      } catch (error) {
        console.error('Error fetching customer names: ', error);
      }
    };
  
    if (user && user.uid) {
      fetchCustomerNames(); // Only fetch when `user` is available
    }
  }, [user]);
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newlead = {
        ...formData,
        leadAddedbyUid: user.uid,
        leadAddedby: user.name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection('leads').add(newlead);

      // Reset form and close modal after successful addition
      setShowModal(false);
      setFormData({
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        product: '',
      });

      alert("Lead Added Successfully");
    } catch (error) {
      console.error('Error adding lead: ', error);
    }
  };

  return (
    <div className="m-addleads-container">
      <ManagerSidebar onToggleSidebar={setCollapsed} />
      <div className={`m-addleads-content ${collapsed ? 'collapsed' : ''}`}>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Lead
                </button>
          

            <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
          <Col md={6}>
  <Form.Group controlId="customerName">
    <Form.Label>Name</Form.Label>
    <Form.Select
      name="customerName"
      value={formData.customerName}
      onChange={handleInputChange}
      required
    >
      <option value="">Select Customer</option>
      {customerNames.length > 0 ? (
        customerNames.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))
      ) : (
        <option value="" disabled>No customers available</option>
      )}
    </Form.Select>
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
              <Form.Group controlId="mobileNumber">
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
          <Row className='mb-3'>
            <Col md={6}>
              <Form.Group controlId="product">
                <Form.Label>Product</Form.Label>
                <Form.Control
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  required
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
    <ManagerLeadsTable/>
      </div>
      </div>
  )
}

export default ManagerAddLeads