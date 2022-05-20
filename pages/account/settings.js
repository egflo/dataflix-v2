import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import {useGetUser} from '../../service/Service'
import CircularProgress from '@material-ui/core/CircularProgress';
import EmailCard from '../../components/account/EmailCard';
import PasswordCard from '../../components/account/PasswordCard';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {DashboardLayout} from "../../components/navigation/DashboardLayout";
import {Box, Card, CardContent, CardHeader, Divider} from "@mui/material";
import {checkCookies, getCookies} from "cookies-next";
import Shipping from "../shipping";

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
function User(props) {

    const router = useRouter();
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


    function Address() {
        const primary = addresses.find(element => element.id == primaryAddress);

        if (addresses.length === 0 || primary === undefined) {
            return(
                <div className={classes.settingsSection}>
                    <h5>Primary Address</h5>
                    <p>No shipping addresses found.</p>

                    <button onClick={handleToggle} className="edit-address">Change</button>
                </div>
            );
        }

        else {

            return (
                <div className={classes.settingsSection}>
                    <h5>Primary Address</h5>
                    <p>{primary.street + ", " + primary.city + ", " + primary.state + " " + primary.postcode}</p>

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
            <div className={classes.settingsContainer}>
                <CardHeader
                    title="User Settings"
                    subheader="Manage your account settings"
                />
                <Divider/>
                <CardContent>

                    <Box
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Address alert={props.alert} setalert={props.setalert}></Address>

                    </Box>

                    <Divider/>

                    <Box
                        sx={{
                            mt: 3,
                        }}
                    >
                        <div className={classes.settingsSection}>
                            <h5>Email Address</h5>
                            <p>{email}</p>

                            <EmailCard alert={props.alert} setalert={props.setalert}/>
                        </div>
                    </Box>


                    <Divider/>

                    <Box
                        sx={{
                            mt: 3,
                        }}
                    >
                        <div className={classes.settingsSection}>
                            <h5>Password</h5>
                            <p>***************</p>

                            <PasswordCard alert={props.alert} setalert={props.setalert}/>
                        </div>
                    </Box>

                </CardContent>

            </div>

        </>
    );
}

User.getLayout = (page) => (
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

export default User;