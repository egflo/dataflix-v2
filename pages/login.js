
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import {makeStyles} from "@material-ui/core/styles";
import {axiosInstance} from "../service/Service.js";
import { setCookies } from 'cookies-next';


const useStyles = makeStyles((theme) => ({

    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        [theme.breakpoints.down('sm')]: {
            height: '100vh',
        },

        [theme.breakpoints.up('md')]: {
            height: '1000px',
        },
    },

    form: {
        [theme.breakpoints.down('sm')]: {
            height: '350px',
            width: '100vw',
        },

        [theme.breakpoints.up('md')]: {
            width: '600px',
            height: '350px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            paddingTop: '30px',
        },
    },
}));

//https://stackoverflow.com/questions/54604505/redirecting-from-server-side-in-nextjs
export default function Login(props) {
    const router = useRouter()
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async event => {
        setLoading(true);
        event.preventDefault()

        axiosInstance.post('/user/auth', {
            username: email,
            password: password
        }).then(response => {
            if (response.status === 200) {
                const {id, username, accessToken, refreshToken} = response.data;

                const options = {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                    secure: true,
                    sameSite: 'lax',
                };

                setCookies('accessToken', accessToken, options);
                setCookies('refreshToken', refreshToken, options);
                setCookies('username', username, options);
                setCookies('id', id, options);
                setCookies('isLoggedIn', true, options);

                router.push('/');
            }

            else {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: response.data.message
                })
            }
            setLoading(false);
        }).catch(error => {
            props.setalert({
                open: true,
                type: 'error',
                message: error.response.data.message
            })
            setLoading(false);
        });
    }

    useEffect(() => {
        //Prefetch the index page
        router.prefetch('/')
    }, [])

    function handleSignup() {
        router.push('/signup')
    }

    return(
        <div className={classes.container}>
            <Form onSubmit={loginUser} className={classes.form}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We will never share your email with anyone else.
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
                    <Button  type="submit" className="btn-block" variant="primary" size="lg" disabled={loading}>
                        Login
                    </Button>
                </div>
                <div className="button-container" style={{marginTop:'5px'}}>
                    <Button onClick={handleSignup} type="button" className="btn-block" variant="primary" size="lg" >
                        Create account
                    </Button>
                </div>
            </Form>
        </div>
    )
}