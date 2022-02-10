import { useRouter } from 'next/router'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug} from "@fortawesome/free-solid-svg-icons";

import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        maxHeight: '100%',
        width: '100%',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',

    },
    context: {
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        width: '600px',
    },
}))

export default function Error() {
    const router = useRouter();
    const classes = useStyles();

    return (

        <div className={classes.container}>
            <div className={classes.context}>
                <FontAwesomeIcon icon={faBug} size="5x" style={{margin: '15px', color: "gray"}} />
                <h4 style={{color: "gray"}}>An internal server error has occurred.</h4>
            </div>
        </div>
    );
}