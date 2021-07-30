import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';

import { useRouter } from 'next/router'
import {useGetMovieId} from '../api/Service'


export default function Background() {
    const router = useRouter()

    const { data, error } = useGetMovieId("tt0468569")

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    const { id, title, year, runtime, rated, background } = data

    return (
        <div className="movie-background">
            <img
                className="background-image"
                src={background}
                alt="Not Found"
            >
            </img>

            <p className="background-headline">{title}</p>
            <p className="background-subheadline">{year} - {rated} - {runtime}</p>
        </div>

    );
}