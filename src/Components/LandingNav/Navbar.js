import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import Profile from '../Profile/Profile';
import Tenant from '../../Tenant/Tenant';
import { useNavigate } from 'react-router-dom';
import './LandingNav.css';
import Property from '../../Property/Property';
export default function Navbar() {
  const Role = window.sessionStorage.getItem('Role');
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [tenantDrawerOpen, setTenantDrawerOpen] = React.useState(false);
  const [propertyDrawerOpen, setPropertyDrawerOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleTenantDrawer = (open) => {
    setTenantDrawerOpen(open);
  };


  const togglePropertyDrawer = (open) => {
    setPropertyDrawerOpen(open);
  };
  const handleLogout = () => {
    window.sessionStorage.setItem('Role', '');
    window.sessionStorage.setItem('UserId', '');
    navigate('/login');
  };

  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <Profile />
      <List>
        <ListItem >
          <ListItemButton onClick={() => navigate('/home')}>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        {Role === 'Landlord' && <>
        <ListItem >
          <ListItemButton onClick={() => toggleTenantDrawer(true)}>
            <ListItemText primary={'Add Tenant'} />
          </ListItemButton>
        </ListItem>
        <ListItem >
          <ListItemButton onClick={() => togglePropertyDrawer(true)}>
            <ListItemText primary={'Add Property'} />
          </ListItemButton>
        </ListItem>
        <ListItem >
          <ListItemButton onClick={() => navigate('/Technician')}>
            <ListItemText primary={'Technicians'} />
          </ListItemButton>
        </ListItem>
        </>}
        <ListItem >
          <ListItemButton onClick={() => navigate('/maintenance-requests')}>
            <ListItemText primary={'Maintenance Requests'} />
          </ListItemButton>
        </ListItem>
        
        <ListItem >
          <ListItemButton onClick={() => navigate('/Payments')}>
            <ListItemText primary={'Payments'} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem >
          <ListItemButton onClick={() => handleLogout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Signout'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="Menu-button">
      <MenuOutlinedIcon onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Tenant tenantDrawerOpen={tenantDrawerOpen} toggleTenantDrawer={toggleTenantDrawer} />
      <Property propertyDrawerOpen={propertyDrawerOpen} togglePropertyDrawer={togglePropertyDrawer} />
      
    </div>
  );
}