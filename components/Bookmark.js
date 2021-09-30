
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'

import CircularProgress from '@material-ui/core/CircularProgress'
import {useGetMovieMeta} from '../pages/api/Service'
import IconButton from '@material-ui/core/IconButton';
import {getUserId} from '../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    bookmarkMovie: {
        position: 'absolute',
        zIndex: 99,
        '& > *': {
            padding: '0px',
        },
    },

}));

export default function Bookmark({id}) {

    const router = useRouter();
    const classes = useStyles();
    const { data, error, mutate } = useGetMovieMeta("/bookmark/customer/" + id);

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
                movieId:id,
            })
        };
        const res = await fetch('http://localhost:8080/bookmark/update', requestOptions)
        if(res.status < 300) {
            console.log("Bookmark");
        }
        else {
            console.log(res)

        }

        console.log(mutate)
        mutate(data)
    }

    // Call this function whenever you want to
    // refresh props!
    function refresh() {
        router.replace(router.asPath);
    }

    function BookmarkStatus() {
        if (error) return (
            <div className={classes.bookmarkMovie}>
                <IconButton onClick={handleBookmark} aria-label="bookmark">
                    <FontAwesomeIcon icon={farBookmark} size="2x" style={{color: "dodgerblue"}} />
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
                        <FontAwesomeIcon icon={faBookmark} size="2x" style={{color: "dodgerblue"}} />
                    </IconButton>
                </div>
            );
        }
    }

    return (
        <BookmarkStatus></BookmarkStatus>
    );
}