import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';
import Image from 'next/image'

import { useRouter } from 'next/router'
import {useGetMovieId} from '../pages/api/Service'
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Background({movie_id}) {
    const router = useRouter()

    const { data, error } = useGetMovieId(movie_id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    const { id, title, year, runtime, rated, background } = data

    return (
        <div className="movie-background">
            <Image
                className="background-image"
                src={background}
                width={1200}
                height={500}
                alt="Not Found"
            >
            </Image>

            <p className="background-headline">{title}</p>
            <p className="background-subheadline">{year} - {rated} - {runtime}</p>
        </div>

    );
}