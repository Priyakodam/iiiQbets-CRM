import React, { useEffect, useState } from 'react';
import { db } from "../../Firebase/FirebaseConfig"; // Adjust the path as necessary
import DataTable from "../../DataTable"; // Import the DataTable component

const EmployeeView = () => {
    const [Employees, setEmployees] = useState([]);

    useEffect(() => {
        const unsubscribe = db
            .collection("users")
            .where("role", "==", "Employee")
            .orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                const EmployeeData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEmployees(EmployeeData);
            }, (error) => {
                console.error("Error fetching Employees: ", error);
            });

        // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
        return () => unsubscribe();
    }, []);

    // Define columns for DataTable
    const columns = React.useMemo(() => [
        {
            Header: 'S.No',
            accessor: (row, index) => index + 1, // Row index for serial number
        },
        {
            Header: 'Name',
            accessor: 'name', // Corresponds to Employee.name
        },
        {
            Header: 'Email',
            accessor: 'email', // Corresponds to Employee.email
        },
        {
            Header: 'Mobile Number',
            accessor: 'mobileNumber', // Corresponds to Employee.mobileNumber
        },
        {
            Header: 'Password',
            accessor: 'password', // Corresponds to Employee.password
        },
        {
            Header: 'Reporting Manager',
            accessor: 'reportingManager', // Corresponds to Employee.reportingManager
        },
    ], []);

    return (
        <div className="Employeeview-container">
            <div className="Employeeview-content">
                {Employees.length > 0 ? (
                    <DataTable columns={columns} data={Employees} />
                ) : (
                    <div className="text-center">No Employees Available</div>
                )}
            </div>
        </div>
    );
};

export default EmployeeView;
