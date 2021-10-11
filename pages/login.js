
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import * as Yup from 'yup';
import jwt_decode from "jwt-decode";


//https://stackoverflow.com/questions/54604505/redirecting-from-server-side-in-nextjs
export default function Login() {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [headline, setHeadline] = useState('');
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState(false);


    const loginUser = async event => {
        event.preventDefault()

        const res = await fetch(
            'http://localhost:8080/user/auth',
            {
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        )

        const result = await res.json()
        if(res.ok) {
            setAlert(false)
            localStorage.setItem("token", result['token'])
            router.push({
                pathname: '/',
            })
        }
        else {
            setHeadline("Error")
            setMessage("Authorization Failed")
            setAlert(true)
        }
    }

    useEffect(() => {
        //Prefetch the index page
        router.prefetch('/')
    }, [])

    function loginAlert() {

        if(alert) {
            return (
                <div className="login-alert">
                    <FontAwesomeIcon className="alert-icon" icon={faExclamationTriangle} size="3x" />
                    <div className="alert-content">
                        <h4>{headline}</h4>
                        <p>{message}</p>
                    </div>
                </div>
            );
        }
    }

    return(
        <div className="login-body">
            {loginAlert()}
            <Form onSubmit={loginUser} className="login-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password" />
                </Form.Group>
                <div className="button-container">
                    <Button  type="submit" className="btn-block" variant="primary" size="lg">
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    )
}