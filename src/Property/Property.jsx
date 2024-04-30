import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Property.css';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import ImageUploader from '../Components/ImageUploader/ImageUploader'
export default function Property({ propertyDrawerOpen, togglePropertyDrawer }) {
  const [PropertyDetails, setPropertyDetails] = React.useState({
    Name: '',
    Address: '',
    Price:0,
    isUploadImages:false,
    LandlordID:window.sessionStorage.getItem('UserId'),
    PropertyId:0
  });

    function handlePropertyDetails(event) {
      setPropertyDetails({ ...PropertyDetails, [event.target.name]: event.target.value });
    }

    async function handleAddProperty() {
      let isEmplyInput = Object.values(PropertyDetails).some((value) => value.length === 0);
      if(!isEmplyInput)
      {
       await axios.post('http://localhost:8081/addProperty',PropertyDetails)
       .then(result => {
        if(result.data.status === 'success')
        {
          setPropertyDetails({
            ...PropertyDetails,
            PropertyId: result.data.id,
            isUploadImages: true
          });
  
        }
       })
       .catch(err=>{
        console.error(err);
       })
        console.log(PropertyDetails);
      }
    }
    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" >
            {/* onClick={() => togglePropertyDrawer(false)} */}
            <div className="tenant-inputs">
                <div className="header">
                    <div className="title">New Property</div>
                    <Divider />
                </div>
                <TextField name='Name' id="filled-textarea" label="Enter Property Name" placeholder="Property Name" multiline variant="standard" onChange={handlePropertyDetails}/>
                <TextField name='Address' id="filled-textarea" label="Enter Property Address" placeholder="Property Address" multiline variant="standard" onChange={handlePropertyDetails}/>
                <TextField name='Price' id="filled-textarea" label="Enter Property Price" variant="standard" type='number' onChange={handlePropertyDetails} />
             {PropertyDetails.isUploadImages === false && (
              <>
              <Button variant="outlined" className='input-button' onClick={()=>handleAddProperty()}>Add</Button>
            <Button variant="outlined" className='input-button' onClick={()=>{togglePropertyDrawer(false)}}>Cancel</Button>
            </>
          )}
          {PropertyDetails.isUploadImages && <ImageUploader service_id={PropertyDetails.PropertyId} togglePropertyDrawer={togglePropertyDrawer} /> }
          </div>
        </Box>
    );

    return (
        <Drawer
            open={propertyDrawerOpen}
            onClose={() => togglePropertyDrawer(false)}
            anchor="right"
        >
            {DrawerList}
        </Drawer>
    );
}
