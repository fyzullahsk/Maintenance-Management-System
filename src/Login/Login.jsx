import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import axios from 'axios';
import swal from 'sweetalert';
export default function Login() {
    const navigate = useNavigate('');
    const [values, setValues] = useState({
        Email: '',
        Password: ''
    });

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    async function handleLogin() {
        let isEmplyInput = Object.values(values).some((value) => value.length === 0);
        if (!isEmplyInput) {
            await axios.post('http://localhost:8081/login', values).then((res) => {
                if (res.data.status === 'success') {
                    window.sessionStorage.setItem('Role',res.data.Role);
                    window.sessionStorage.setItem('UserId',res.data.id);
                    navigate('/home');
                }
            }).catch(error => {
                swal({
                    title: 'Failed',
                    text: error.response.data.message,
                    icon: 'error'
                })
            })
        }
    }
    return (
        <>
        <div className="login-container">
            <div className="login-inputs">
                <div className="title">Login</div>
                <div className="form">
                    <input type="email" name="Email" autoComplete="off" value={values.Email} onChange={handleChange} required />
                    <label htmlFor="Email" className="label-name">
                        <span className="content-name">
                            Enter Email
                        </span>
                    </label>
                </div>
                <div className="form">
                    <input type="password" name="Password" value={values.Password} onChange={handleChange} autoComplete="off" required />
                    <label htmlFor="Password" className="label-name">
                        <span className="content-name">
                            Enter Password
                        </span>
                    </label>
                </div>
                <div className="form-button">
                    <button type="button" className="loginbtn"><Link to={"/"}>Cancel</Link></button>
                    <button type="button" className="loginbtn" onClick={() => handleLogin()}>Login</button>
                    {/* onClick={handleOnClick} */}
                </div>
                <div className="register-section">
                    <span>Not a member?</span> <Link to={"/register"}>Register</Link>
                </div>
            </div>
        </div>
        </>
    )
}
