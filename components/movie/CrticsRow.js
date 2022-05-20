
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Image from 'next/image'
import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronUp, faChevronDown, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Rating from '@material-ui/lab/Rating'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/NOIMAGE.png'
import {useGetMovieId,} from '../../service/Service'
import CastRow from '../../components/cast/CastRow'
import ReviewRow from '../../components/review/ReviewRow'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import Bookmark from '../../components/movie/Bookmark'
import ReviewCard from '../../components/review/ReviewCard'
import NoBackground from '/public/BACKGROUND.png'
import useSWR, { mutate } from 'swr'
import {DashboardLayout} from "../navigation/DashboardLayout";
import { SeverityPill } from '/components/severity-pill'
import {Box} from "@mui/material";


const useStyles = makeStyles((theme) => ({

    rottenTomatoes: {
        //display: 'grid',
        //gridTemplateColumns: '25% 20% 25% 20%',
        //gridTemplateColumns: '50% 50%',
        alignItems:'center',
        justifyContent:'center',
        height: '100%',
    },

    rottenImages: {
        position: 'relative',
        width: '30px',
        height: '30px',
        //height: '80%',
        //width: '70%',
        //top: '50%',
        //left: '50%',
        //transform: 'translate(-50%, -50%)',
    },

    rottenText: {
        fontSize: '22px',
        //margin: '0 auto',
        //marginTop: '5px',
        padding:'0',
        paddingLeft: '5px',
        margin:'0',
    },

    metacritic: {
        //display: 'grid',
        //gridTemplateColumns: '60% 40%',
        //height: '40px',
        //width: '80px',
        alignItems:'center',
        justifyContent:'center',
        height: '100%',
    },

    metacriticImage: {
        position: 'relative',
        width: '30px',
        height: '30px',
        flex: '1',
        //height: '75%',
        //width: '80%',
        //top: '50%',
        //left: '50%',
        //transform: 'translate(-50%, -50%)',
    },

    metacriticText: {
        fontSize: '22px',
        padding:'0',
        paddingLeft: '5px',
        margin:'0',
        flex: '1',
        //margin: '0 auto',
        //marginTop: '2px',
    },

    imdb: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        height: '100%',
        width: '115px',
        border: '2px solid #F0C514',
        borderRadius: '5px',
        //backgroundColor: 'white',
    },

    imdbImage: {
        position: 'relative',
        height: '100%'

    },

    imdbText: {
        "& span": {
            color: 'grey',
            fontSize: '10px',
        },
        fontSize: '15px',
        margin: '0 auto',
    },


}));


//https://medium.com/geekculture/how-to-use-react-router-useparams-436851fd5ef6
function CriticsRow(props) {
    const {ratings} = props.data;

    const router = useRouter();
    const classes = useStyles();


    function IMDB () {
        let rating = ratings['imdb'];
        let style = {display: 'flex', alignItems: 'center', justifyContent: 'center'};
        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            style = {display: 'none'}
        }

        return (
            <div style={style}>
                <div className={classes.imdb}>
                    <div className={classes.imdbImage}>
                        <Image
                            src="/imdb.png"
                            layout='fill'
                            objectFit="fit"
                            alt="Not Found"
                        ></Image>
                    </div>

                    <p className={classes.imdbText}>
                        <b>{rating}</b>
                        <span>/10</span>
                    </p>
                </div>
            </div>
        );
    }

    function Metacritic() {
        let rating = ratings['metacritic'];
        let style = {display: 'flex'};

        if(rating == null || rating.length == 0) {
            style = {display: 'none'};
        }

        else {
            rating = parseInt(rating);
        }

        return (
            <div style={style} className={classes.metacritic}>
                <div className={classes.metacriticImage}>
                    <Image
                        src="/metacritic.png"
                        layout='fill'
                        objectFit="fit"
                        alt="Not Found"
                    ></Image>
                </div>

                <p className={classes.metacriticText}>
                    <b>{rating}</b>
                </p>
            </div>
        );
    }

    function RottenTomatoes () {
        const rottenTomatoes = ratings['rottenTomatoes'];
        const rottenTomatoesStatus = ratings['rottenTomatoesStatus'];

        let rottenImage = "/rotten_none.png";
        let style = {display: 'flex'};

        if (rottenTomatoes != null){

            if(rottenTomatoes >= 90) {
                rottenImage = "/rotten_fresh.png";
            }
            else if (rottenTomatoes >= 60) {
                rottenImage = "/rotten_fresh.png";
            }
            else if (rottenTomatoes >= 1) {
                rottenImage = "/rotten_rotten.png";
            }

            else {
                style = {display: 'none'}
            }
        }

        if (rottenTomatoesStatus != null){
            if(rottenTomatoesStatus === "Certified-Fresh") {

                rottenImage = "/rotten_cert.png";
            }

            if(rottenTomatoesStatus === "Fresh") {
                rottenImage = "/rotten_fresh.png";

            }

            if(rottenTomatoesStatus === "Rotten") {
                rottenImage = "/rotten_rotten.png";
            }

        }

        if(rottenTomatoes == null && rottenTomatoesStatus == null) {
            return <></>
        }


        return (
            <div style={style} className={classes.rottenTomatoes}>
                <div className="rottenScore" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div className={classes.rottenImages}>
                        <Image
                            src={rottenImage}
                            layout='fill'
                            objectFit="fit"
                            alt="Not Found"
                        ></Image>
                    </div>
                    <p className={classes.rottenText}>
                        <b>{rottenTomatoes}%</b>
                    </p>
                </div>
            </div>
        );
    }
    
    function RottenTomatoesAudience() {
        const rottenTomatoesAudience = ratings['rottenTomatoesAudience'];
        const rottenTomatoesAudienceStatus = ratings['rottenTomatoesAudienceStatus'];

        let rottenAudienceRow = "";
        if ((rottenTomatoesAudienceStatus != null && rottenTomatoesAudience != null) && (rottenTomatoesAudience.length > 0 && rottenTomatoesAudience.length > 0)){

            var rottenAudienceImage = "/rotten_upright.png"

            if(rottenTomatoesAudienceStatus == "Upright") {

                rottenAudienceImage = "/rotten_upright.png"
            }

            if(rottenTomatoesAudienceStatus == "Spilled") {

                rottenAudienceImage = "/rotten_spilled.png"

            }

        }

        if (rottenTomatoesAudience === null || rottenTomatoesAudience.length === 0) {
            return <></>
        }

        return (
            <div className="audienceScore" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div className={classes.rottenImages}>
                    <Image
                        src={rottenAudienceImage}
                        layout='fill'
                        objectFit="fit"
                        alt="Not Found"
                    ></Image>
                </div>

                <p className={classes.rottenText}>
                    <b>{rottenTomatoesAudience}%</b>
                </p>

            </div>
        );
    }

    return (
        <div className="ratings-row">
                <IMDB></IMDB>
                <Metacritic></Metacritic>
                <RottenTomatoes></RottenTomatoes>
                <RottenTomatoesAudience></RottenTomatoesAudience>
        </div>
    );
}

export default CriticsRow;