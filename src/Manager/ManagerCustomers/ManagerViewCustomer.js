import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/FirebaseConfig';
import DataTable from "../../DataTable";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CustomerTable = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const fetchCustomers = () => {
            // Query for customeraddedbyuid
            const queryByCustomerAddedByUid = db.collection('customers')
                .where('customeraddedbyuid', '==', user.uid)
                .orderBy('createdAt', 'desc');

            // Query for assignedEmployeeUid
            const queryByAssignedEmployeeUid = db.collection('customers')
                .where('reportingManagerUid', '==', user.uid)
                .orderBy('createdAt', 'desc');

            // Listen to both queries using onSnapshot
            const unsubscribeAddedByUid = queryByCustomerAddedByUid.onSnapshot(
                (snapshot) => {
                    const customerData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setCustomers((prevCustomers) => [
                        ...prevCustomers,
                        ...customerData,
                    ]);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching customer data:', error);
                    setLoading(false);
                }
            );

            const unsubscribeAssignedEmployeeUid = queryByAssignedEmployeeUid.onSnapshot(
                (snapshot) => {
                    const customerData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setCustomers((prevCustomers) => [
                        ...prevCustomers,
                        ...customerData,
                    ]);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching customer data:', error);
                    setLoading(false);
                }
            );

            // Cleanup the listeners when the component is unmounted
            return () => {
                unsubscribeAddedByUid();
                unsubscribeAssignedEmployeeUid();
            };
        };

        if (user && user.uid) {
            fetchCustomers();
        }

        // Cleanup effect when component unmounts
        return () => {
            setCustomers([]);
        };
    }, [user]);

    const handleEdit = (customer) => {
        setEditData(customer);
        setShowModal(true);
    };

    const handleDelete = async (customerId) => {
        try {
            await db.collection('customers').doc(customerId).delete();
            setCustomers(customers.filter(customer => customer.id !== customerId));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData(null);
    };

    const handleSaveChanges = async () => {
        try {
            await db.collection('customers').doc(editData.id).update({
                customerName: editData.customerName,
                companyName: editData.companyName,
                mobileNumber: editData.mobileNumber,
                email: editData.email,
                gstNumber: editData.gstNumber,
                address: editData.address,
                source: editData.source,
            });
            setCustomers(customers.map(customer =>
                customer.id === editData.id ? editData : customer
            ));
            handleCloseModal();
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const columns = [
        {
            Header: 'S.No',
            id: 'serialNumber',
            Cell: ({ row }) => row.index + 1,
        },
        { Header: 'Name', accessor: 'customerName' },
        { Header: 'Company Name', accessor: 'companyName' },
        { Header: 'Mobile Number', accessor: 'mobileNumber' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'GST Number', accessor: 'gstNumber' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Source', accessor: 'source' },
        { Header: 'Added By', accessor: 'customerAddedby' },
        { Header: 'Assigned To', accessor: 'assignedEmployeeName' || 'NA' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="primary" size="sm" onClick={() => handleEdit(row.original)}><FaEdit /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row.original.id)}><FaTrashAlt /></Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <h2>Customer List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable columns={columns} data={customers} />
            )}

            {/* Edit Modal */}
            {editData && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group controlId="customerName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editData.customerName}
                                            onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="companyName">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editData.companyName}
                                            onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="mobileNumber">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editData.mobileNumber}
                                    onChange={(e) => setEditData({ ...editData, mobileNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="gstNumber">
                                <Form.Label>GST Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editData.gstNumber}
                                    onChange={(e) => setEditData({ ...editData, gstNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editData.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="source">
                                <Form.Label>Source</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editData.source}
                                    onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default CustomerTable;
