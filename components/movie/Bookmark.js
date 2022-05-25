
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { useGetMovieMeta} from '../../service/Service'
import IconButton from '@material-ui/core/IconButton';
import {getUserId} from '../../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import {CircularProgress} from "@mui/material";
import {axiosInstance} from "../../service/Service";


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
        // POST request using fetch with set headers
        axiosInstance.post('/bookmark/', {
            customerId: getUserId(),
            movieId: props.id
        }).then(res => {
            console.log(res.data)
            if(res.status === 200 || res.status === 201) {
                props.setalert({
                    open: true,
                    type: 'success',
                    message: res.data.message
                })
            }
            else {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: res.data.message
                })
            }
            mutate(data)
        }).catch(err => {
            props.setalert({
                open: true,
                type: 'error',
                message: err.message
            })
        })

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