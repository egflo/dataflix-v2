import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {getUserId} from '../../utils/helpers'
import Switch from '@material-ui/core/Switch';
import useSWR, { mutate } from 'swr'
import {
    Backdrop,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },

    card: {
        background: 'white',
        borderRadius: '5px',
        minWidth: '500px',
        maxWidth: '500px',
        padding: '15px',
        zIndex: theme.zIndex.drawer + 1,

        [theme.breakpoints.down('sm')]: {
            minWidth: '90vw',
            maxWidth: '90vw',
        },
    },
}));

//https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup

const schema = yup.object().shape({
    email: yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email Format")
        .min(3, "Too Short!")
        .required("Email is required"),
    emailConfirmation: yup.string()
        .oneOf([yup.ref('email'), null], 'Emails must match')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email Format")
        .min(3, "Too Short!")
        .required("Email is required"),
    password: yup.string()
        .required("Password is required"),
});


export default function EmailCard(props) {

    const classes = useStyles();
    const ref = useRef(null);
    const formikRef = useRef(null);

    const [checked, setChecked] = React.useState(false);
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

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && open) {
                setOpen(!open);
                handleReset();
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
        const res = await fetch( process.env.NEXT_PUBLIC_API_URL + '/customer/update/email', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            await mutate("/customer/");
            props.setalert({
                open: true,
                type: 'success',
                message: 'Updated'
            })
        }

        if(res.status == 404) {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Email not found.'
            })
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Error Updating Email.'
            })
        }
    }

    function handleSwitch(event) {
        setChecked(event.target.checked);
    }

    function handleReset() {
        formikRef.current.resetForm();
    }


    const initalValues = {
        email: "",
        emailConfirmation: "",
        password: "",
    }

    return (
        <>
            <button onClick={handleToggle} className="edit-address">Change</button>

            <Backdrop className={classes.backdrop}  open={open}>
                <Card className={classes.card} ref={ref}>
                    <CardHeader
                        subheader="The information can be edited"
                        title={`Change Email`}
                    />
                    <Divider />
                    <CardContent>
                        <Formik
                            innerRef={formikRef}
                            validationSchema={schema}
                            validateOnChange={false}
                            validateOnBlur={false}
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
                                <Form.Group as={Col} md="12" controlId="validationFormik01">
                                    <Form.Label>New Email</Form.Label>
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

                                <Form.Group as={Col} md="12" controlId="validationFormik02">
                                    <Form.Label>Confirm Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="emailConfirmation"
                                        placeholder="Confirm Email"
                                        value={values.emailConfirmation}
                                        onChange={handleChange}
                                        isValid={touched.emailConfirmation && !errors.emailConfirmation}
                                        isInvalid={!!errors.emailConfirmation}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.emailConfirmation}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <hr></hr>

                                <Form.Group as={Col} md="12" controlId="validationFormik03">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type={checked ? "text": "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password}
                                    />
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
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        Confirm Changes
                                    </Button>
                                </Row>
                            </Form>
                        )}
                        </Formik>
                    </CardContent>
                </Card>
            </Backdrop>
        </>
    );
}