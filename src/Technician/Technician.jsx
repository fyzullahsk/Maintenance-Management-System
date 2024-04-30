import React, { useEffect } from 'react';
import './Technician.css';
import Navbar from '../Components/LandingNav/Navbar';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddTechnician from './AddTechnician';
import axios from 'axios';
export default function Technician() {
  useEffect(() => {
      
    return () => {
      loadProperties();
    }
  }, [])
  
  const [Technicians, setTechnicians] = React.useState([]);
  const [technicianDrawerOpen, settechnicianDrawerOpen] = React.useState(false);
  const toggleTechnicianDrawer = () => {
    settechnicianDrawerOpen(!technicianDrawerOpen);
    loadProperties();
  };
  async function loadProperties() {
    await axios.get('http://localhost:8081/getTechnicians')
      .then((result) => {
        setTechnicians(result.data.Result);
      }).catch(err => {
        console.error(err);
      })

  }
  return (
    <div className='technicians-outer-container'>
      <Navbar />
      <div className="grid-container">
      <div className="table-section-header">
      <p className='properties-title'>Technicians</p>
      <Button variant="contained" startIcon={<AddIcon color='white' />} className='add-Maintenance-Request-Button' style={{ backgroundColor: 'black', color: 'white' }} onClick={toggleTechnicianDrawer}>
          Add Technician
        </Button>
      </div>
      {Technicians.length === 0 && (
            <div className="no-Maintenance-Requests">
              Currently there are no Technicianss available<br/> Add Technician
            </div>
          )}
          {Technicians.length > 0 && (
            <center >
              <table className="gridTable requests-gridTable">
                <thead>
                  <tr>
                  <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Expertise</th>
                  </tr>
                </thead>
                <tbody>
                  {Technicians.map((element) => (
                    <tr key={element.TechnicianID}>
                      <td>{element.Name}</td>
                      <td>{element.Email}</td>
                      <td>{element.PhoneNumber}</td>
                      <td>{element.Expertise}</td>                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </center>
          )}
      </div>
      <AddTechnician toggleTechnicianDrawer={toggleTechnicianDrawer} technicianDrawerOpen={technicianDrawerOpen} />
    </div>
  )
}
