import React, { useState, useEffect } from 'react';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../Context/AuthContext';
import './EmployeeAddLeads.css';
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import EmployeeViewLeads from './EmployeeViewLeads';

const EmployeeAddLeads = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportingManagerUid, setReportingManagerUid] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    productType: '', // Product Type
    product: '', // Selected Product, Project, or Service
  });
  const [customerNames, setCustomerNames] = useState([]);
  const [productOptions, setProductOptions] = useState([]); // Holds the fetched products

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
  
  
  useEffect(() => {
    // Fetch customer names when the component loads
    const fetchCustomerNames = async () => {
      try {
        const queryByAddedBy = await db.collection('customers')
          .where('customeraddedbyuid', '==', user.uid)
          .get();
        
        const queryByAssignedEmployee = await db.collection('customers')
          .where('assignedEmployeeUid', '==', user.uid)
          .get();
        
        const combinedDocs = [
          ...queryByAddedBy.docs,
          ...queryByAssignedEmployee.docs
        ];

        if (combinedDocs.length > 0) {
          const customerList = combinedDocs.map(doc => doc.data().customerName);
          setCustomerNames(customerList); 
        } else {
          setCustomerNames([]); // No customers found
        }
      } catch (error) {
        console.error('Error fetching customer names: ', error);
      }
    };

    if (user && user.uid) {
      fetchCustomerNames();
    }
  }, [user]);

  useEffect(() => {
    // Reset product options when product type changes
    setProductOptions([]);
    if (formData.productType) {
      fetchProductOptions(formData.productType);
    }
  }, [formData.productType]);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch product options based on the selected product type (Product, Project, or Service)
  const fetchProductOptions = async (productType) => {
    let collectionName = '';

    // Determine which collection to fetch based on product type
    if (productType === 'Product') {
      collectionName = 'products'; // Replace with your actual product collection
    } else if (productType === 'Project') {
      collectionName = 'projects'; // Replace with your actual project collection
    } else if (productType === 'Service') {
      collectionName = 'services'; // Replace with your actual service collection
    }

    try {
      const productSnapshot = await db.collection(collectionName).get();
      const items = productSnapshot.docs.map(doc => doc.data().itemName);
      setProductOptions(items);
    } catch (error) {
      console.error('Error fetching product options: ', error);
    }
  };

  // Fetch and autofill customer details based on the selected customer name
  const handleCustomerNameChange = async (e) => {
    const selectedCustomerName = e.target.value;

    // Update customerName in formData but keep other fields empty initially
    setFormData(prevState => ({
      ...prevState,
      customerName: selectedCustomerName,
    }));

    if (selectedCustomerName) {
      try {
        const customerSnapshot = await db.collection('customers')
          .where('customerName', '==', selectedCustomerName)
          .get();

        if (!customerSnapshot.empty) {
          const customerData = customerSnapshot.docs[0].data(); // Assuming customerName is unique
          setFormData(prevState => ({
            ...prevState,
            companyName: customerData.companyName || '',
            mobileNumber: customerData.mobileNumber || '',
            email: customerData.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching customer details: ', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newlead = {
        ...formData,
        leadAddedbyUid: user.uid,
        leadAddedby: user.name,
        reportingManagerUid: reportingManagerUid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
  
      await db.collection('leads').add(newlead);
  
      // Reset form and close modal after successful addition
      setShowModal(false);
      setFormData({
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        productType: '',
        product: '',
      });
  
      alert("Lead Added Successfully");
    } catch (error) {
      console.error('Error adding lead: ', error);
    }
  };

  return (
    <div className="e-addleads-container">
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`e-addleads-content ${collapsed ? 'collapsed' : ''}`}>
      <div className="top-bar d-flex justify-content-end align-items-center mb-2">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Lead
        </button>
        </div>

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
                      onChange={handleCustomerNameChange}
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
                  <Form.Group controlId="productType">
                    <Form.Label>Product Type</Form.Label>
                    <Form.Select
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Product Type</option>
                      <option value="Product">Product</option>
                      <option value="Project">Project</option>
                      <option value="Service">Service</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="product">
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      required
                      disabled={productOptions.length === 0}
                    >
                      <option value="">Select Item</option>
                      {productOptions.length > 0 ? (
                        productOptions.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No items available</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>
        <EmployeeViewLeads/>
      </div>
    </div>
  );
};

export default EmployeeAddLeads;
