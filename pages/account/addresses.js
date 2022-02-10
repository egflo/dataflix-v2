import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useGetUser} from '../../service/Service'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import ShippingCard from "../../components/account/ShippingCard";
import {mutate} from "swr";
import {DashboardLayout} from "../../components/nav/DashboardLayout";

const useStyles = makeStyles((theme) => ({

    settingsContainer: {

        //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        '& > h4': {
            marginBottom: '20px',
        },

        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            marginTop: '15px',
        },

        [theme.breakpoints.up('md')]: {
            minWidth: '950px',
            maxWidth: '950px',
            margin: '25px auto 0',
            padding: '15px',

        },

    },

    cardContainer: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        [theme.breakpoints.up('md')]: {
            gap: '5px',

        },
        //display: 'grid',
        //gridTemplateColumns: '33.33% 33.33% 33.33%',
    },

    divider: {
        display: '0 4px 8px 0 rgba(0,0,0,0.2)',
        margin: '5px',
        height: '20px',
        borderLeft: '1px solid #ccc',

    },

    add: {

        [theme.breakpoints.down('sm')]: {
            borderTop: '1px solid #ccc',
            width: '100vw',
            height: '200px',
        },

        [theme.breakpoints.up('md')]: {

            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            width: '300px',
            height: '200px',

        },

        position: 'relative',

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
        gridTemplateRows: '5px 20px 20px 20px 20px 70px 20px',
        '& > *': {
            margin: '0px',
        },

        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            marginTop: '15px',
            borderTop: '1px solid #ccc',
            padding: '10px',
        },

        [theme.breakpoints.up('md')]: {

            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            width: '300px',
            height: '200px',
            padding: '12px',

        },
    },
}));

//https://react-bootstrap.github.io/components/forms/

function AddressCard(props) {
    const {address, primary, alert, setalert} = props;
    const classes = useStyles();

    async function handleDelete(address) {
        const token = localStorage.getItem("token")
        const form_object = JSON.stringify(address, null, 2);
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
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/address/', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            mutate("/customer/");
            setalert({
                open: true,
                message: 'Address deleted successfully',
                type: 'success'
            })

        }
        else {
            setalert({
                open: true,
                message: 'Address could not be deleted',
                type: 'error'
            })
        }
    }

    async function handleDefault(id) {
        const token = localStorage.getItem("token")
        //const form_object = JSON.stringify(values, null, 2);
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            //body: form_object
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/address/primary/' + id, requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            mutate("/customer/");
            setalert({
                open: true,
                type: 'success',
                message: 'Address set as default'
            })

        }
        else {
            setalert({
                open: true,
                type: 'error',
                message: 'Unable to set Default Address. Try Again Later.'
            })
        }
    }

    return (
        <div className={classes.default}>
            <div style={{backgroundColor:(primary)? 'dodgerblue': 'white'}} className={classes.header}>
            </div>

            <p><b>{address.firstname + " " + address.lastname}</b></p>
            <p>{address.street}</p>
            <p>{address.city + ", " + address.state + " " + address.postcode}</p>
            <p>United States</p>

            <div></div>

            <div>
                <ShippingCard address={address} insert={false} setalert={setalert}/>
                <span className={classes.divider}></span>
                <button onClick={() => {handleDelete(address)}} className="edit-address">Remove</button>
                <span className={classes.divider}></span>
                {(primary)? "": <button onClick={() => {handleDefault(address.id)}} className="edit-address">Set as Default</button> }
            </div>
        </div>
    );
}

function Addresses(props) {
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

    const {id, firstName, lastName, email, primaryAddress, addresses} = data;

    return (
        <>
            <div className={classes.settingsContainer}>
                <h4>Your Addresses</h4>

                <div className={classes.cardContainer}>
                    <div className={classes.add}>
                        <ShippingCard insert={true} setalert={props.setalert}/>
                    </div>

                    {addresses.map(address => (
                        <AddressCard key={address.id} address={address} primary={(primaryAddress == address.id)? true: false} alert={props.alert} setalert={props.setalert}></AddressCard>
                    ))}
                </div>

            </div>
        </>
    );
}


Addresses.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Addresses;