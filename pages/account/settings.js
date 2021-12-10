import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import {useGetUser} from '../api/Service'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Row, Col} from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  {formatCurrency, getUserId} from '../../utils/helpers';
import ShippingCard from '../../components/ShippingCard';
import EmailCard from '../../components/EmailCard';
import PasswordCard from '../../components/PasswordCard';
import Navigation from '../../components/Navbar'
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    container: {
       // display: 'flex',
       // flexWrap: 'wrap',
       // alignItems: 'center',
       // justifyContent: 'center',
        width: '100%',
        height: '100%',
        marginTop: '20px',
    },

    text: {
        margin: 0,
        color: 'gray',
        paddingLeft: '10px',
    },

    settingsContainer: {

        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            height: '100%',
            overflow: 'auto',
            marginTop: '10px',
            '& > *': {
                paddingLeft: '10px',
            },
        },

        [theme.breakpoints.up('md')]: {
            minWidth: '500px',
            maxWidth: '500px',
            margin: '25px auto 0',
            padding: '15px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            '& > h4': {
                marginBottom: '20px',
            },

        },
    },

    settingsSection: {
        display: 'grid',
        gridTemplateColumns: '80% 20%',
    },
}));

//https://react-bootstrap.github.io/components/forms/
export default function User() {

    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetUser();

    if (error) return(
        <div>
            <Navigation></Navigation>
            <div className={classes.container}>
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" style={{color:'gray'}}/>
                <h3 className={classes.text}>Unable to load user information.</h3>
            </div>
        </div>
    );
    if (!data) return(
        <div>
            <Navigation></Navigation>
            <div className="user-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const {id, firstName, lastName, email, primaryAddressId, addresses} = data;

    function Address() {
        if (addresses.length === 0) {
            return(
                <div className={classes.settingsSection}>
                    <h5>Primary Address</h5>
                    <p>No shipping addresses found.</p>

                    <button onClick={handleToggle} className="edit-address">Change</button>
                </div>
            );
        }

        else {
            const primary_address = addresses.find(element => element.id == primaryAddressId);

            return (
                <div className={classes.settingsSection}>
                    <h5>Primary Address</h5>
                    <p>{primary_address.address + ", " + primary_address.city + ", " + primary_address.state + " " + primary_address.postcode}</p>

                    <button onClick={handleToggle} className="edit-address">Change</button>
                </div>
            );
        }

    }

    function handleToggle() {
        router.push("/account/addresses");
    }

    return (
        <>
            <Navigation />

            <div className={classes.settingsContainer}>
                    <h4>Account Settings</h4>

                    <Address></Address>

                    <hr></hr>

                    <div className={classes.settingsSection}>
                        <h5>Email Address</h5>
                        <p>{email}</p>

                        <EmailCard />
                    </div>

                    <hr></hr>

                    <div className={classes.settingsSection}>
                        <h5>Password</h5>
                        <p>***************</p>

                        <PasswordCard />
                    </div>
            </div>

        </>
    );
}