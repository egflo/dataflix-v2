
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
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
export default function Login(props) {
    const router = useRouter()
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async event => {
        setLoading(true);
        event.preventDefault()
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL +'/user/auth',
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
            props.setalert({
                open: true,
                type: 'error',
                message: 'Invalid username or password'
            })
            setLoading(false);
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Something went wrong'
            })
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
        </div>
    )
}