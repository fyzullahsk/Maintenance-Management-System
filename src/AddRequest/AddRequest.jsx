import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import imageCompression from 'browser-image-compression';
import moment from 'moment';
import swal from 'sweetalert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
export default function AddRequest({ DrawerOpen, toggleDrawer }) {
    const options = ['Emergency', 'High', 'Low', 'Medium'];
    const category = ['Appliance', 'Casualty Loss', 'Cleaning', 'Common Area', 'Doors-Windows', 'Electrical', 'Flooring', 'HVAC', 'Key Lock', 'Landscaping', 'Other', 'Painting', 'Plumbing', 'Roof', 'Storm Damage'];
    const [selectedPriority, setIsSelectedPriority] = React.useState("Select Proiority");
    const [selectedCategory, setIsSelectedCategory] = React.useState("Select Category");
    const [Description, setDescription] = React.useState('');
    const [Attachment, setAttachment] = React.useState('');
    const userId = window.sessionStorage.getItem('UserId');
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const handlePriorityChange = (event) => {
        setIsSelectedPriority(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setIsSelectedCategory(event.target.value);
    };
    async function handleUploadFile(event) {
        let selectedFile = event.target.files[0];
        if (selectedFile) {
            const compressedImage = await compressImage(selectedFile);
            setAttachment(compressedImage);
        }
    }
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 500,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    };
    async function handleSubmitRequest() {
        if(selectedPriority !== 'Select Proiority' && selectedCategory!== 'Select Category' && Description !== '' && Attachment !== '')
        {

            try {
                  const formData = new FormData();
                  formData.append('Description', Description);
                  formData.append('Priority', selectedPriority);
                  formData.append('Category', selectedCategory);
                  formData.append('TenantID', userId);
                  formData.append('SubmittedDate', moment().format('DD-MM-YYYY'));
                  formData.append('image', Attachment);
                  await axios.post('http://localhost:8081/addMaintenanceRequest', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }).then(result=>{
                    if(result.data.status)
                    {
                      swal({title:'Request Added',text:'Your request is added and you will get the further updates',icon:'success'}).then(ok=>{toggleDrawer()})
                    }
                  })
                } catch (error) {
                  throw new Error('Error uploading image:', error);
                }
        }
        else{
            swal({title:'Invalid Inputs',text:'Please fill in all data along with image',icon:'error'})
        }
    }
    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" >
            <div className="tenant-inputs">
                <div className="header">
                    <div className="title">New Maintenance Request</div>
                    <Divider />
                </div>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel id="demo-simple-select-helper-label">Select Priority</InputLabel>
                    <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Select Property" onChange={handlePriorityChange}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {options.map(element => (
                            <MenuItem key={element} value={element}>{element} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel id="demo-simple-select-helper-label">Select Category</InputLabel>
                    <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Select Property" onChange={handleCategoryChange}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {category.map(element => (
                            <MenuItem key={element} value={element}>{element} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField name='Name' id="filled-textarea" label="Full Description of Issue" placeholder="Description of Issue" rows={4} multiline variant="standard" onChange={(e) => { setDescription(e.target.value) }} />
                <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} style={{ backgroundColor: 'black', color: 'white' }} onChange={(e)=>handleUploadFile(e)}>
                    Add Attachments
                    <VisuallyHiddenInput type="file" />
                </Button>
                <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleSubmitRequest()}>
                    Submit Request
                </Button>
            </div>
        </Box>
    );

    return (
        <Drawer
            open={DrawerOpen}
            onClose={() => toggleDrawer(false)}
            anchor="right"
        >
            {DrawerList}
        </Drawer>
    );
}
