import { useRouter } from 'next/router'

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Overlay from 'react-bootstrap/Overlay';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {getUserId} from '../utils/helpers'
import useSWR, { mutate } from 'swr'

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    card: {
        background: 'white',
        borderRadius: '5px',
        minWidth: '900px',
        maxWidth: '900px',
        padding: '15px',
        zIndex: theme.zIndex.drawer + 1,
    },
}));

const schema = yup.object().shape({
    firstName: yup.string()
        .required("First name is required"),
    lastName: yup.string()
        .required("Last name is required"),
    unit: yup.string(),
    address: yup.string()
        .min(5, "Too Short!")
        .required("Address is required"),
    city: yup.string()
        .min(2, "Too Short!")
        .required("City is required"),
    zip: yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(5, "Too Short!")
        .required("Postcode is required")
});


export default function ShippingCard({address}) {

    const classes = useStyles();
    const router = useRouter()
    const ref = useRef(null);

    const [state, setState] = useState({
        openSnack: false,
        vertical: 'top',
        horizontal: 'center',
    });
    
    const { vertical, horizontal, openSnack } = state;
    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Updated'
    });
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setState({ ...state, openSnack: false });
    };

    // useOutsideAlerter(ref, open)
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && open) {
                setOpen(!open);

            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, open]);


    async function handleSubmit(values) {
        values['id'] = getUserId();
        const form_object = JSON.stringify(values, null, 2);

        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: form_object
        };
        const res = await fetch('http://localhost:8080/customer/update/address', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            mutate("/customer/");
            setAlert({
                type: 'success',
                message: 'Address Information Updated.'
            })
            setState({ openSnack: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable tp update Address Information. Try Again Later.'
            })
            setState({ openSnack: true, vertical: 'top', horizontal: 'center'});
        }

    }

    const initalValues = {
        firstName: address.firstName,
        lastName: address.lastName,
        unit: address.unit,
        address: address.address,
        city: address.city,
        state: address.state,
        zip: address.postcode
    }
    
    return (
        <>
            <button onClick={handleToggle} className="edit-address">Change</button>

            <Backdrop className={classes.backdrop}  open={open}>
                    <div className={classes.card} ref={ref}>
                        <Formik
                            validationSchema={schema}
                            initialValues={initalValues}
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
                                    <Row className="justify-content-center">
                                        <Form.Group as={Col} md="6" controlId="validationFormik01">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                isValid={touched.firstName && !errors.firstName}
                                                isInvalid={!!errors.firstName}
                                                feedback={errors.firstName}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" controlId="validationFormik02">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                isValid={touched.lastName && !errors.lastName}
                                                isInvalid={!!errors.lastName}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="justify-content-center">
                                        <Form.Group as={Col} md="5" controlId="validationFormik03">
                                            <Form.Label>Unit</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="unit"
                                                placeholder="Apt, suit, building, floor, etc."
                                                name="unit"
                                                value={values.unit}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="7" controlId="validationFormik04">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder="Street name, number, etc."
                                                value={values.address}
                                                onChange={handleChange}
                                                isValid={touched.address && !errors.address}
                                                isInvalid={!!errors.address}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.address}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="justify-content-center">
                                        <Form.Group as={Col} md="5" controlId="validationFormik05">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={values.city}
                                                onChange={handleChange}
                                                isValid={touched.city && !errors.city}
                                                isInvalid={!!errors.city}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.city}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group xs={Col} md="4" controlId="validationFormik06">
                                            <Form.Label>State</Form.Label>
                                            <select
                                                name="state"
                                                value={values.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                style={{ display: 'block', width:'225px', height: '39px' }}
                                            >
                                                <option value="CA" label="California" />
                                            </select>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationFormik07">
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="zip"
                                                placeholder="Postal Code/Zip Code"
                                                value={values.zip}
                                                onChange={handleChange}
                                                isValid={touched.zip && !errors.zip}
                                                isInvalid={!!errors.zip}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.zip}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="justify-content-center">
                                        <Button variant="primary" type="submit">
                                            Use this Address
                                        </Button>
                                        {loading ? <CircularProgress/> : null}
                                    </Row>
                                </Form>
                        )}
                        </Formik>
                    </div>
            </Backdrop>

            <Snackbar
                open={openSnack}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                key={vertical + horizontal}
                onClose={handleClose}>

                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}