import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';


import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {getUserId} from '../../utils/helpers'
import Switch from '@material-ui/core/Switch';
import PasswordStrengthBar from 'react-password-strength-bar';
import useSWR, { mutate } from 'swr'
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Backdrop,
} from '@mui/material';
import {axiosInstance} from "../../service/Service";


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
    password: yup.string()
        .required("Password is required"),
    newPassword: yup.string()
        .min(2, "Password must be at least 2 characters")
        .required("New Password is required"),
    newPasswordConfirm: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required("Must Confirm New Password"),
});


export default function PasswordCard() {
    const classes = useStyles();
    const ref = useRef(null);
    const formikRef = useRef(null);


    const [checked, setChecked] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleToggle = () => {
        setOpen(!open);
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
        axiosInstance.put('/customer/password', values)
            .then(res => {
                let response = res.data;
                mutate("/customer/");
                props.setalert({
                    open: true,
                    type: 'success',
                    message: response.message
                })

            }).catch (error => {
            props.setalert({
                open: true,
                type: 'error',
                message: error.message
            } )
        });
    }

    function handleSwitch(event) {
        setChecked(event.target.checked);
    }

    function handleReset() {
        formikRef.current.resetForm();
    }

    const initalValues = {
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
    }

    return (
        <>
            <button onClick={handleToggle} className="edit-address">Change</button>

            <Backdrop className={classes.backdrop}  open={open}>
                <Card className={classes.card} ref={ref}>
                    <CardHeader
                        subheader="The information can be edited"
                        title={`Change Password`}
                    />
                    <Divider />
                    <CardContent>
                        <Formik
                            innerRef={formikRef}
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
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="12" >
                                    <Form.Label>Show Passwords</Form.Label>
                                    <Switch
                                        checked={checked}
                                        onChange={handleSwitch}
                                        name="checked"
                                        color="primary"
                                    />
                                </Form.Group>

                                <hr></hr>

                                <Form.Group as={Col} md="12" controlId="validationFormik05">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type={checked ? "text": "password"}
                                        name="newPassword"
                                        placeholder="Password"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.newPassword}
                                    />

                                    <PasswordStrengthBar password={values.newPassword} />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.newPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="12" controlId="validationFormik06">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type={checked ? "text": "password"}
                                        name="newPasswordConfirm"
                                        placeholder="Password"
                                        value={values.newPasswordConfirm}
                                        onChange={handleChange}
                                        isInvalid={!!errors.newPasswordConfirm}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newPasswordConfirm}
                                    </Form.Control.Feedback>
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