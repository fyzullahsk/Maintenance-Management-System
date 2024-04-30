import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import './Payments.css';
export default function LandlordPayments() {
    const [PaymentsList, setPaymentsList] = useState([]);
    const userId = window.sessionStorage.getItem('UserId');
    useEffect(() => {
        return () => {
            getPayments();
        }
    }, [])

    async function getPayments() {
        const Payments = await axios.get('http://localhost:8081/allTenantInvoices', { params: { LandlordId: userId } });
        if (Payments.data.Status === 'success') {
            setPaymentsList(Payments.data.Result);
        }
    }
    return (
        <div className='landlords-payments-outer-container'>
            {PaymentsList.length === 0 && <div className="no-payments">
                No Payments Available Yet
            </div>}
            {PaymentsList.length > 0 &&
                <center>
                    <table className="gridTable requests-gridTable">
                        <thead>
                            <tr>
                                <th>Property Name</th>
                                <th>Tenant Name</th>
                                <th>Paid Date</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render table rows if PaymentsList is not empty */}
                            {PaymentsList.map((element, index) => (
                                <tr key={index}>
                                    <td>{element.PropertyName}</td>
                                    <td>{element.TenantName}</td>
                                    <td>{moment(element.paidDate).format('DD-MM-YYYY')}</td>
                                    <td>{element.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </center>
            }

        </div>

    )
}
