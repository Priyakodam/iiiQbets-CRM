import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/FirebaseConfig';
import DataTable from "../../DataTable";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CustomerTable = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editedData, setEditedData] = useState({
        customerName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        gstNumber: '',
        address: '',
        source: '',
        remark: '' 
    });



    

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const queryByCustomerAddedByUid = db.collection('customers')
                    .where('customeraddedbyuid', '==', user.uid)
                    .orderBy('createdAt', 'desc');

                const queryByAssignedEmployeeUid = db.collection('customers')
                    .where('assignedEmployeeUid', '==', user.uid)
                    .orderBy('createdAt', 'desc');

                const [addedByUidSnapshot, assignedEmployeeUidSnapshot] = await Promise.all([
                    queryByCustomerAddedByUid.get(),
                    queryByAssignedEmployeeUid.get()
                ]);

                const customerData = [
                    ...addedByUidSnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        sno: index + 1,
                        ...doc.data()
                    })),
                    ...assignedEmployeeUidSnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        sno: addedByUidSnapshot.size + index + 1,
                        ...doc.data()
                    }))
                ];

                const uniqueCustomers = customerData.reduce((acc, customer) => {
                    if (!acc.some(c => c.id === customer.id)) {
                        acc.push(customer);
                    }
                    return acc;
                }, []);

                setCustomers(uniqueCustomers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer data:', error);
                setLoading(false);
            }
        };

        if (user && user.uid) {
            fetchCustomers();
        }
    }, [user]);

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setEditedData({
            customerName: customer.customerName,
            companyName: customer.companyName,
            mobileNumber: customer.mobileNumber,
            email: customer.email,
            gstNumber: customer.gstNumber,
            address: customer.address,
            source: customer.source,
            remark: customer.remark || '',
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this customer?')) {
                await db.collection('customers').doc(id).delete();
                setCustomers(customers.filter((customer) => customer.id !== id));
                console.log('Customer deleted:', id);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await db.collection('customers').doc(selectedCustomer.id).update(editedData);
            setCustomers(customers.map((customer) =>
                customer.id === selectedCustomer.id ? { ...customer, ...editedData } : customer
            ));
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const columns = [
        { Header: 'S.No', accessor: 'sno' },
        { Header: 'Name', accessor: 'customerName' },
        { Header: 'Company Name', accessor: 'companyName' },
        { Header: 'Mobile Number', accessor: 'mobileNumber' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'GST Number', accessor: 'gstNumber' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Source', accessor: 'source' },
        { Header: 'Added By', accessor: 'customerAddedby' },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="primary" size="sm" onClick={() => handleEdit(row.original)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </Button>
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
            <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Customer</Modal.Title>
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
                                    <Form.Label>GST Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.gstNumber}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, gstNumber: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.address}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, address: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Source</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.source}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, source: e.target.value })
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

export default CustomerTable;