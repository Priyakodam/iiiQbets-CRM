import React, { useState, useEffect } from 'react';
import Dashboard from "../Dashboard/Dashboard";
import { Modal, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { db, auth } from "../../Firebase/FirebaseConfig"; // Import auth from Firebase config
import firebase from 'firebase/compat/app';
import "./EmployeeRegistration.css";
import EmployeeView from './EmployeeView';
const EmployeeRegistration = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        role: 'Employee',
    });
    const [managers, setManagers] = useState([]); // State for managers

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const snapshot = await db.collection('users').where('role', '==', 'Manager').get();
                const managerList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setManagers(managerList);
            } catch (error) {
                console.error("Error fetching managers: ", error);
            }
        };

        fetchManagers();
    }, []); // Fetch managers when component mounts

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate password and store it
            const password = `${employeeData.name}@123`;
            
            // Create a user in Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(employeeData.email, password);
            const user = userCredential.user;

            // Find the selected manager's name based on managerId
            const selectedManager = managers.find(manager => manager.id === employeeData.managerId);
            const reportingManager = selectedManager ? selectedManager.name : ''; // Get the selected manager's name
            const reportingManagerUid = selectedManager ? selectedManager.id : ''; // Get the selected manager's UID

            // Create a new employee document in Firestore
            await db.collection('users').doc(user.uid).set({
                ...employeeData,
                reportingManager,
                reportingManagerUid,
                employeeUid: user.uid,
                password:password,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert("Employee Added Succesfully!!!")

            setShowModal(false); // Close modal on successful submission
            setEmployeeData({ name: '', email: '', mobileNumber: '', role: 'Employee', managerId: '' }); // Reset form
        } catch (error) {
            console.error("Error adding employee: ", error);
        }
    };

    return (
        <div className='admindashboard-container'>
            <Dashboard onToggleSidebar={setCollapsed} />
            <div className={`admindashboard-content ${collapsed ? 'collapsed' : ''}`}>
            <div className="top-bar d-flex justify-content-end align-items-center mb-2">
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Employee</Button>
                </div>
                <Modal show={showModal} size="lg" onHide={() => setShowModal(false)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='employeeregistration-card mt-4'>
                           
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="formName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={employeeData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={employeeData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Col md={6}>
                                            <Form.Group controlId="formmobileNumber">
                                                <Form.Label>mobileNumber</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="mobileNumber"
                                                    value={employeeData.mobileNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formRole">
                                                <Form.Label>Role</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="role"
                                                    value={employeeData.role}
                                                    readOnly
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mb-2'>
                                        <Col md={6}>
                                            <Form.Group controlId="formManager">
                                                <Form.Label>Assign Manager</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="managerId"
                                                    value={employeeData.managerId}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select Manager</option>
                                                    {managers.map(manager => (
                                                        <option key={manager.id} value={manager.id}>
                                                            {manager.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="submit">Submit</Button>
                                </Form>
                            
                        </div>
                    </Modal.Body>
                </Modal>
                <div className='mt-3'>
                <EmployeeView/>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegistration;
