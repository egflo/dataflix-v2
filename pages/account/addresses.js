import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useGetUser} from '../api/Service'
import CircularProgress from '@material-ui/core/CircularProgress';
import Navigation from '../../components/Navbar'
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import ShippingCard from "../../components/ShippingCard";
import {mutate} from "swr";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const useStyles = makeStyles((theme) => ({

    settingsContainer: {
        minWidth: '950px',
        maxWidth: '950px',
        margin: '25px auto 0',
        padding: '15px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        '& > h4': {
            marginBottom: '20px',
        },
    },

    cardContainer: {
        display: 'grid',
        gridTemplateColumns: '33.33% 33.33% 33.33%',
    },

    divider: {
        display: '0 4px 8px 0 rgba(0,0,0,0.2)',
        margin: '5px',
        height: '20px',
        borderLeft: '1px solid #ccc',

    },

    add: {
        position: 'relative',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        width: '300px',
        height: '200px',
        '& > button': {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '25px',
            color: 'gray',
            marginTop: '5px',
        },
    },

    header: {
        height: '5px',
        width: '100%',
    },

    default: {
        display: 'grid',
        margin: '0 auto',
        gridTemplateRows: '5px 20px 20px 20px 20px 70px 20px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        width: '300px',
        height: '200px',
        padding: '12px',
        '& > *': {
            margin: '0px',
        },
    },
}));

//https://react-bootstrap.github.io/components/forms/

function AddressCard({data, primary}) {
    const classes = useStyles();
    const {id, firstName, lastName, address, city, state, postcode} = data
    const addressData = data

    const [snack, setSnack] = useState({
        openSnack: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, openSnack } = state;
    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Updated'
    });

    async function handleDelete() {
        const token = localStorage.getItem("token")
        const values = {'id': id}
        const form_object = JSON.stringify(values, null, 2);
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: form_object
        };
        const res = await fetch('http://localhost:8080/address/', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            mutate("/customer/");
            setAlert({
                type: 'success',
                message: 'Address Deleted.'
            })
            setSnack({ openSnack: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to delete Address Information. Try Again Later.'
            })
            setSnack({ openSnack: true, vertical: 'top', horizontal: 'center'});
        }
    }

    async function handleDefault() {
        const token = localStorage.getItem("token")
        const values = {'primaryAddress': id}
        const form_object = JSON.stringify(values, null, 2);
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
        const res = await fetch('http://localhost:8080/customer/update/primary', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            mutate("/customer/");
            setAlert({
                type: 'success',
                message: 'Address default updated.'
            })
            setSnack({ openSnack: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to change default address. Try Again Later.'
            })
            setSnack({ openSnack: true, vertical: 'top', horizontal: 'center'});
        }
    }

    return (
        <div className={classes.default}>
            <div style={{backgroundColor:(primary)? 'dodgerblue': 'white'}} className={classes.header}>
            </div>

            <p><b>{firstName + " " + lastName}</b></p>
            <p>{address}</p>
            <p>{city + ", " + state + " " + postcode}</p>
            <p>United States</p>

            <div></div>

            <div>
                <ShippingCard address={addressData} insert={false}/>
                <span className={classes.divider}></span>
                <button onClick={handleDelete} className="edit-address">Remove</button>
                <span className={classes.divider}></span>
                {(primary)? "": <button onClick={handleDefault} className="edit-address">Set as Default</button> }
            </div>
        </div>
    );
}

export default function Addresses() {
    const classes = useStyles();
    const { data, error } = useGetUser();

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="user-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const {id, firstName, lastName, email, primaryAddressId, addresses} = data;

    return (
        <>
            <Navigation />

            <div className={classes.settingsContainer}>
                <h4>Your Addresses</h4>

                <div className={classes.cardContainer}>
                    <div className={classes.add}>
                        <FontAwesomeIcon style={{color:'lightgray', position: 'absolute', marginLeft: '45%',marginTop:'20%'}} icon={faPlus} size="2x" />
                        <ShippingCard insert={true}/>
                    </div>

                    {addresses.map(address => (
                        <AddressCard key={address.id} data={address} primary={(primaryAddressId == address.id)? true: false}></AddressCard>
                    ))}
                </div>

            </div>
        </>
    );
}