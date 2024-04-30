import React, { useEffect, useState } from 'react';
import Navbar from '../Components/LandingNav/Navbar';
import axios from 'axios';
import Counter from '../Components/Counter/Counter';
import Properties from './Properties';
import MaintenanceRequests from '../MaintenanceRequests/HomeMaintenanceRequests'
import './Home.css';
export default function Home() {
  const userId = window.sessionStorage.getItem('UserId');
  const Role = window.sessionStorage.getItem('Role');
  const [CounterData, setCounterData] = useState([]);
  useEffect(() => {
    LoadCountDetails();
  }, [userId, Role]);
  async function LoadCountDetails() {
    try {
      if(Role === 'Landlord')
      {
        const result = await axios.get('http://localhost:8081/loadCounts', { params: { LandlordID: userId } });
        let temp =[];
        if (result.data.Status === 'success') {
          Object.entries(result.data.Result).map(([key, value]) => {
            temp.push({ text: key, count: value });
        });
          setCounterData(temp);
        }
      }
      else
      {
        const result = await axios.get('http://localhost:8081/loadTenantCounts', { params: { LandlordID: userId } });
        let temp =[];
        if (result.data.Status === 'success') {
          Object.entries(result.data.Result).map(([key, value]) => {
            temp.push({ text: key, count: value });
        });
          setCounterData(temp);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Navbar />
      <div className="counter-container">
          {CounterData.map((element, index) => (
            <Counter key={index} text={element.text} count={element.count} />
          ))}
        </div>
        {Role === 'Landlord'? <Properties/>: <MaintenanceRequests/>}
        
    </>
  );
}
