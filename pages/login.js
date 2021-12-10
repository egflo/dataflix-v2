
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {getBaseURL} from "./api/Service";
import CircularProgress from '@mui/material/CircularProgress';
import {makeStyles} from "@material-ui/core/styles";


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
export default function Login() {
    const router = useRouter()
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [headline, setHeadline] = useState('');
    const [message, setMessage] = useState('');
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const [alert, setAlert] = useState({
        type: 'error',
        message: 'Incorrect Email/Password!'
    });

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const loginUser = async event => {
        setLoading(true);
        event.preventDefault()
        const res = await fetch(
            getBaseURL() +'/user/auth',
            {
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        )
        const result = await res.json()
        if(res.ok) {
            const {id,username,token, roles} = result;
            localStorage.setItem("userId", id);
            localStorage.setItem("token", token);
            setLoading(
                false,
                router.push('/')
            );

        }
        else if(res.status == 401) {
            setAlert({
                type: 'error',
                message: 'Authorization Failed.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
            setLoading(false);
        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to connect to Database.Try Again Later.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
            setLoading(false);
        }
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

            {loading ? <CircularProgress></CircularProgress> : null}

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                key={vertical + horizontal}
                onClose={handleClose}>

                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    )
}