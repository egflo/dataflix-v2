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

const useStyles = makeStyles((theme) => ({

    settingsContainer: {
        minWidth: '500px',
        maxWidth: '500px',
        margin: '25px auto 0',
        padding: '15px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        '& > h4': {
            marginBottom: '20px',
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

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="user-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const {id, firstName, lastName, address, unit, email, city, state, postcode} = data;

    return (
        <>
            <Navigation />

            <div className={classes.settingsContainer}>
                    <h4>Account Settings</h4>

                    <div className={classes.settingsSection}>
                        <h5>Primary Address</h5>
                        <p>{address + ", " + city + ", " + state + " " + postcode}</p>

                        <ShippingCard address={data}/>
                    </div>

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