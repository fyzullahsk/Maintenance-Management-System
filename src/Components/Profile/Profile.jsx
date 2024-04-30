import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import './Profile.css';

export default function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const userId = window.sessionStorage.getItem('UserId');
  const Role = window.sessionStorage.getItem('Role');
  useEffect(() => {
    LoadUserDetails();
  }, []);

  async function LoadUserDetails() {
    try {
      const response = await axios.get(
        Role === 'Landlord' ? 'http://localhost:8081/getUserDetails' : 'http://localhost:8081/getTenantDetails',
        { params: { userID: userId } }
      );
      
      if (response.data.Status === 'success') {
        setUserDetails(response.data.Result);
      } else {
        console.error("Error fetching user details:", response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return {
        sx: {
          bgcolor: '#ccc',
        },
        children: <FaUserAlt />,
      };
    }
  
    const firstNameInitial = name.split(' ')[0][0].toUpperCase();
    const lastNameInitial = name.split(' ')[1] ? name.split(' ')[1][0] : ''.toUpperCase();
  
    const initials = `${firstNameInitial}${lastNameInitial}`;
  
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials,
    };
  }
  
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const { Name, Mobile } = userDetails;

  return (
    <div className="profile">
      <Avatar {...stringAvatar(Name)}/>
      <div className='profile-name'>
        <span>{Name}</span>
        <span><FaPhoneAlt /><span>{Mobile}</span></span>
      </div>
    </div>
  );
}