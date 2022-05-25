import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useGetUser} from '../../service/Service'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AddressCard from "../../components/account/AddressCard";
import {mutate} from "swr";
import {DashboardLayout} from "../../components/navigation/DashboardLayout";
import {axiosInstance} from "../../service/Service";
import {Card, CardContent, CardHeader, Divider} from "@mui/material";
import {checkCookies, getCookies} from "cookies-next";
import Shipping from "../shipping";

const useStyles = makeStyles((theme) => ({

    settingsContainer: {
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
function Address(props) {
    const {address, primary, alert, setalert} = props;
    const classes = useStyles();

    async function handleDelete(address) {
        const userId = localStorage.getItem("id")

        axiosInstance.delete(`/address/${address.id}`)
            .then(res => {
                mutate("/customer/");
                let data = res.data;
                props.setalert({
                    open: true,
                    type: data.success ? "success" : "error",
                    message: data.message
                });

            }) .catch(err => {
                props.setalert({
                    open: true,
                    type: "error",
                    message: err.message
                });
            });

    }
    async function handleDefault(id) {
        const userId = localStorage.getItem("id")
        const data = JSON.stringify({ id: userId, primaryAddress: id });

        axiosInstance.put('/customer/primary', data)
            .then(res => {
                let data = res.data;
                if(res.status === 200) {
                    mutate("/customer/");
                    props.setalert({
                        open: true,
                        type: 'success',
                        message: data.message
                    })
                }
                else {
                    props.setalert({
                        open: true,
                        type: 'error',
                        message: data.message
                    })
                }

            }).catch (error => {
            props.setalert({
                open: true,
                type: 'error',
                message: error.message
            } )
        });
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
                <AddressCard address={address} insert={false} setalert={setalert}/>
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

    if (error) return(
        <Card>
            <CardHeader
                title= "Error"
                subheader={"Status Code: " + error.status}
            />
            <Divider />
            <CardContent>
                <p>{error.message}</p>
            </CardContent>
        </Card>
    );

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
                        <AddressCard insert={true} setalert={props.setalert}/>
                    </div>

                    {addresses.map(address => (
                        <Address key={address.id} address={address} primary={(primaryAddress == address.id)? true: false} alert={props.alert} setalert={props.setalert}></Address>
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

// This gets called on every request
export const getServerSideProps = ({ req, res }) => {
    // Fetch data from external API
    // Pass data to the page via props
    const cookies = getCookies({ res, req });
    const isLoggedInExists = checkCookies('isLoggedIn', {res, req});
    const isLoggedIn = isLoggedInExists ? cookies.isLoggedIn : false;

    if (!isLoggedIn) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    return { props: { } }
}


export default Addresses;