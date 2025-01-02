import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import { useAuth } from '../../Context/AuthContext';
import './EmployeeAddQuotation.css';

const EmployeeAddQuotation = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportingManagerUid, setReportingManagerUid] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    category: '',
    quantity: '',
  });
  const [productOptions, setProductOptions] = useState([]); 

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
    


     useEffect(() => {
        // Reset product options when product type changes
        setProductOptions([]);
        if (formData.productType) {
          fetchProductOptions(formData.productType);
        }
      }, [formData.productType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newQuotation = {
        ...formData,
        reportingManagerUid: reportingManagerUid,
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
    <div className="e-addquotation-container">
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`e-addquotation-content ${collapsed ? 'collapsed' : ''}`}>
        <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Quotation
        </Button>

        <Modal show={showModal} size='lg' onHide={() => setShowModal(false)}>
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
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeAddQuotation;
