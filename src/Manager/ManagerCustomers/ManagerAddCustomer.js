import React,{useState, useEffect} from 'react';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../Context/AuthContext';
import { db, firebase } from "../../Firebase/FirebaseConfig";
import "./ManagerAddCustomer.css";
import ManagerViewCustomer from "./ManagerViewCustomer";

const ManagerAddCustomer = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    gstNumber: '',
    address: '',
    source: '',
    assignedEmployeeUid: '' || "Not Assigned",
   
  });

  const fetchTeamMembers = async () => {
    try {
      const teamSnapshot = await db.collection('users')
        .where('role', '==', 'Employee')
        .where('reportingManagerUid', '==', user.uid)
        .get();

      if (!teamSnapshot.empty) {
        const membersList = teamSnapshot.docs.map(doc => {
          const memberData = doc.data();
          return {
            ...memberData,
            uid: doc.id, 
            
          };
        });
        setTeamMembers(membersList);
      } else {
        console.log("No team members found.");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchTeamMembers();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the assigned employee's name from the teamMembers list
      const assignedEmployee = teamMembers.find(
        (member) => member.uid === formData.assignedEmployeeUid
      );
      const assignedEmployeeName = assignedEmployee ? assignedEmployee.name : "" || "Not Assigned";
  
      const newCustomer = {
        ...formData,
        customeraddedbyuid: user.uid,
        customerAddedby: user.name,
        assignedEmployeeName, // Include the assigned employee's name
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
  
      // Add the new customer to the Firestore collection
      const docRef = await db.collection("customers").add(newCustomer);
  
      // Reset form and close modal
      setShowModal(false);
      setFormData({
        customerName: "",
        companyName: "",
        mobileNumber: "",
        email: "",
        gstNumber: "",
        address: "",
        source: "",
        assignedEmployeeUid: "",
      });
  
      alert("Customer Added Successfully");
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };
  


  return (
    <div className="m-addcustomer-container">
    <ManagerSidebar onToggleSidebar={setCollapsed} />
    <div className={`m-addcustomer-content ${collapsed ? 'collapsed' : ''}`}>
    <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Customer
        </Button>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
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

                <Col md={6}>
                  <Form.Group controlId="assignedEmployeeUid">
                    <Form.Label>Assign Employee</Form.Label>
                    <Form.Control
                      as="select"
                      name="assignedEmployeeUid"
                      value={formData.assignedEmployeeUid}
                      onChange={handleInputChange}
                      
                    >
                      <option value="">Select Employee</option>
                      {teamMembers.map((member) => (
                        <option key={member.uid} value={member.uid}>
                          {member.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
<ManagerViewCustomer/>
      
      </div>
      </div>
  )
}

export default ManagerAddCustomer