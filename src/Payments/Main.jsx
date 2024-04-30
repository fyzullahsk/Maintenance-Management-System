import React from 'react';
import Navbar from '../Components/LandingNav/Navbar';
import Payments from './Payments';
import LandlordPayments from './LandlordPayments';
export default function Main() {
    const Role = window.sessionStorage.getItem('Role');
    const userId = window.sessionStorage.getItem('UserId');
    return (
        <div className="maintenance-requests-outer-container">
            <Navbar />
            <div className="requests-container">
                {Role === 'tenant' ? <Payments /> : <LandlordPayments />}
            </div>
        </div>
    )
}
