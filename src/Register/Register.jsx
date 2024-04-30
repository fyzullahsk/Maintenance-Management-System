import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Auth from './Auth'
import './Register.css';
import axios from 'axios';
import swal from 'sweetalert';
export default function Register() {
    const navigate = useNavigate();
    const [UserDetails, setUserDetails] = useState({
        Name: '',
        DOB: '',
        Mobile: '',
        Email: '',
        Password: '',
        Role: 'Landlord'
    });
    const [Error, setError] = useState({});
    function handleUserDetails(event) {
        setUserDetails({ ...UserDetails, [event.target.name]: event.target.value });
    }
    async function handleRegister() {
        const validationErrors = Auth(UserDetails);
        setError(validationErrors);
        const hasNoErrors = Object.keys(validationErrors).length === 0;
        if (hasNoErrors) {
            try {
                const UserRegistration = await axios.post('http://localhost:8081/register', UserDetails);
                if (UserRegistration.data.status === 'success') {
                    swal({
                        title: 'Success',
                        text: 'LandLord Registered Successfully',
                        icon: 'success'
                    }).then((ok) => {
                        if (ok) {
                            navigate('/login');
                        }
                    })
                }
            } catch (error) {
                swal({
                    title: 'Error',
                    text: error.response.data.message,
                    icon: 'error'
                });
            }
        }
    }

    return (
        <div className="register-outer-container">
            <div className="register-inputs-outer-container">
                <div className="title">Register</div>
                <div className="register-inputs">
                    <div className="form">
                        <input type="text" name="Name" autoComplete="off" required onChange={handleUserDetails} />
                        <label htmlFor="Name" className="label-name">
                            <span className="content-name">
                                Enter Name
                            </span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="date" name="DOB" autoComplete="off" required onChange={handleUserDetails} />
                        <label htmlFor="DOB" className="label-name">
                            <span className="content-name">
                                Enter DOB
                            </span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="number" name="Mobile" autoComplete="off" required onChange={handleUserDetails} />
                        <label htmlFor="Mobile" className="label-name">
                            <span className="content-name">
                                Enter Mobile Number
                            </span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="email" name="Email" autoComplete="off" defaultValue='@gmail.com' required onChange={handleUserDetails} />
                        <label htmlFor="Email" className="label-name">
                            <span className="content-name">
                                Enter Email
                            </span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="password" name="Password" autoComplete="off" required onChange={handleUserDetails} />
                        <label htmlFor="Password" className="label-name">
                            <span className="content-name">
                                Enter Password
                            </span>
                        </label>
                    </div>
                    <div className="form">
                        <input type="Password" name="ConfirmPassword" autoComplete="off" required onChange={handleUserDetails} />
                        <label htmlFor="Confirm Password" className="label-name">
                            <span className="content-name">
                                Confirm Password
                            </span>
                        </label>
                    </div>
                </div>
                <div className="error-container">
                    {Object.values(Error).map((error, index) => (
                        <div key={index} className="error-message">{error}</div>
                    ))}
                </div>
                <div className="form-button">
                    <button type="button" className="loginbtn"><Link to={"/"}>Cancel</Link></button>
                    <button type="button" className="loginbtn" onClick={() => handleRegister()}>Submit</button>
                </div>
                <div className="register-section">
                    <span>Already a member?</span> <Link to={"/login"}>Login</Link>
                </div>
            </div>
        </div>
    )
}
