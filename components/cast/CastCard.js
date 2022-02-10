import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress';
import Image from 'next/image'
import NoImage from '../../public/NOPHOTO.svg'
import validator from 'validator'
import { makeStyles } from '@material-ui/core/styles';
import NoBackground from "../../public/BACKGROUND.png";
import {Card} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    
    castCard: {
        display: 'inline-block',
        width: '150px',
        height: '240px',
        border: '2px solid white',
       //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',
        margin: '5px',
        //margin: '10px 5px 5px 5px',
        //backgroundColor: '#fafafa',
        '&:hover': {
            border: '2px solid dodgerblue',
        },

    },

    content: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: '80px',
        width: '100%',
        textAlign: 'left',
        color: 'black',
        fontFamily: 'Roboto',
    },

    castTitle: {
        padding: '5px 5px 5px 5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '95%',
        height: '25px',
        fontSize: '18px',
    },

    castBody: {
        height: '50px',
        width: '100%',
        padding: '0px 5px 5px 5px',

        //margin: '0 auto 0 5px',

        '& > p': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'gray',
            height: '22px',
            margin: '0',
        },

    },

    castImage: {
        position: 'relative',
        height: '150px',
        width: '100%',
        '& > *': {
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
        }
    },
    
}));

export default function CastCard({ cast }) {
    const { starId, category, characters, name, photo} = cast;
    const router = useRouter();
    const classes = useStyles();

    function handleClick() {
        router.push({
            pathname: '/cast/[castId]',
            query: { castId: starId },
        })
    }

    function castCategory() {
        if(category != null) {
            let cast_category = category.charAt(0).toUpperCase() + category.slice(1);
            return cast_category;
        }

        else {
            return ""
        }
    }

    function castCharacter() {
        if(characters != null && characters.length != 0) {
            const object = JSON.parse(characters)
            return  object[0]
        }
        else {
            return ""
        }
    }

    return (
        <Card onClick={handleClick} className={classes.castCard}>
            <div className={classes.castImage}>
                <Image
                    src={photo == null || !validator.isURL(photo) ? NoImage:photo}
                    layout='fill'
                    objectFit="cover"
                    alt="Not Found"
                    placeholder="blur"
                    blurDataURL= {photo == null || !validator.isURL(photo) ? NoImage:photo}
                >
                </Image>
            </div>

            <div className={classes.content}>
                <h4 className={classes.castTitle}>
                    {name}
                </h4>

                <div className={classes.castBody}>
                    <p>{castCategory()}</p>
                    <p>{castCharacter()}</p>
                </div>

            </div>
        </Card>
    );
}