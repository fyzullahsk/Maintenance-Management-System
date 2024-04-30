import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import swal from 'sweetalert';
export default function AddTechnician({ technicianDrawerOpen, toggleTechnicianDrawer }) {
  const [technicianDetails, settechnicianDetails] = React.useState({
    Name: '',
    Email: '',
    PhoneNumber: '',
    Expertise: ''
  })
  const Expertise = ['Plumber', 'Electrician', 'HVAC Technician', 'Handyman', 'Painter', 'Carpenter', 'Roofing Contractor', 'Landscaper', 'Pest Control Specialist', 'Appliance Repair Technician', 'Flooring Installer', 'Locksmith', 'Window Cleaner', 'Pressure Washer', 'Septic Tank Cleaner', 'Garage Door Installer', 'Fence Installer', 'Pool Cleaner', 'Interior Designer', 'Home Inspector', 'Mold Remediation Specialist', 'Chimney Sweep', 'Drywaller', 'Carpet Cleaner', 'Exterior Siding Installer', 'Gutter Cleaner', 'Home Organizer', 'Solar Panel Installer', 'Water Damage Restoration Specialist', 'Tree Trimmer'];
  const handleInputChange = (event) => {
    settechnicianDetails({ ...technicianDetails, [event.target.name]: event.target.value });
  };

  async function handleAddTechnician() {
    let isEmplyInput = Object.values(technicianDetails).some((value) => value.length === 0);
    if (!isEmplyInput) {
      await axios.post('http://localhost:8081/addTechnician', technicianDetails)
        .then(result => {
          if (result.data.status === 'success') {
            swal({ title: 'Success', text: 'Technician Added', icon: 'success' }).then(ok => { toggleTechnicianDrawer() })

          }
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" >
      <div className="tenant-inputs">
        <div className="header">
          <div className="title">New Technician</div>
          <Divider />
          <TextField name='Name' label="Enter Technician Name" placeholder="Technician Name" variant="standard" onChange={(e) => { handleInputChange(e) }} style={{ width: '100%', marginTop: '20px' }} autoComplete='off' />
          <TextField name='Email' label="Enter Technician Email" placeholder="Technician Email" variant="standard" onChange={(e) => { handleInputChange(e) }} style={{ width: '100%', marginTop: '20px' }} autoComplete='off' />
          <TextField name='PhoneNumber' label="Enter Technician Phone Number" placeholder="Technician Phone Number" type='number' variant="standard" onChange={(e) => { handleInputChange(e) }} style={{ width: '100%', marginTop: '20px' }} autoComplete='off' />
          <FormControl sx={{ m: 1, minWidth: 320 }} style={{ marginTop: '20px' }}>
            <InputLabel id="demo-simple-select-helper-label">Select Expertise</InputLabel>
            <Select name='Expertise' labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Select Property" onChange={(e) => { handleInputChange(e) }}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Expertise.map(element => (
                <MenuItem key={element} value={element}>{element} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button variant="outlined" className='input-button' onClick={() => { handleAddTechnician() }}>Add</Button>
        <Button variant="outlined" className='input-button' onClick={() => { toggleTechnicianDrawer(false) }}>Cancel</Button>
      </div>
    </Box>
  );

  return (
    <Drawer
      open={technicianDrawerOpen}
      onClose={() => toggleTechnicianDrawer(false)}
      anchor="right"
    >
      {DrawerList}
    </Drawer>
  );
}
