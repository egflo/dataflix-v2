import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import Switch from '@material-ui/core/Switch';
import PasswordStrengthBar from "react-password-strength-bar";
import {Link} from "@material-ui/core";
import {useRouter} from "next/router";
import {CardContent, CardHeader, Divider} from "@mui/material";


function validateEmail(value) {
    let error;
    if (!value) {
        error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = 'Invalid email address';
    }
    return error;
}

function validateUsername(value) {
    let error;
    if (value === 'admin') {
        error = 'Nice try!';
    }
    return error;
}

const useStyles = makeStyles((theme) => ({

    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'column',
        flexWrap: 'wrap',
        height: '100vh',
    },

    card: {
        background: 'white',

        padding: '15px',


        [theme.breakpoints.down('sm')]: {
            minHeight: '550px',
            maxHeight: '745px',
            width: '100vw',
        },

        [theme.breakpoints.up('md')]: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            borderRadius: '5px',
            minWidth: '500px',
            maxWidth: '500px',
            minHeight: '550px',
            maxHeight: '745px',
        },
    },
}));

const schema = yup.object().shape({
    firstname: yup.string()
        .required('Required')
        .min(1, 'Too Short!'),
    lastname: yup.string()
        .min(1, 'Too Short!')
        .required('Required'),
    email: yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email Format")
        .min(3, "Too Short!")
        .required("Email is required"),
    password: yup.string()
        .required("Password is required"),
});

export default function RegistrationForm(props){
    const classes = useStyles();
    const router = useRouter();
    const ref = useRef(null);
    const [checked, setChecked] = React.useState(false);
    const [loading, setLoading] = useState(false);


    function handleSwitch(event) {
        setChecked(event.target.checked);
    }

    const initalValues = {
        firstname: '',
        lastname: '',
        email: "",
        password: "",
    }

    async function handleSubmit(values) {
        const form_object = JSON.stringify(values, null, 2);
        alert(form_object);
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'My-Custom-Header': 'dataflix'
            },
            body: form_object
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/reg', requestOptions)
        const data = await  res.json()

        console.log(data);
        if(res.ok) {
            const {id,username,token, roles} = data;
            localStorage.setItem("userId", id);
            localStorage.setItem("token", token);
            await router.push({
                pathname: '/',
            })
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: `${data.message}`
            })

        }
    }

    function handleReset() {
        ref.current.resetForm();
    }

    return (
        <div className={classes.container}>
            <div className={classes.card} ref={ref}>
                <CardHeader
                    title="Register"
                    subheader="Please fill in the form below to register"
                />
                <Divider />
                <CardContent>
                    <Formik
                        innerRef={ref}
                        validationSchema={schema}
                        initialValues={initalValues}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={async (values) => {
                            setLoading(true);
                            await new Promise((r) => setTimeout(r, 500));
                            handleSubmit(values);
                            setLoading(false);
                        }}
                    >{({
                           handleSubmit,
                           handleChange,
                           handleBlur,
                           values,
                           touched,
                           isValid,
                           errors,

                       }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group as={Col} md="12" controlId="validationFormik01">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstname"
                                    placeholder=""
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isValid={touched.firstname && !errors.firstname}
                                    isInvalid={!!errors.firstname}
                                    feedback={errors.firstname}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstname}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="12" controlId="validationFormik02">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastname"
                                    placeholder=""
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isValid={touched.lastname && !errors.lastname}
                                    isInvalid={!!errors.lastname}
                                    feedback={errors.lastname}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastname}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="12" controlId="validationFormik03">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={!!errors.email}
                                    feedback={errors.email}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="12" controlId="validationFormik04">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type={checked ? "text": "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <PasswordStrengthBar password={values.password} />

                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>

                                <Form.Label>Show Password</Form.Label>
                                <Switch
                                    checked={checked}
                                    onChange={handleSwitch}
                                    name="checked"
                                    color="primary"
                                />
                            </Form.Group>

                            <Row className="justify-content-center">
                                <Button variant="primary" type="submit" className="btn-block" style={{width:'90%'}}>
                                    Create Account
                                </Button>
                                {loading ? <CircularProgress/> : null}
                            </Row>

                            <hr></hr>
                            <Row className="justify-content-center">
                                <p>Already have an account? <Link   onClick={() => {
                                    router.push('/login');
                                }} to="/login">Login</Link></p>
                            </Row>
                        </Form>
                    )}
                    </Formik>
                </CardContent>
            </div>
        </div>
    );
}

