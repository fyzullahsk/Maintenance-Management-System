import React, { useEffect, useState } from 'react';
import Navbar from '../Components/LandingNav/Navbar';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddRequest from '../AddRequest/AddRequest';
import BasicModal from '../Components/BasicModal/BasicModal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import './MaintenanceRequests.css';
import swal from 'sweetalert';

export default function MaintenanceRequests() {
  const Role = window.sessionStorage.getItem('Role');
  const userId = window.sessionStorage.getItem('UserId');
  const [maintenanceRequest, setMaintenanceRequests] = useState([]);
  const [Technicians, setTechnicians] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalClosed, setModalClosed] = useState(true);
  const [DrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!DrawerOpen);
    loadMaintenanceRequests();
  };

  useEffect(() => {
    loadMaintenanceRequests();
    loadTechnicians();
  }, []);

  const toggleModal = (requestId) => {
    setSelectedRequest(requestId);
    setModalClosed(false);
  };

  const handleModalClose = () => {
    setModalClosed(true);
  };

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

  async function loadTechnicians() {
    try {
      const result = await axios.get('http://localhost:8081/getTechnicians');
      setTechnicians(result.data.Result);
      console.log(result.data.Result);
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
    }
  }

  async function handleRequestAssignment(technicianId) {
    try {
      const result = await axios.put('http://localhost:8081/assignTechnician', { TechnicianID: technicianId, RequestID: selectedRequest });
      if (result.data.status === 'success') {
        swal({
          title: 'Success',
          text: 'Technician assigned',
          icon: 'success'
        }).then(ok => {
          loadMaintenanceRequests();
          setModalClosed(true);
        });
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  }
  async function handleRequestSolved(requestId) {
    try {
      const result = await axios.put('http://localhost:8081/updateRequestToSuccess',{RequestID:requestId});
      if (result.data.status === 'success') {
        swal({
          title: 'Success',
          text: 'Request Closed',
          icon: 'success'
        }).then(ok => {
          loadMaintenanceRequests();
        });
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  }


  return (
    <div className='maintenance-requests-outer-container'>
      <Navbar />
      <div className="requests-container">
        <div className="requests-header">
          <p className='properties-title'>Maintenance Requests</p>
          {Role === 'tenant' && <Button variant="contained" startIcon={<AddIcon color='white' />} className='add-Maintenance-Request-Button' style={{ backgroundColor: 'black', color: 'white' }} onClick={toggleDrawer}>
            Add Request
          </Button>}
        </div>

        {maintenanceRequest.length === 0 && (
          <div className="no-Maintenance-Requests">
            Currently there are no Maintenance Requests
          </div>
        )}
        {maintenanceRequest.length > 0 && (
          <center>
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
                  {Role === 'Landlord' &&
                    <>
                      <th>Assigned Technician</th>
                      <th></th>
                    </>
                  }
                  {Role === 'tenant' &&
                      <th>Update Status</th>
                  }


                </tr>
              </thead>
              <tbody>
                {maintenanceRequest.map((element) => (
                  <tr key={element.RequestID}>
                    <td>{element.PropertyName}</td>
                    <td>{element.Priority}</td>
                    <td>{element.Category}</td>
                    <td>{element.Description}</td>
                    <td>{element.Name}</td>
                    <td>{element.SubmittedDate}</td>
                    <td>{element.status}</td>
                    {Role === 'Landlord' &&
                      <>
                        <td>{element.TechnicianID ? element.TechnicianName : 'No Technicians assigned Yet'}</td>
                        <td>
                        <Button
  variant="outlined"
  onClick={() => toggleModal(element.RequestID)}
  style={{
    fontWeight:'500',
    border: element.status === 'Solved' ? '3px solid green' : '1px solid black',
    color: element.status === 'Solved' ? 'green' : 'black'
  }}
  disabled={element.TechnicianID !== null}
>
  {element.TechnicianID ? (element.status === 'Solved' ? 'Solved' : 'In Progress') : 'Assign to'}
</Button>
                        </td>
                      </>
                    }
                    {Role === 'tenant' && <td><Button variant="outlined" onClick={() => handleRequestSolved(element.RequestID)} style={{ borderColor: 'black', color: 'black' }} disabled={element.status === 'Solved'}>Solved</Button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        )}
      </div>
      <AddRequest toggleDrawer={toggleDrawer} DrawerOpen={DrawerOpen} />
      {!modalClosed && (
        <BasicModal onClose={handleModalClose}>
          <Typography variant="h6" component="h2">
            Available Technicians
          </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {Technicians.length === 0 && <ListItem alignItems="flex-start">
              <ListItemText primary="No Technicians available. Please add Technicians" />
            </ListItem>}
            {Technicians.map((technician, index) => (
              <div key={technician.TechnicianID} onClick={() => handleRequestAssignment(technician.TechnicianID)} className='technician-list'>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar className='list-item-avatar'>{technician.Name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={technician.Name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {technician.Expertise}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </BasicModal>
      )}
    </div>
  );
}