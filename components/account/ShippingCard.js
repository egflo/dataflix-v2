import { useRouter } from 'next/router'

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import useSWR, { mutate } from 'swr'
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Backdrop,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    card: {
        background: 'white',
        borderRadius: '5px',

        zIndex: theme.zIndex.drawer + 1,

        [theme.breakpoints.down('sm')]: {
            width: '90vw',
            padding: '10px',

        },

        [theme.breakpoints.up('md')]: {
            minWidth: '900px',
            maxWidth: '900px',
            padding: '15px',
        },

    },
}));


const states = [
    {
        value: 'CA',
        label: 'California'
    },
];

const schema = yup.object().shape({
    firstname: yup.string()
        .required("First name is required"),
    lastname: yup.string()
        .required("Last name is required"),
    unit: yup.string(),
    street: yup.string()
        .min(5, "Too Short!")
        .required("Street is required"),
    city: yup.string()
        .min(2, "Too Short!")
        .required("City is required"),
    postcode: yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(5, "Too Short!")
        .required("Postcode is required")
});


export default function ShippingCard(props) {
    const {address, insert, alert, setalert} = props;

    const classes = useStyles();
    const router = useRouter()
    const ref = useRef(null);
    const formikRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [values, setValues] = useState({
        firstname: insert ? "" : address.firstname,
        lastname: insert ? "" : address.lastname,
        unit: insert ? "" : address.unit,
        street: insert ? "" : address.street,
        city: insert ? "" : address.city,
        state: insert ? "" : address.state,
        postcode: insert ? "" : address.postcode
    });

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

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
                formik.resetForm();
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
        if(!insert) {
            values['id'] = address['id'];
        }
        const form_object = JSON.stringify(values, null, 2);
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: (insert == true)? 'PUT':'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: form_object
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/address/', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            await mutate("/customer/");
            await mutate("/checkout/");
            setalert({
                open: true,
                message: "Address updated successfully",
                type: "success"
            });
        }
        else {
           setalert({
                open: true,
                message: "Address update failed",
                type: "error"
            });
        }
    }

    const formik = useFormik({
        initialValues: {
            ...values,
        },
        validationSchema: schema,
        onSubmit: (values) => {
            const json = JSON.stringify(values);
            setValues(values);
            handleSubmit(values);
            setLoading(true)
        },
    });

    return (
        <>
            <button onClick={handleToggle} className="edit-address">{(insert == true)? 'Add Address':'Change'}</button>

            <Backdrop className={classes.backdrop}  open={open}>
                    <div className={classes.card} ref={ref}>
                        <form
                            autoComplete="off"
                            noValidate
                            onSubmit={formik.handleSubmit}
                            onReset={formik.handleReset}
                            ref={formikRef}
                        >
                                <CardHeader
                                    subheader="The information can be edited"
                                    title={`Address Information`}
                                />
                                <Divider />
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the first name"
                                                label="First name"
                                                name="firstname"
                                                type="text"
                                                value={formik.values.firstname}
                                                onChange={formik.handleChange}
                                                error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                                helperText={formik.touched.firstname && formik.errors.firstname}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the last name"
                                                label="Last name"
                                                name="lastname"
                                                type="text"
                                                value={formik.values.lastname}
                                                onChange={formik.handleChange}
                                                error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                                helperText={formik.touched.lastname && formik.errors.lastname}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the unit"
                                                label="Unit"
                                                name="unit"
                                                type="text"
                                                value={formik.values.unit}
                                                onChange={formik.handleChange}
                                                error={formik.touched.unit && Boolean(formik.errors.unit)}
                                                helperText={formik.touched.unit && formik.errors.unit}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={8}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the street name"
                                                label="Street"
                                                name="street"
                                                type="text"
                                                value={formik.values.street}
                                                onChange={formik.handleChange}
                                                error={formik.touched.street && Boolean(formik.errors.street)}
                                                helperText={formik.touched.street && formik.errors.street}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={4}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the city"
                                                label="City"
                                                name="city"
                                                type="text"
                                                value={formik.values.city}
                                                onChange={formik.handleChange}
                                                error={formik.touched.city && Boolean(formik.errors.city)}
                                                helperText={formik.touched.city && formik.errors.city}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={4}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Select State"
                                                name="state"
                                                required
                                                select
                                                SelectProps={{ native: true }}
                                                value={formik.values.state}
                                                onChange={formik.handleChange}
                                                variant="outlined"
                                            >
                                                {states.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={4}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText="Please specify the postal code"
                                                label="Postal code"
                                                name="postcode"
                                                type="text"
                                                value={formik.values.postcode}
                                                onChange={formik.handleChange}
                                                error={formik.touched.postcode && Boolean(formik.errors.postcode)}
                                                helperText={formik.touched.postcode && formik.errors.postcode}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        p: 2
                                    }}
                                >
                                    <Button
                                        color="primary"
                                        variant="primary"
                                        type="submit"
                                    >
                                        Save details
                                    </Button>
                                </Box>
                        </form>
                    </div>
            </Backdrop>
        </>
    );
}