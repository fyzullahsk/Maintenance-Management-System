import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './Tenant.css';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import swal from 'sweetalert';

export default function Tenant({ tenantDrawerOpen, toggleTenantDrawer }) {
  const userId = window.sessionStorage.getItem('UserId');
  const [PropertiesList, setPropertiesList] = React.useState([]);
  const [Tenant, setTenant] = React.useState({
    Name: '',
    Email: '',
    PhoneNumber: ''
  });

  const [selected, setIsSelected] = React.useState('');

  const handleChange = (event) => {
    setIsSelected(event.target.value);
  };

  const tenantDetailsChange = (event) => {
    setTenant({ ...Tenant, [event.target.name]: event.target.value });
  };

  async function loadProperties() {
    await axios.get('http://localhost:8081/getLandLordProperties', { params: { LandlordId: userId } })
      .then((result) => {
        setPropertiesList(result.data.Result);
        if (result.data.Result.length === 0) {
          setIsSelected({ ...selected, name: 'no properties to add' });
        }
      }).catch(err => {
        console.error(err);
      })

  }
  async function handleAddTenant() {
    let isEmplyInput = Object.values(Tenant).some((value) => value.length === 0);
    if (!isEmplyInput && selected) {
      await axios.post('http://localhost:8081/addTenant', { ...Tenant, PropertyID: selected })
        .then(result => {
          if (result.data.status === 'success') {
            swal({
              title: 'Success',
              text: 'Tenant Added',
              icon: 'success'
            }).then(ok => {
              if (ok) {
                toggleTenantDrawer(false);
              }
            })
          }
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" >
      {/* onClick={() => toggleTenantDrawer(false)} */}
      <div className="tenant-inputs">
        <div className="header">
          <div className="title">New Tenant</div>
          <Divider />
        </div>
        <TextField name='Name' id="filled-textarea" label="Enter Tenant Name" placeholder="Tenant Name" multiline variant="standard" onChange={tenantDetailsChange} />
        <TextField name='Email' id="filled-textarea" label="Enter Tenant Email" placeholder="Tenant Email" multiline variant="standard" onChange={tenantDetailsChange} />
        <TextField name='PhoneNumber' id="filled-textarea" label="Enter Tenant Phone" variant="standard" type='number' onChange={tenantDetailsChange} />
        <FormControl sx={{ m: 1, minWidth: 120 }} >
          <InputLabel id="demo-simple-select-helper-label">Select Property</InputLabel>
          <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={selected} label="Select Property" onChange={handleChange} onFocus={() => { loadProperties() }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {PropertiesList.map(element => (
              <MenuItem key={element.PropertyID} value={element.PropertyID}>{element.Name} </MenuItem>
              // - {element.Address}
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" className='input-button' onClick={() => handleAddTenant()}>Add</Button>
      </div>
    </Box>
  );

  return (
    <Drawer
      open={tenantDrawerOpen}
      onClose={() => toggleTenantDrawer(false)}
      anchor="right"
    >
      {DrawerList}
    </Drawer>
  );
}
