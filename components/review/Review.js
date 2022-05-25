import { useRouter } from 'next/router'

import Backdrop from '@mui/material/Backdrop'
import { faStar, faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { makeStyles } from '@material-ui/core/styles';

import  React, {useRef, useState} from 'react';
import {Card, CardContent, CardHeader, Divider} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    reviewCard: {
        minWidth: '385px',
        height: '280px',
        margin: '5px',
        marginRight: '5px',
        borderRadius: '5px',
        border: '2px solid white',
        //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        backgroundColor: '#fafafa',
        '&:hover': {
            border: '2px solid dodgerblue',
        },
    },

    reviewBody: {
        //margin: '10px 10px 10px 10px',
        //
        //whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        height: '145px',
        display: '-webkit-box',
        webkitLineClamp: 6,
        webkitBoxOrient: 'vertical',
        overflow: 'hidden',
        visibility: 'visible',
    },

    reviewTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width:'350px'
    },

    reviewHeader: {
        display: 'grid',
        //gridTemplateColumns: '85% 15%',
        gridTemplateColumns: '90% 5%',
        height: '80px',
    },

    reviewHeaderContent: {
        margin: '5px 5px 5px 5px',
    },

    reviewHeaderDivder: {
        borderTop: '2px solid #bbb',
        margin: '0',
        width: '100%',
    },

    reviewExpanded: {
        backgroundColor: 'white',
        borderRadius: '5px',
        '& > *': {
            color: 'black',
        },

        [theme.breakpoints.down('sm')]: {
            width: '90vw',

        },

        [theme.breakpoints.up('md')]: {
            width: '65%',
        },
    },

    reviewExpandedBody: {
        margin: '10px 10px 10px 10px',
    },

    reviewScore: {
        height: '50px',
        width: '50px',
        margin: 'auto',
        borderRadius: '50%',

    },

    score: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '99',
        color: 'black',
        fontSize: '2em',
        //font-weight: bold;
    },

    subheadline: {
        display:'flex',
        alignItems:'center',
        '& > p': {
            margin: '0',
            marginRight: '5px',
        },
    }

}));

export default function Review({ review }) {
    const { id, movieId, customerId, customer, text, rating, sentiment, title} = review

    const classes = useStyles();

    const router = useRouter()
    const ref = useRef(null);
    const refOverlay = useRef(null);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    function SentimentRating() {
        if(sentiment == "negative") {

            return <FontAwesomeIcon icon={faThumbsDown} style={{color:'red'}}></FontAwesomeIcon>

        }
        else {
            return  <FontAwesomeIcon icon={faThumbsUp} style={{color:'limegreen'}}></FontAwesomeIcon>
        }
    }

    function ReviewRating() {
        let style = {backgroundColor: "lightgray"};

        if (rating > 6) {
            style = {backgroundColor: "#6c3"}
        } else if (rating <= 6 && rating >= 5) {
            style = {backgroundColor: "#fc3"}
        } else {
            style = {backgroundColor: "#f00"}
        }

        return (
            <div style={style} className={classes.reviewScore}>
                <span className={classes.score}>{rating}</span>
            </div>
        );
    }

    return (
        <>
            <Card onClick={handleToggle} className={classes.reviewCard} ref={ref}>
                <CardHeader
                    title={
                        <h4 className={classes.reviewTitle}>
                            {title}
                        </h4>
                    }
                    subheader={
                        <div className={classes.subheadline}>
                            <p>By {customer.lastname}</p>

                            <FontAwesomeIcon icon={faStar} style={{color:'gold'}}></FontAwesomeIcon>
                            <p>{rating}<span style={{color:'black',fontSize:'12px'}}>/10</span></p>

                            <SentimentRating></SentimentRating>
                        </div>
                    }
                ></CardHeader>
                <Divider></Divider>
                <CardContent>
                    <p className={classes.reviewBody}>{text}</p>
                </CardContent>
            </Card>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
                ref={refOverlay}>

                <div className={classes.reviewExpanded}>
                    <Card>
                        <CardHeader
                            title={title}
                            subheader={
                                <div className={classes.subheadline}>
                                    <p>By {customer.lastname}</p>

                                    <FontAwesomeIcon icon={faStar} style={{color:'gold'}}></FontAwesomeIcon>
                                    <p>{rating}<span style={{color:'black',fontSize:'12px'}}>/10</span></p>

                                    <SentimentRating></SentimentRating>
                                </div>
                            }
                        ></CardHeader>
                        <Divider></Divider>
                        <CardContent>
                            <p>{text}</p>
                        </CardContent>
                    </Card>
                </div>
            </Backdrop>

        </>
    );
}