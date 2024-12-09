import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { db, auth } from "../../Firebase/FirebaseConfig";
import firebase from 'firebase/compat/app';
import './ManagerRegistration.css';

const ManagerRegistration = ({ closeModal }) => { // Accept closeModal as a prop
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        role: "Manager",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const password = `${formData.name}@123`;

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(formData.email, password);
            const uid = userCredential.user.uid;
            
            await db.collection("users").doc(uid).set({
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                role: formData.role,
                ManagerUid: uid,
                password:password,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            console.log("Manager added Successfully!!!");
            alert("Manager added Successfully!!!");
            closeModal(); // Close the modal after successful submission

            setFormData({
                name: "",
                email: "",
                mobileNumber: "",
                role: "Manager",
            });
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    return (
        <div className="managerregistration-container">
            <Card  className="managerregistration-card mt-4" >
                {/* <Card.Header>
                    <h4>Manager Registration</h4>
                </Card.Header> */}
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                        <Col md={6}>
                                <Form.Group controlId="formMobile">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
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
                                        value={formData.role}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="secondary" onClick={closeModal} className="close-modal">Close</Button> &nbsp;
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ManagerRegistration;
