import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/FirebaseConfig';
import DataTable from "../../DataTable";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';

const LeadTable = () => {
    const { user } = useAuth();
    const [leads, setleads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [editedData, setEditedData] = useState({
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        product: ''
    });

    useEffect(() => {
        const unsubscribe = () => {
            if (user && user.uid) {
                const leadsRef = db.collection('leads')
                    .where('leadAddedbyUid', '==', user.uid)
                    .orderBy('createdAt', 'desc');

                // Use onSnapshot for real-time updates
                return leadsRef.onSnapshot((querySnapshot) => {
                    const customerData = querySnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        sno: index + 1,
                        customerName: doc.data().customerName || 'N/A', // Handle missing fields
                        companyName: doc.data().companyName || 'N/A',
                        mobileNumber: doc.data().mobileNumber || 'N/A',
                        email: doc.data().email || 'N/A',
                        product: doc.data().product || 'N/A',
                        leadAddedby: doc.data().leadAddedby || 'N/A',
                    }));
                    setleads(customerData);
                    setLoading(false);
                }, (error) => {
                    console.error('Error fetching customer data:', error);
                    setLoading(false);
                });
            }
        };

        if (user && user.uid) {
            unsubscribe(); // Fetch leads when user is available
        }

        return () => {
            unsubscribe(); // Clean up the listener on unmount
        };
    }, [user]);

    const columns = [
        { Header: 'S.No', accessor: 'sno' },
        { Header: 'Customer Name', accessor: 'customerName' },
        { Header: 'Company Name', accessor: 'companyName' },
        { Header: 'Mobile Number', accessor: 'mobileNumber' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Product', accessor: 'product' },
        { Header: 'Added By', accessor: 'leadAddedby' },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FaEdit 
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => handleEdit(row.original)}
                    />
                    <FaTrash 
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => handleDelete(row.original.id)}
                    />
                </div>
            )
        }
    ];

    const handleEdit = (lead) => {
        setSelectedLead(lead);
        setEditedData({
            customerName: lead.customerName,
            companyName: lead.companyName,
            mobileNumber: lead.mobileNumber,
            email: lead.email,
            product: lead.product
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this lead?')) {
                await db.collection('leads').doc(id).delete();
                setleads(leads.filter((lead) => lead.id !== id)); // Update UI after deletion
                console.log('Lead deleted:', id);
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await db.collection('leads').doc(selectedLead.id).update(editedData);
            setleads(leads.map((lead) =>
                lead.id === selectedLead.id ? { ...lead, ...editedData } : lead
            ));
            setIsEditModalOpen(false);
            setSelectedLead(null);
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    return (
        <div>
            <div style={{textAlign:"center"}}>
                <h2>Leads</h2>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable columns={columns} data={leads} />
            )}

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Lead</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.customerName}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, customerName: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.companyName}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, companyName: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.mobileNumber}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, mobileNumber: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={editedData.email}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, email: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.product}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, product: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LeadTable;
