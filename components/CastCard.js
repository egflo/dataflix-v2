import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress';
import Image from 'next/image'
import NoImage from '../public/no_photo.svg'
import validator from 'validator'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    
    castCard: {
        display: 'inline-block',
        width: '150px',
        height: '240px',
        border: '2px solid white',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',
        margin: '10px 5px 5px 5px',
        backgroundColor: '#fafafa',

        '&:hover': {
            border: '2px solid dodgerblue',
        },
    },

    castTitle: {
        margin: '5px 5px 5px 5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '95%',
        fontSize: '18px',
    },

    castBody: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '50px',
        width: '95%',
        margin: '0 auto 0 5px',
        color: 'gray',
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
            var object = JSON.parse(characters)
            return  object[0]
        }
        else {
            return ""
        }
    }

    return (
        <div onClick={handleClick} className={classes.castCard}>
            <div className={classes.castImage}>
                <Image
                    src={photo == null || !validator.isURL(photo) ? NoImage:photo}
                    layout='fill'
                    objectFit="cover"
                    alt="Not Found"
                >
                </Image>
            </div>

            <h4 className={classes.castTitle}>
                {name}
            </h4>

            <div className={classes.castBody}>
                {castCategory()}
                <br></br>
                {castCharacter()}
            </div>

        </div>
    );
}