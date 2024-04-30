import React, { useState } from 'react'
import './Payments.css';
import Button from '@mui/material/Button';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import { Divider } from '@mui/material';
import moment from 'moment/moment';
import axios from 'axios';
import { useEffect } from 'react';
import swal from 'sweetalert';
export default function Payments() {
    const [PaymentsList, setPaymentsList] = useState([]);
    const Role = window.sessionStorage.getItem('Role');
    const userId = window.sessionStorage.getItem('UserId');
    const [AmountToBePaid, setAmountToBePaid] = useState();
    const [InvoiceDetails, setInvoiceDetails] = useState({
        TenantId: userId,
        PaidDate: new Date(moment().format('YYYY-MM-DD'))
    });
    useEffect(() => {

        return () => {
            getPreviousPayments();
            loadAmountToBePaid();
        }
    }, [])


    async function getPreviousPayments() {
        const Payments = await axios.get('http://localhost:8081/getPreviousPayments', { params: { TenantId: InvoiceDetails.TenantId } });
        if (Payments.data.Status === 'success') {
            setPaymentsList(Payments.data.Result);
        }
    }

    async function payBill() {
        try {
            const formattedPaidDate = moment(InvoiceDetails.PaidDate).format('YYYY-MM-DD');
            const Payments = await axios.post('http://localhost:8081/payBill', {
                TenantId: InvoiceDetails.TenantId,
                PaidDate: formattedPaidDate
            });
            if (Payments.data.status === 'success') {
                swal({
                    title: 'Success',
                    text: 'Your bill paid successfully',
                    icon: 'success'
                }).then(ok => {
                    if (ok) {
                        getPreviousPayments();
                    }
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    }
    async function loadAmountToBePaid() {
        const result = await axios.get('http://localhost:8081/loadTenantCounts', { params: { LandlordID: userId } });
        if(result.data.Status === 'success')
        {
            setAmountToBePaid(result.data.Result.Rent_per_Month);
        }        
    }
    function isDateInCurrentMonth(dateString) {
        const PassedDate = new Date(dateString);
        const inputDate = moment(PassedDate, 'YYYY-MM-DD', true);
        if (!inputDate.isValid()) {
          return false;
        }
        const isInCurrentMonth = inputDate.isSame(moment(), 'month');
        return isInCurrentMonth;
      }
    return (
        <div className="maintenance-requests-outer-container">
            <div className="payments-outer-container">
                <div className="payments-list">
                    <div className='payments-details'>
                        <div className="payment-details-text">
                            <span>Your Monthly rent as of </span><span>{moment().format('DD-MMMM-YYYY')}</span>
                        </div>
                        {PaymentsList.length > 0 && <div className="payment-details-amount"> 
                        {isDateInCurrentMonth(PaymentsList[0].PaidDate)? '$0':'$'+AmountToBePaid}
                        </div>}
                        {PaymentsList.length === 0 && <div className="payment-details-amount"> 
                        ${AmountToBePaid}
                        </div>}
                        
                        {Role === 'tenant' && PaymentsList.length > 0 && !isDateInCurrentMonth(PaymentsList[0].PaidDate) &&
                            <Button variant="contained" startIcon={<AttachMoneySharpIcon />} style={{ color: 'white', backgroundColor: 'black', width: '300px', height: '50px', borderRadius: '30px' }} onClick={()=>payBill()}>
                                Pay
                            </Button>}
                            {Role === 'tenant' && PaymentsList.length === 0 &&
                            <Button variant="contained" startIcon={<AttachMoneySharpIcon />} style={{ color: 'white', backgroundColor: 'black', width: '300px', height: '50px', borderRadius: '30px' }} onClick={()=>payBill()}>
                                Pay
                            </Button>}
                    </div>
                    <img src="https://cdngeneralmvc.securecafenet.com/images/payments-graphics.svg" alt="" />
                </div>
                <div className="previous-bills-heading">Previous Invoices
                    <Divider /></div>
                    {PaymentsList.length ===0 && <div className='no-payments'>
                        There are no previous payments
                    </div> }
                {PaymentsList.map((payment, index) => (
                    <div className="previous-months-list" key={index}>
                        <div className="month">{moment(payment.PaidDate, 'DD-MM-YYYY').format('MMMM')}</div>
                        <div className="amount">${payment.Amount}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
