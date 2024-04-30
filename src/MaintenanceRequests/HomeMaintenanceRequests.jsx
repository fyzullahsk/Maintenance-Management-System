import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MaintenanceRequests.css';
export default function HomeMaintenanceRequests() {
    const Role = window.sessionStorage.getItem('Role');
    const userId = window.sessionStorage.getItem('UserId');
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);

    useEffect(() => {
      loadMaintenanceRequests();
    }, []);
  
 
    async function loadMaintenanceRequests() {
      try {
        const result = await axios.get(Role === 'Landlord' ? 'http://localhost:8081/getMaintenanceRequests' : 'http://localhost:8081/getTenantMaintenanceRequests',
        { params: { userID: userId } }
      );
        setMaintenanceRequests(result.data.Result);
      } catch (error) {
        console.error('Error loading maintenance requests:', error);
      }
    }
  
    return (
      <div className='maintenance-requests-outer-container'>
        <div className="requests-container">
        <p className='properties-title'>Maintenance Requests</p>
          {maintenanceRequests.length === 0 && (
            <div className="no-Maintenance-Requests">
              Currently there are no Maintenance Requests
            </div>
          )}
          {maintenanceRequests.length > 0 && (
            <center >
              <table className="gridTable requests-gridTable">
                <thead>
                  <tr>
                  <th>Property</th>
                    <th>Priority</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Submitted by</th>
                    <th>Submitted on</th>
                    <th>Status</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRequests.map((element) => (
                    <tr key={element.RequestID}>
                      <td>{element.PropertyName}</td>
                      <td>{element.Priority}</td>
                      <td>{element.Category}</td>
                      <td>{element.Description}</td>
                      <td>{element.Name}</td>
                      <td>{element.SubmittedDate}</td>
                      <td>{element.status}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </center>
          )}
        </div>
      </div>
    )
}
