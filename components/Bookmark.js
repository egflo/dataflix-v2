
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import {getBaseURL, useGetMovieMeta} from '../pages/api/Service'
import IconButton from '@material-ui/core/IconButton';
import {getUserId} from '../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    bookmarkMovie: {
        //position: 'absolute',
        zIndex: 99,
        '& > *': {
            padding: '0',
        },
    },

}));

export default function Bookmark({id}) {

    const router = useRouter();
    const classes = useStyles();
    const { data, error, mutate } = useGetMovieMeta("/bookmark/"+id);

    async function handleBookmark() {
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                customerId: getUserId(),
                movieId:id,
            })
        };
        const res = await fetch(getBaseURL() + '/bookmark/', requestOptions)
        if(res.status < 300) {
            console.log("Bookmark");
        }
        else {
            console.log(res)

        }

        await mutate(data)
    }

    // Call this function whenever you want to
    // refresh props!
    function refresh() {
        router.replace(router.asPath);
    }

    function RateStatus() {

    }

    function BookmarkStatus() {
        if (error) return (
            <div className={classes.bookmarkMovie}>
                <IconButton onClick={handleBookmark} aria-label="bookmark">
                    <FontAwesomeIcon icon={faPlus} size="lg" style={{color: "#0d6efd"}} />
                </IconButton>
            </div>
        );
        if (!data) return (
            <div className={classes.bookmarkMovie}>
                <div className="loading-container"><CircularProgress/></div>
            </div>
        );
        else {
            return (
                <div className={classes.bookmarkMovie}>
                    <IconButton onClick={handleBookmark} aria-label="bookmark">
                        <FontAwesomeIcon icon={faMinus} size="lg" style={{color: "#0d6efd"}} />
                    </IconButton>
                </div>
            );
        }
    }

    return (
        <BookmarkStatus></BookmarkStatus>
    );
}