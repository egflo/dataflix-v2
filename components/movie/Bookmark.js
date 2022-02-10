
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { useGetMovieMeta} from '../../service/Service'
import IconButton from '@material-ui/core/IconButton';
import {getUserId} from '../../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import {useEffect, useState} from "react";
import {Circle} from "@mui/icons-material";
import {CircularProgress} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    bookmarkMovie: {
        //position: 'absolute',
        zIndex: 99,
        '& > *': {
            padding: '0',
        },
    },

}));

export default function Bookmark(props) {
    const router = useRouter();
    const classes = useStyles();
    const { data, error, mutate } = useGetMovieMeta("/bookmark/" + props.id);

    if (error) return (
        <div className={classes.bookmarkMovie}>
            <FontAwesomeIcon icon={faTimesCircle} size="lg" style={{color: "#0d6efd"}} />
        </div>
    );
    if (!data) return (
        <div className={classes.bookmarkMovie}>
            <CircularProgress style={{padding: "5px"}} />
        </div>
    );

    async function handleBookmark() {
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                customerId: getUserId(),
                movieId:props.id,
            })
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/bookmark/', requestOptions)
        if(res.status < 300) {
            props.setalert({
                open: true,
                type: 'success',
                message: 'Watchlist Updated'
            })
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Unable to update watchlist'
            })

        }

        await mutate(data)
    }

    const {success, message, bookmark} = data

    function BookmarkStatus() {
        if (error) return (
            <div className={classes.bookmarkMovie}>
                <IconButton onClick={handleBookmark} aria-label="bookmark">
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" style={{color: "#0d6efd"}} />
                </IconButton>
            </div>
        );
        if (!data) return (
            <div className={classes.bookmarkMovie}>
                <FontAwesomeIcon icon={faTimesCircle} size="lg" style={{color: "#0d6efd"}} />
            </div>
        );
        else {
            return (
                <div className={classes.bookmarkMovie}>
                    <IconButton onClick={handleBookmark} aria-label="bookmark">
                        <FontAwesomeIcon icon={faMinusCircle} size="lg" style={{color: "#0d6efd"}} />
                    </IconButton>
                </div>
            );
        }
    }
    return (
        <div className={classes.bookmarkMovie}>
            <IconButton onClick={handleBookmark} aria-label="bookmark">
                <FontAwesomeIcon icon={success ? faMinusCircle: faPlusCircle} size="lg" style={{color: "#0d6efd"}} />
            </IconButton>
        </div>
    );
}