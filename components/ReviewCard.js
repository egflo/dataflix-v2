import { useRouter } from 'next/router'

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Overlay from 'react-bootstrap/Overlay';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import  React, {useRef, useState} from 'react';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    reviewCard: {
        minWidth: '385px',
        height: '280px',
        margin: '5px',
        borderRadius: '5px',
        border: '2px solid white',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        '&:hover': {
            border: '2px solid dodgerblue',
        },
    },

    reviewBody: {
        margin: '10px 10px 10px 10px',
        overflow: 'hidden',
        height: '60%',
        display: '-webkit-box',
        webkitLineClamp: 7,
        webkitBoxOrient: 'vertical',
    },

    reviewTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    reviewHeader: {
        display: 'grid',
        gridTemplateColumns: '85% 15%',
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
        width: '65%',
        borderRadius: '5px',
        '& > *': {
            color: 'black',
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

}));

export default function ReviewCard({ review }) {
    const { id, movieId, customerId, text, rating, sentiment,title} = review

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

    function ReviewRating() {
        var style = {backgroundColor: "lightgray"}

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
            <div onClick={handleToggle} className={classes.reviewCard} ref={ref}>

                <div className={classes.reviewHeader}>

                    <div className={classes.reviewHeaderContent}>

                        <h4 className={classes.reviewTitle}>
                            {title}
                        </h4>

                        <p>By {customerId}</p>

                    </div>

                    <ReviewRating></ReviewRating>

                </div>

                <hr className={classes.reviewHeaderDivder}></hr>

                <div className={classes.reviewBody}>
                    <p>{text}</p>
                </div>

            </div>

            <Backdrop className={classes.backdrop} open={open} onClick={handleClose} ref={refOverlay}>
                <div className={classes.reviewExpanded}>
                    <div className={classes.reviewHeader}>

                        <div className={classes.reviewHeaderContent}>

                            <h4 className={classes.reviewTitle}>
                                {title}
                            </h4>

                            <p>By {customerId}</p>

                        </div>

                        <ReviewRating></ReviewRating>

                    </div>

                    <hr className={classes.reviewHeaderDivder}></hr>

                    <div className={classes.reviewExpandedBody}>
                        <p>{text}</p>
                    </div>
                </div>
            </Backdrop>

        </>
    );
}