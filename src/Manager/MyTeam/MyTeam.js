import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import { useAuth } from '../../Context/AuthContext';
import { db } from "../../Firebase/FirebaseConfig"; // Ensure db is imported correctly
import DataTable from "../../DataTable"; // Import the DataTable component
import "./MyTeam.css";

const MyTeam = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth(); // Access the logged-in user's data
  const [teamMembers, setTeamMembers] = useState([]); // To store the list of employees
  
  useEffect(() => {
    if (user && user.uid) {
      console.log("Current User UID: ", user.uid); // Log the current user UID
  
      const fetchTeamMembers = async () => {
        try {
          const teamSnapshot = await db.collection('users')
            .where('role', '==', 'Employee')
            .where('reportingManagerUid', '==', user.uid)
            .get();
          
          if (!teamSnapshot.empty) {
            const membersList = teamSnapshot.docs.map((doc, index) => {
              const memberData = doc.data();
              return {
                ...memberData, // Spread the existing data
                sno: index + 1, // Add the 'sno' field with the index value
              };
            });
            console.log("Team Members: ", membersList); // Log the fetched team members
            setTeamMembers(membersList);
          } else {
            console.log("No team members found.");
          }
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      };
  
      fetchTeamMembers();
    }
  }, [user]); 
  const columns = React.useMemo(
    () => [

        {
            Header: 'S.No',
            accessor: 'sno', // Field to be displayed in this column
          },
      {
        Header: 'Employee Name',
        accessor: 'name', // Field to be displayed in this column
      },

      {
        Header: 'Email',
        accessor: 'email',
      },    
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber',
      },
      
    ],
    []
  );

  return (
    <div className="m-team-container">
      <ManagerSidebar onToggleSidebar={setCollapsed} />
      <div className={`m-team-content ${collapsed ? 'collapsed' : ''}`}>
        <h2>My Team</h2>
        {teamMembers.length > 0 ? (
          <DataTable columns={columns} data={teamMembers} /> // Pass columns and team data
        ) : (
          <p>No team members found</p>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
