import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/FirebaseConfig';
import DataTable from "../../DataTable";

const ManagerLeadsTable = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // Query leads added by the user
                const addedByUidQuery = db.collection('leads')
                    .where('leadAddedbyUid', '==', user.uid)
                    .orderBy('createdAt', 'desc');

                // Query leads assigned to the user as reporting manager
                const reportingManagerUidQuery = db.collection('leads')
                    .where('reportingManagerUid', '==', user.uid)
                    .orderBy('createdAt', 'desc');

                // Fetch both queries
                const [addedByUidSnapshot, reportingManagerUidSnapshot] = await Promise.all([
                    addedByUidQuery.get(),
                    reportingManagerUidQuery.get()
                ]);

                // Combine results, ensuring uniqueness by document ID
                const combinedLeads = [
                    ...addedByUidSnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        sno: index + 1,
                        ...doc.data(),
                    })),
                    ...reportingManagerUidSnapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        sno: addedByUidSnapshot.size + index + 1,
                        ...doc.data(),
                    }))
                ];

                // Remove duplicates (if any) by document ID
                const uniqueLeads = combinedLeads.reduce((acc, lead) => {
                    if (!acc.some(item => item.id === lead.id)) {
                        acc.push(lead);
                    }
                    return acc;
                }, []);

                setLeads(uniqueLeads);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leads:', error);
                setLoading(false);
            }
        };

        if (user && user.uid) {
            fetchLeads();
        }
    }, [user]);

    const columns = [
        { Header: 'S.No', accessor: 'sno' },
        { Header: 'Name', accessor: 'customerName' },
        { Header: 'Company Name', accessor: 'companyName' },
        { Header: 'Mobile Number', accessor: 'mobileNumber' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Product', accessor: 'product' },
        { Header: 'Added By', accessor: 'leadAddedby' },
        
    ];

    return (
        <div>
            <h2>Leads</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable columns={columns} data={leads} />
            )}
        </div>
    );
};

export default ManagerLeadsTable;
